import type { components } from '@sdk';
import type { AuthSessionPayload } from '@app-types/authSession.types';

type AuthUser = components['schemas']['AuthUser'];

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser;
  session?: AuthSessionPayload;
};

export interface ILoginGateway {
  signIn(credentials: LoginCredentials): Promise<LoginResult>;
  /** Optionnel — passkeys réservées au mobile ; no-op / erreur claire sur le web. */
  signInDiscoverable?(): Promise<LoginResult>;
}
