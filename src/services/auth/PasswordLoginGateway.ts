import { loginWithPassword } from './passwordAuthService';
import type { ILoginGateway, LoginResult } from './ILoginGateway';
import type { components } from '@sdk';
import type { AuthSessionPayload } from '@app-types/authSession.types';

type AuthUser = components['schemas']['AuthUser'];

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export class PasswordLoginGateway implements ILoginGateway {
  async signIn(credentials: { identifier: string; password: string }): Promise<LoginResult> {
    const identifier = credentials.identifier.trim();
    const password = credentials.password;
    if (!identifier) {
      throw new Error('Saisissez votre e-mail ou nom d’utilisateur.');
    }
    if (!password) {
      throw new Error('Saisissez votre mot de passe.');
    }

    const params = looksLikeEmail(identifier)
      ? { email: identifier.toLowerCase(), password }
      : { username: identifier, password };

    const { user, session } = await loginWithPassword(params);
    const token = session.access_token;
    const refreshToken = session.refresh_token;
    if (!token || !refreshToken) {
      throw new Error('Session absente.');
    }
    return { accessToken: token, refreshToken, user: user as AuthUser, session };
  }

  async signInDiscoverable(): Promise<LoginResult> {
    throw new Error(
      'Connexion passkey indisponible sur le web. Utilisez votre e-mail ou pseudo et votre mot de passe.',
    );
  }
}

export type { AuthSessionPayload };
