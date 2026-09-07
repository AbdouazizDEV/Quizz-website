import { AppConfig } from '@config';
import { parseQuizzApiError } from '@sdk';
import type { AuthSessionPayload, PasskeyAuthResult } from '@app-types/authSession.types';

type ApiErrorBody = {
  error?: string;
  hint?: string;
  message?: string;
  code?: string;
  details?: unknown;
};

export type PasswordLoginParams = {
  email?: string;
  username?: string;
  password: string;
};

export type PasswordRegisterParams = {
  email: string;
  username: string;
  password: string;
  account_type?: string;
  workplace?: string;
  full_name?: string;
  birth_date?: string;
  country_code?: string;
  phone?: string;
  gender?: 'male' | 'female';
};

export function toFrenchPasswordAuthError(raw: unknown): string {
  const status =
    typeof raw === 'object' && raw !== null && 'status' in raw
      ? Number((raw as { status?: number }).status)
      : undefined;
  const message = raw instanceof Error ? raw.message : String(raw ?? '').trim();
  const lower = message.toLowerCase();

  if (status === 401 || lower.includes('identifiants invalides') || lower.includes('invalid login')) {
    return 'Identifiants invalides.';
  }

  if (status === 409 || lower.includes('already') || lower.includes('déjà')) {
    if (lower.includes('email') || lower.includes('e-mail') || lower.includes('mail')) {
      return 'Cet e-mail est déjà pris.';
    }
    if (lower.includes('username') || lower.includes('pseudo') || lower.includes('utilisateur')) {
      return 'Ce pseudo est déjà pris.';
    }
    return 'Ce pseudo ou e-mail est déjà pris.';
  }

  if (!message) {
    return 'Une erreur est survenue. Réessayez.';
  }

  if (
    /[éèêàùçœ]/.test(message) ||
    /^(impossible|aucun|saisissez|connexion|inscription|profil|compte|identifiants|ce )/i.test(message)
  ) {
    return message;
  }

  return message;
}

async function apiPostAuth<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${AppConfig.API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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

  return json as T;
}

function assertAuthResult(data: PasskeyAuthResult, context: string): PasskeyAuthResult {
  if (!data?.session?.access_token || !data.session.refresh_token) {
    throw new Error(`${context} : session absente.`);
  }
  if (!data.user) {
    throw new Error(`${context} : utilisateur absent.`);
  }
  return data;
}

export async function loginWithPassword(params: PasswordLoginParams): Promise<PasskeyAuthResult> {
  const password = params.password;
  if (!password) {
    throw new Error('Saisissez votre mot de passe.');
  }

  const email = params.email?.trim().toLowerCase();
  const username = params.username?.trim();
  if (!email && !username) {
    throw new Error('Saisissez votre e-mail ou nom d’utilisateur.');
  }
  if (email && username) {
    throw new Error('Utilisez l’e-mail ou le pseudo, pas les deux.');
  }

  const body = email ? { email, password } : { username, password };

  try {
    const data = await apiPostAuth<PasskeyAuthResult>('/auth/login', body);
    return assertAuthResult(data, 'Connexion');
  } catch (error) {
    throw new Error(toFrenchPasswordAuthError(error));
  }
}

export async function registerWithPassword(
  params: PasswordRegisterParams,
): Promise<PasskeyAuthResult> {
  const email = params.email.trim().toLowerCase();
  const username = params.username.trim();
  const password = params.password;

  if (!email || !username || !password) {
    throw new Error('Renseignez le nom d’utilisateur, l’e-mail et le mot de passe.');
  }
  if (password.length < 6) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
  }

  const body: PasswordRegisterParams = {
    email,
    username,
    password,
    account_type: params.account_type,
    workplace: params.workplace,
    full_name: params.full_name,
    birth_date: params.birth_date,
    country_code: params.country_code,
    phone: params.phone,
    gender: params.gender,
  };

  try {
    const data = await apiPostAuth<PasskeyAuthResult>('/auth/register', body);
    return assertAuthResult(data, 'Inscription');
  } catch (error) {
    throw new Error(toFrenchPasswordAuthError(error));
  }
}

export type { AuthSessionPayload, PasskeyAuthResult };
