import { AUTH_STORAGE_KEYS } from '@constants/authStorageKeys';
import { webStorage } from '@platform/webStorage';

export interface IAuthTokenPersistence {
  readToken(): Promise<string | null>;
  writeToken(token: string): Promise<void>;
  clearToken(): Promise<void>;
}

export interface IAccountRegistrationPersistence {
  readHasRegisteredAccount(): Promise<boolean>;
  writeHasRegisteredAccount(value: boolean): Promise<void>;
}

export class ExpoAuthTokenPersistence implements IAuthTokenPersistence {
  async readToken(): Promise<string | null> {
    return webStorage.getItem(AUTH_STORAGE_KEYS.sessionToken);
  }

  async writeToken(token: string): Promise<void> {
    await webStorage.setItem(AUTH_STORAGE_KEYS.sessionToken, token);
  }

  async clearToken(): Promise<void> {
    await webStorage.removeItem(AUTH_STORAGE_KEYS.sessionToken);
  }
}

export class AsyncStorageAccountRegistrationPersistence implements IAccountRegistrationPersistence {
  async readHasRegisteredAccount(): Promise<boolean> {
    const v = await webStorage.getItem(AUTH_STORAGE_KEYS.hasRegisteredAccount);
    return v === '1';
  }

  async writeHasRegisteredAccount(value: boolean): Promise<void> {
    if (value) {
      await webStorage.setItem(AUTH_STORAGE_KEYS.hasRegisteredAccount, '1');
    } else {
      await webStorage.removeItem(AUTH_STORAGE_KEYS.hasRegisteredAccount);
    }
  }
}
