import type { components } from '@sdk';

export type AuthUser = components['schemas']['AuthUser'];

/** Session JWT émise par le backend NestJS (passkey). */
export interface AuthSessionPayload {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  expires_at?: number;
  token_type?: string;
}

export interface PasskeyAuthResult {
  user: AuthUser;
  session: AuthSessionPayload;
}

export interface PasskeyRegisterOptionsPayload {
  email: string;
  username: string;
  account_type?: string;
  workplace?: string;
  full_name?: string;
  birth_date?: string;
  country_code?: string;
  phone?: string;
}
