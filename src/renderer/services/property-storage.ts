import dayjs from 'dayjs';
import type { Property, PropertyFormData } from '../types/property';
import { generatePropertyId } from '../utils/id-generator';

const STORAGE_KEY = 'properties';

// ── IPC Result type matching main process ──
interface IpcResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function unwrap<T>(result: IpcResult<T>): T {
  if (!result.success) {
    throw new Error(result.error || '알 수 없는 오류가 발생했습니다.');
  }
  return result.data as T;
}

function isElectron(): boolean {
  return typeof window !== 'undefined' && !!window.propertyAPI;
}

// ── localStorage fallback (for tests) ──

function loadAll(): Property[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Property[]) : [];
  } catch {
    return [];
  }
}

function saveAll(properties: Property[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

function localSave(data: PropertyFormData, existingId?: string): Property {
  const now = dayjs().toISOString();
  const all = loadAll();

  if (existingId) {
    const index = all.findIndex((p) => p.id === existingId);
    if (index !== -1) {
      const existing = all[index];
      const updated: Property = {
        ...data,
        id: existingId,
        createdAt: existing.createdAt,
        updatedAt: now,
      };
      all[index] = updated;
      saveAll(all);
      return updated;
    }
  }

  const property: Property = {
    ...data,
    id: generatePropertyId(),
    createdAt: now,
    updatedAt: now,
  };
  all.push(property);
  saveAll(all);
  return property;
}

// ── Public API ──

export const propertyStorage = {
  async save(data: PropertyFormData, existingId?: string): Promise<Property> {
    if (isElectron()) {
      return unwrap(await window.propertyAPI!.save(data, existingId));
    }
    return localSave(data, existingId);
  },

  async getById(id: string): Promise<Property | null> {
    if (isElectron()) {
      return unwrap(await window.propertyAPI!.getById(id));
    }
    return loadAll().find((p) => p.id === id) ?? null;
  },

  async getAll(): Promise<Property[]> {
    if (isElectron()) {
      return unwrap(await window.propertyAPI!.getAll());
    }
    return loadAll();
  },

  async deleteById(id: string): Promise<void> {
    if (isElectron()) {
      unwrap(await window.propertyAPI!.delete(id));
      return;
    }
    saveAll(loadAll().filter((p) => p.id !== id));
  },

  async duplicate(id: string): Promise<Property | null> {
    if (isElectron()) {
      return unwrap(await window.propertyAPI!.duplicate(id));
    }
    const original = await this.getById(id);
    if (!original) return null;

    const now = dayjs().toISOString();
    const { id: _oldId, createdAt: _ca, updatedAt: _ua, ...formData } = original;

    const copy: Property = {
      ...formData,
      id: generatePropertyId(),
      createdAt: now,
      updatedAt: now,
    };
    const all = loadAll();
    all.push(copy);
    saveAll(all);
    return copy;
  },
};
