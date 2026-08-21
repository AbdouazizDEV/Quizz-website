import { webStorage } from '@platform/webStorage';

export const storage = {
  setItem: (key: string, value: string) => webStorage.setItem(key, value),
  getItem: (key: string) => webStorage.getItem(key),
  removeItem: (key: string) => webStorage.removeItem(key),
};
