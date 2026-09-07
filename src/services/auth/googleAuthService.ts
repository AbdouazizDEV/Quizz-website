import { AppConfig } from '@config';
import type { PasskeyAuthResult } from '@app-types/authSession.types';
import { parseQuizzApiError } from '@sdk';

import { toFrenchPasswordAuthError } from './passwordAuthService';
import {
  GOOGLE_AUTH_ERROR_CODES,
  GOOGLE_AUTH_MESSAGES,
} from '@constants/auth.messages';

type ApiErrorBody = {
  error?: string;
  hint?: string;
  message?: string;
  code?: string;
};

export type GoogleAuthResult = PasskeyAuthResult & {
  is_new_user?: boolean;
};

function assertAuthResult(data: GoogleAuthResult, context: string): GoogleAuthResult {
  if (!data?.session?.access_token || !data.session.refresh_token) {
    throw new Error(`${context} : session absente.`);
  }
  if (!data.user) {
    throw new Error(`${context} : utilisateur absent.`);
  }
  return data;
}

export function toFrenchGoogleAuthError(raw: unknown): string {
  const status =
    typeof raw === 'object' && raw !== null && 'status' in raw
      ? Number((raw as { status?: number }).status)
      : undefined;
  const code =
    typeof raw === 'object' && raw !== null && 'code' in raw
      ? String((raw as { code?: string }).code ?? '')
      : '';
  const message = raw instanceof Error ? raw.message : String(raw ?? '').trim();
  const lower = message.toLowerCase();

  if (
    code === GOOGLE_AUTH_ERROR_CODES.accountNotRegistered ||
    lower.includes('inscrivez-vous')
  ) {
    return GOOGLE_AUTH_MESSAGES.accountNotRegistered;
  }

  if (status === 401 || lower.includes('token google') || lower.includes('invalid token')) {
    return 'Connexion Google refusée. Réessayez.';
  }
  if (status === 503 || lower.includes('non configurée')) {
    return 'Connexion Google indisponible sur le serveur.';
  }

  return toFrenchPasswordAuthError(raw);
}

export async function loginWithGoogleIdToken(idToken: string): Promise<GoogleAuthResult> {
  const token = idToken.trim();
  if (!token) {
    throw new Error('Connexion Google incomplète.');
  }

  const res = await fetch(`${AppConfig.API_BASE_URL}/auth/google/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: token }),
  });

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    const errBody = (json ?? {}) as ApiErrorBody;
    const message =
      parseQuizzApiError(errBody) ??
      errBody.error ??
      errBody.message ??
      `Requête échouée (${res.status}).`;
    const error = new Error(message) as Error & { status?: number; code?: string };
    error.status = res.status;
    error.code = errBody.code;
    throw error;
  }

  try {
    return assertAuthResult(json as GoogleAuthResult, 'Connexion Google');
  } catch (error) {
    throw new Error(toFrenchGoogleAuthError(error));
  }
}
