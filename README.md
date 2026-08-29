# Quizz+ Web (PWA)

Miroir web de **QuizzMobile** : même backend NestJS, mêmes règles métier, interface React responsive installable en PWA.

## Stack

- React 19 + TypeScript + Vite
- React Router, TanStack Query, Zustand, Axios
- Auth web : e-mail/pseudo + mot de passe (Nest JWT)
- Passkeys WebAuthn réservées au mobile (code conservé, hors flux web)
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
| Production | `VITE_APP_ENV=production` · `VITE_API_URL=https://api.quizzp.com/api/v1` |

Le backend NestJS n’est **pas** dans ce repo. En local, lance Quizzback sur le port 3000.

Health check : `https://api.quizzp.com/health`

### Catalogue quiz (catégories / questions)

Le listing **catégories + quiz** passe uniquement par Nest (`VITE_API_URL`), **pas** par Supabase PostgREST.

Endpoints attendus :

```http
GET /api/v1/categories
GET /api/v1/categories/:slug?sort=default|newest
GET /api/v1/quizzes/:quizId
POST /api/v1/quizzes/:quizId/complete
```

`GET /quizzes/:quizId` renvoie `{ quiz, questions }` pour lancer une partie (plus via Supabase PostgREST).

Réponses :

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Culture générale",
      "slug": "culture-generale",
      "icon": "book-open",
      "color": "#F5B200",
      "quiz_count": 12
    }
  ]
}
```

```json
{
  "category": {
    "id": "uuid",
    "name": "Culture générale",
    "slug": "culture-generale",
    "icon": "book-open",
    "color": "#F5B200",
    "quiz_count": 8
  },
  "quizzes": [
    {
      "id": "quiz-uuid",
      "title": "Les capitales du monde",
      "thumbnail_url": null,
      "total_questions": 10,
      "play_count": 2600,
      "created_at": "2026-01-10T12:00:00.000Z",
      "difficulty_level": "Z1",
      "points_per_question": 1,
      "max_score": 10,
      "player_best_score": 10,
      "is_completed_by_player": true
    }
  ]
}
```

Fallbacks acceptés si l’option A n’existe pas encore :

- `GET /categories/:slug/quizzes?sort=...`
- `GET /quizzes?category_slug=:slug&published=true`
- Progress joueur : `GET /users/me/quiz-scores?quiz_ids=...` (si Bearer et champs absents)

Si ces routes 404, l’UI affiche l’erreur + **Réessayer** (aucun mock silencieux).

**Les scores** passent uniquement par `POST /api/v1/quizzes/:quizId/complete` (Nest).

## Défis + Scoreboard

Les pages `/defis/**`, `/scoreboard` et `/players` passent uniquement par Nest (`VITE_API_URL` + Bearer JWT), **pas** par Supabase PostgREST.

Endpoints attendus :

```http
GET  /api/v1/defis/dashboard
GET  /api/v1/defis/challenges?status=active|past
GET  /api/v1/defis/challenges/:id
GET  /api/v1/defis/challenges/:id/leaderboard
POST /api/v1/defis/challenges/:id/participations   # optionnel si le complete quiz crédite déjà
GET  /api/v1/defis/competitions?tab=inscriptions|en_cours|fin
GET  /api/v1/defis/competitions/:id
POST /api/v1/defis/competitions/:id/register
POST /api/v1/defis/competitions/:id/unregister
GET  /api/v1/defis/competitions/:id/bracket
GET  /api/v1/defis/duels/pending?page=&limit=
GET  /api/v1/defis/duels/recent?page=&limit=
GET  /api/v1/defis/duels/:id
POST /api/v1/defis/duels
POST /api/v1/defis/duels/:id/accept
POST /api/v1/defis/duels/:id/decline
POST /api/v1/defis/duels/:id/score
GET  /api/v1/network/users?filter=friends&q=&page=&limit=
GET  /api/v1/leaderboard/players?limit=100
```

Dashboard :

```json
{
  "active_challenge_count": 1,
  "active_tournament_count": 2,
  "pending_duel_count": 3,
  "current_week_challenge": { "id": "...", "title": "...", "ends_at": "ISO" },
  "user_stats": { "defi_played": 4, "best_rank": 2, "duels_won": 1, "duels_total": 5 }
}
```

Si `GET /defis/dashboard` est en 404, l’UI dérive les compteurs depuis les listes challenges / tournois / duels (sans bloquer). Si **ces trois listes** 404 aussi : erreur + **Réessayer**, aucun mock.

### État backend actuel

Côté Nest, **`/defis/duels/*` est exposé**. `GET /defis/dashboard`, `/defis/challenges*` et `/defis/competitions*` peuvent encore répondre **404** tant qu’ils ne sont pas implémentés. Le web appelle déjà ces routes (JWT Bearer via `apiClient`) ; il **ne retombe pas sur Supabase**. Un 404 de route affiche un message clair (« pas encore disponible côté serveur ») + Réessayer. `POST /defis/challenges/:id/participations` est optionnel : un 404 est ignoré si le score est déjà crédité par `POST /quizzes/:id/complete`.

Challenge détail :

```json
{
  "challenge": { "id": "...", "title": "...", "ends_at": "...", "reward_text": "...", "status": "actif", "type": "hebdomadaire" },
  "daily_quizzes": [
    { "quiz_id": "...", "title": "...", "scheduled_day": "2026-08-20", "difficulty_label": "...", "played": false, "score": null }
  ],
  "user_rank": 3,
  "user_score": 12,
  "quizzes_played": 2,
  "total_quizzes": 7
}
```

Scoreboard :

```json
{
  "items": [{ "id": "...", "display_name": "...", "avatar_url": null, "score": 120, "rank": 1 }],
  "me": { "user_id": "...", "rank": 12 }
}
```

## Gains + Profil

Pages `/gains/**`, `/profile` et `/users/:userId` : Nest uniquement (`VITE_API_URL` + Bearer JWT).

```http
GET    /api/v1/auth/me
GET    /api/v1/leaderboard/players?limit=10
GET    /api/v1/users/:userId/profile
POST   /api/v1/users/me/avatar          # { image_base64 }
POST   /api/v1/users/me/cover           # { image_base64 }
POST   /api/v1/network/follow/:userId
DELETE /api/v1/network/follow/:userId
```

Hub Gains : rang + points via `auth/me` + leaderboard. Catalogue récompenses / historique : démo comme le mobile (pas d’API encore). Échanger affiche « Échange bientôt disponible ».

Profil self : tabs Mes quiz / Trophées / À propos, upload avatar/cover. Profil externe : `viewer_relationship` (`none` → Suivre, `pending` / `friends` désactivés).

## Authentification (web)

Flux principal du site (`https://quizzp.com`) :

1. Inscription : onboarding (type, workplace, profil) → `POST /auth/register` avec `{ email, username, password, … }`
2. Connexion : `POST /auth/login` avec `{ email | username, password }`
3. Mot de passe oublié : `POST /auth/forgot-password` → OTP → `POST /auth/verify-otp` → `POST /auth/reset-password`
4. Session JWT : `access_token` + `refresh_token` (localStorage) · intercepteur Axios Bearer · refresh via `POST /auth/passkey/refresh` (endpoint commun password + passkey)
5. Déconnexion : `POST /auth/logout`

### Passkeys (mobile uniquement)

Le code `passkeyAuthService` / WebAuthn reste dans le repo pour QuizzMobile ou un usage web futur, mais **n’est plus branché** sur `/login` et `/register` web.

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
