import { app, BrowserWindow, shell, ipcMain, session } from 'electron';
import { join } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import dayjs from 'dayjs';
import type { Property, PropertyFormData } from '../renderer/types/property';

const isDev = !app.isPackaged;

const propertiesDir = path.join(app.getPath('userData'), 'properties');

// ── Result type for safe IPC error serialization ──
interface IpcResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function ok<T>(data: T): IpcResult<T> {
  return { success: true, data };
}

function fail<T>(error: string): IpcResult<T> {
  return { success: false, error };
}

// ── Helpers ──

function ensurePropertiesDir(): void {
  if (!fs.existsSync(propertiesDir)) {
    fs.mkdirSync(propertiesDir, { recursive: true });
  }
}

function generatePropertyId(): string {
  const now = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const digits = String(now).slice(-6) + String(random).padStart(3, '0');
  return `#Y${digits}`;
}

/** Sanitize ID to prevent path traversal */
function sanitizeId(id: unknown): string | null {
  if (typeof id !== 'string') return null;
  // Only allow #Y followed by digits
  if (!/^#Y\d{9}$/.test(id)) return null;
  return id;
}

// ── IPC Handlers (grouped by domain) ──

function registerPropertyHandlers(): void {
  ensurePropertiesDir();

  ipcMain.handle('property:save', async (_event, data: PropertyFormData, existingId?: string): Promise<IpcResult<Property>> => {
    try {
      // Validate existingId if provided
      if (existingId !== undefined) {
        const cleanId = sanitizeId(existingId);
        if (!cleanId) return fail('유효하지 않은 물건번호입니다.');
        existingId = cleanId;
      }

      const id = existingId || generatePropertyId();
      const now = dayjs().toISOString();

      let createdAt = now;
      if (existingId) {
        const existingPath = path.join(propertiesDir, `${existingId}.json`);
        if (fs.existsSync(existingPath)) {
          const existingData = JSON.parse(fs.readFileSync(existingPath, 'utf-8')) as Property;
          createdAt = existingData.createdAt;
        }
      }

      const property: Property = {
        ...data,
        id,
        createdAt,
        updatedAt: now,
      };

      const filePath = path.join(propertiesDir, `${id}.json`);
      await fs.promises.writeFile(filePath, JSON.stringify(property, null, 2), 'utf-8');
      return ok(property);
    } catch (err) {
      return fail((err as Error).message);
    }
  });

  ipcMain.handle('property:getAll', async (): Promise<IpcResult<Property[]>> => {
    try {
      ensurePropertiesDir();
      const files = await fs.promises.readdir(propertiesDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      const properties: Property[] = [];
      for (const file of jsonFiles) {
        const filePath = path.join(propertiesDir, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        properties.push(JSON.parse(content) as Property);
      }

      properties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return ok(properties);
    } catch (err) {
      return fail((err as Error).message);
    }
  });

  ipcMain.handle('property:getById', async (_event, id: string): Promise<IpcResult<Property | null>> => {
    try {
      const cleanId = sanitizeId(id);
      if (!cleanId) return fail('유효하지 않은 물건번호입니다.');

      const filePath = path.join(propertiesDir, `${cleanId}.json`);
      if (!fs.existsSync(filePath)) return ok(null);
      const content = await fs.promises.readFile(filePath, 'utf-8');
      return ok(JSON.parse(content) as Property);
    } catch (err) {
      return fail((err as Error).message);
    }
  });

  ipcMain.handle('property:delete', async (_event, id: string): Promise<IpcResult<boolean>> => {
    try {
      const cleanId = sanitizeId(id);
      if (!cleanId) return fail('유효하지 않은 물건번호입니다.');

      const filePath = path.join(propertiesDir, `${cleanId}.json`);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
      return ok(true);
    } catch (err) {
      return fail((err as Error).message);
    }
  });

  ipcMain.handle('property:duplicate', async (_event, id: string): Promise<IpcResult<Property | null>> => {
    try {
      const cleanId = sanitizeId(id);
      if (!cleanId) return fail('유효하지 않은 물건번호입니다.');

      const filePath = path.join(propertiesDir, `${cleanId}.json`);
      if (!fs.existsSync(filePath)) return ok(null);

      const content = await fs.promises.readFile(filePath, 'utf-8');
      const original = JSON.parse(content) as Property;

      const now = dayjs().toISOString();
      const newId = generatePropertyId();
      const { id: _oldId, createdAt: _ca, updatedAt: _ua, ...formData } = original;

      const copy: Property = {
        ...formData,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };

      const newFilePath = path.join(propertiesDir, `${newId}.json`);
      await fs.promises.writeFile(newFilePath, JSON.stringify(copy, null, 2), 'utf-8');
      return ok(copy);
    } catch (err) {
      return fail((err as Error).message);
    }
  });
}

// ── Window Creation (Secure defaults) ──

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// ── App Lifecycle ──

app.whenReady().then(() => {
  // CSP: restrict scripts to self only
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"],
      },
    });
  });

  registerPropertyHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
