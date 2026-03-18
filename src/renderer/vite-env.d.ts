/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

interface IpcResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface PropertyAPI {
  save: (data: import('./types/property').PropertyFormData, id?: string) => Promise<IpcResult<import('./types/property').Property>>;
  getAll: () => Promise<IpcResult<import('./types/property').Property[]>>;
  getById: (id: string) => Promise<IpcResult<import('./types/property').Property | null>>;
  delete: (id: string) => Promise<IpcResult<boolean>>;
  duplicate: (id: string) => Promise<IpcResult<import('./types/property').Property | null>>;
}

interface Window {
  electronAPI: {
    platform: string;
  };
  propertyAPI?: PropertyAPI;
}
