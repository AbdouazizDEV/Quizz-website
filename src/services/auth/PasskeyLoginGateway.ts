import { loginWithPasskey } from './passkeyAuthService';
import type { ILoginGateway } from './ILoginGateway';
import type { components } from '@sdk';
import type { AuthSessionPayload } from '@app-types/authSession.types';

type AuthUser = components['schemas']['AuthUser'];

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export class PasskeyLoginGateway implements ILoginGateway {
  async signIn(credentials: { identifier: string }) {
    const identifier = credentials.identifier.trim();
    if (!identifier) {
      throw new Error('Saisissez votre e-mail ou nom d’utilisateur.');
    }

    const params = looksLikeEmail(identifier)
      ? { email: identifier.toLowerCase() }
      : { username: identifier };

    const { user, session } = await loginWithPasskey(params);
    const token = session.access_token;
    const refreshToken = session.refresh_token;
    if (!token || !refreshToken) {
      throw new Error('Session absente.');
    }
    return { accessToken: token, refreshToken, user: user as AuthUser, session };
  }

  async signInDiscoverable() {
    const { user, session } = await loginWithPasskey();
    const token = session.access_token;
    const refreshToken = session.refresh_token;
    if (!token || !refreshToken) {
      throw new Error('Session absente.');
    }
    return { accessToken: token, refreshToken, user: user as AuthUser, session };
  }
}

export type { AuthSessionPayload };
