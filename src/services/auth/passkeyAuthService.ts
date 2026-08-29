/**
 * Passkeys WebAuthn — réservé QuizzMobile / usage web futur.
 * Le flux web principal utilise `passwordAuthService` (e-mail/pseudo + mot de passe).
 * Le refresh JWT commun reste `POST /auth/passkey/refresh` (password + passkey).
 */
import { AppConfig } from '@config';
import { parseQuizzApiError } from '@sdk';
import type {
  AuthSessionPayload,
  PasskeyAuthResult,
  PasskeyRegisterOptionsPayload,
} from '@app-types/authSession.types';

type ApiErrorBody = {
  error?: string;
  hint?: string;
  message?: string;
  code?: string;
  details?: unknown;
};

type JsonRecord = Record<string, unknown>;

export function toFrenchPasskeyError(raw: unknown): string {
  const message = raw instanceof Error ? raw.message : String(raw ?? '').trim();
  const lower = message.toLowerCase();

  if (!message) {
    return 'Une erreur est survenue. Réessayez.';
  }

  if (
    lower.includes('registrable domain suffix') ||
    lower.includes('well-known/webauthn') ||
    lower.includes('current domain') ||
    lower.includes('rp id') ||
    lower.includes('securityerror')
  ) {
    return 'La passkey ne peut pas être utilisée depuis cette origine. Vérifiez que le site et le backend partagent le même domaine RP (ex. quizzp.com).';
  }

  if (lower.includes('notallowederror') || lower.includes('not allowed')) {
    return 'Passkey refusée ou annulée.';
  }

  if (lower.includes('timed out') || lower.includes('timeout')) {
    return 'Délai dépassé. Réessayez la passkey.';
  }

  if (lower.includes('cancelled') || lower.includes('canceled') || lower.includes('annulée')) {
    return 'Opération passkey annulée.';
  }

  if (lower.includes('user verification')) {
    return 'Vérification biométrique requise. Réessayez avec votre empreinte, Face ID ou clé de sécurité.';
  }

  if (lower.includes('already') || lower.includes('409')) {
    return 'Pseudo, e-mail ou téléphone déjà utilisé.';
  }

  if (/[éèêàùçœ]/.test(message) || /^(impossible|aucun|saisissez|connexion|inscription|profil|compte)/i.test(message)) {
    return message;
  }

  if (
    /error:/i.test(message) ||
    lower.includes('unexpected') ||
    lower.includes('relying party') ||
    lower.includes('webauthn')
  ) {
    return 'Connexion passkey impossible. Vérifiez votre connexion et réessayez.';
  }

  return message;
}

async function apiPost<T>(path: string, body?: unknown, accessToken?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken?.trim()) {
    headers.Authorization = `Bearer ${accessToken.trim()}`;
  }

  const res = await fetch(`${AppConfig.API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
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

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64urlToBuffer(value: string): ArrayBuffer {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function credentialToJson(credential: PublicKeyCredential): JsonRecord {
  if (typeof credential.toJSON === 'function') {
    return credential.toJSON() as unknown as JsonRecord;
  }

  const response = credential.response;
  const json: JsonRecord = {
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    type: credential.type,
    clientExtensionResults: credential.getClientExtensionResults(),
  };

  if (response instanceof AuthenticatorAttestationResponse) {
    json.response = {
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      attestationObject: bufferToBase64url(response.attestationObject),
      transports: response.getTransports?.() ?? [],
    };
    json.authenticatorAttachment = credential.authenticatorAttachment ?? undefined;
  } else if (response instanceof AuthenticatorAssertionResponse) {
    json.response = {
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      authenticatorData: bufferToBase64url(response.authenticatorData),
      signature: bufferToBase64url(response.signature),
      userHandle: response.userHandle ? bufferToBase64url(response.userHandle) : null,
    };
  }

  return json;
}

async function nativeCreate(optionsJSON: JsonRecord): Promise<JsonRecord> {
  const PublicKey = PublicKeyCredential as typeof PublicKeyCredential & {
    parseCreationOptionsFromJSON?: (opts: JsonRecord) => PublicKeyCredentialCreationOptions;
  };

  if (typeof PublicKey.parseCreationOptionsFromJSON === 'function') {
    const publicKey = PublicKey.parseCreationOptionsFromJSON(optionsJSON);
    const credential = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null;
    if (!credential) throw new Error('Inscription passkey annulée.');
    return credentialToJson(credential);
  }

  const { startRegistration } = await import('@simplewebauthn/browser');
  return (await startRegistration({ optionsJSON: optionsJSON as never })) as unknown as JsonRecord;
}

async function nativeGet(optionsJSON: JsonRecord): Promise<JsonRecord> {
  const PublicKey = PublicKeyCredential as typeof PublicKeyCredential & {
    parseRequestOptionsFromJSON?: (opts: JsonRecord) => PublicKeyCredentialRequestOptions;
  };

  if (typeof PublicKey.parseRequestOptionsFromJSON === 'function') {
    const publicKey = PublicKey.parseRequestOptionsFromJSON(optionsJSON);
    const credential = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential | null;
    if (!credential) throw new Error('Connexion passkey annulée.');
    return credentialToJson(credential);
  }

  const { startAuthentication } = await import('@simplewebauthn/browser');
  return (await startAuthentication({ optionsJSON: optionsJSON as never })) as unknown as JsonRecord;
}

void base64urlToBuffer;

export async function registerWithPasskey(
  payload: PasskeyRegisterOptionsPayload,
): Promise<PasskeyAuthResult> {
  const step1 = await apiPost<{ options: JsonRecord; user_id: string }>(
    '/auth/passkey/register/options',
    payload,
  );

  let credential: JsonRecord;
  try {
    credential = await nativeCreate(step1.options);
  } catch (error) {
    throw new Error(toFrenchPasskeyError(error));
  }

  try {
    return await apiPost<PasskeyAuthResult>('/auth/passkey/register/verify', {
      user_id: step1.user_id,
      response: credential,
    });
  } catch (error) {
    throw new Error(toFrenchPasskeyError(error));
  }
}

export async function loginWithPasskey(params?: {
  email?: string;
  username?: string;
}): Promise<PasskeyAuthResult> {
  const body =
    params?.email?.trim()
      ? { email: params.email.trim() }
      : params?.username?.trim()
        ? { username: params.username.trim() }
        : undefined;

  const step1 = await apiPost<{ options: JsonRecord }>('/auth/passkey/login/options', body);

  let credential: JsonRecord;
  try {
    credential = await nativeGet(step1.options);
  } catch (error) {
    throw new Error(toFrenchPasskeyError(error));
  }

  try {
    return await apiPost<PasskeyAuthResult>('/auth/passkey/login/verify', { response: credential });
  } catch (error) {
    throw new Error(toFrenchPasskeyError(error));
  }
}

export async function refreshPasskeySession(refreshToken: string): Promise<AuthSessionPayload> {
  return apiPost<AuthSessionPayload>('/auth/passkey/refresh', {
    refresh_token: refreshToken,
  });
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const base = AppConfig.API_BASE_URL.replace(/\/api\/v1\/?$/, '');
    const res = await fetch(`${base}/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}
