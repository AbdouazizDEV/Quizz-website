export interface LoginCredentials {
  identifier: string;
}

import type { components } from '@sdk';
import type { AuthSessionPayload } from '@app-types/authSession.types';

type AuthUser = components['schemas']['AuthUser'];

export interface ILoginGateway {
  signIn(credentials: LoginCredentials): Promise<{
    accessToken: string;
    refreshToken: string;
    user?: AuthUser;
    session?: AuthSessionPayload;
  }>;
  signInDiscoverable(): Promise<{
    accessToken: string;
    refreshToken: string;
    user?: AuthUser;
    session?: AuthSessionPayload;
  }>;
}
