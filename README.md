# Quizz+ Web (PWA)

Miroir web de **QuizzMobile** : même backend NestJS, mêmes règles métier, interface React responsive installable en PWA.

## Stack

- React 19 + TypeScript + Vite
- React Router, TanStack Query, Zustand, Axios
- Passkeys WebAuthn (`navigator.credentials.create/get`)
- `vite-plugin-pwa`

## Lancer en local

```bash
npm install
cp .env.example .env   # déjà présent : API locale
npm run dev
```

Ouvre `http://localhost:5173`.

### Pointer vers le backend

| Environnement | Variables |
|---|---|
| Local | `VITE_APP_ENV=local` · `VITE_API_URL=http://localhost:3000/api/v1` |
| Production | `VITE_APP_ENV=production` · `VITE_API_URL=https://quizz-p4ze.onrender.com/api/v1` |

Le backend NestJS n’est **pas** dans ce repo. En local, lance Quizzback sur le port 3000.

Health check : `https://quizz-p4ze.onrender.com/health`

### Catalogue quiz (catégories / questions)

La lecture du catalogue (comme le mobile) passe par Supabase en lecture seule. Sans `VITE_SUPABASE_URL` / `VITE_SUPABASE_KEY`, l’app affiche un catalogue de démonstration.

**Les scores** passent uniquement par `POST /api/v1/quizzes/:quizId/complete` (Nest), jamais par PostgREST.

## Passkeys (WebAuthn)

Flux :

1. Inscription : `POST /auth/passkey/register/options` → `navigator.credentials.create` → `POST /auth/passkey/register/verify`
2. Connexion : `POST /auth/passkey/login/options` → `navigator.credentials.get` → `POST /auth/passkey/login/verify`
3. Session JWT : `access_token` + `refresh_token` (localStorage) · intercepteur Axios Bearer · refresh sur 401 via `POST /auth/passkey/refresh`

Backend actuel :

- `WEBAUTHN_RP_ID=quizz-p4ze.onrender.com`
- `WEBAUTHN_ORIGIN=https://quizz-p4ze.onrender.com`

**En local**, les passkeys ne fonctionnent que si le backend accepte l’origine Vite (`http://localhost:5173`) et un RP ID compatible (`localhost`).  
**En production**, héberger ce PWA sur un domaine lié au RP ID (idéalement sous `quizz-p4ze.onrender.com`).

## Scripts

```bash
npm run dev              # Vite, mode development (.env)
npm run build            # tsc + Vite (mode production)
npm run preview          # prévisualiser le build
npm run sdk:generate     # régénérer le SDK OpenAPI
```

## PWA

Le plugin génère le manifest **Quizz+** (theme orange `#F5A623`), le service worker (app-shell + icônes) et l’installabilité (Add to Home Screen). HTTPS requis en production.

Les sons quiz (certains > 2 Mo) ne sont **pas** précachés : ils sont servis à la demande et mis en cache runtime (`CacheFirst`).

## Structure

```
src/
  app/           providers, router, layouts
  pages/         écrans web
  components/ui/ UI responsive
  services/      portés depuis le mobile
  domain/        règles pures
  stores/ hooks/ types/ sdk/
config/          local | staging | production
public/assets/   copie des assets mobile
openapi/         contrat API
```
