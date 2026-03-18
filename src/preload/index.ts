import { contextBridge, ipcRenderer } from 'electron';

// Typed function wrappers - never expose raw ipcRenderer
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
});

contextBridge.exposeInMainWorld('propertyAPI', {
  save: (data: unknown, id?: string) => ipcRenderer.invoke('property:save', data, id),
  getAll: () => ipcRenderer.invoke('property:getAll'),
  getById: (id: string) => ipcRenderer.invoke('property:getById', id),
  delete: (id: string) => ipcRenderer.invoke('property:delete', id),
  duplicate: (id: string) => ipcRenderer.invoke('property:duplicate', id),
});
