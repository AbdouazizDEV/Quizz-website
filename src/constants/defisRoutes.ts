export const DefisRoutes = {
  hub: '/defis',
  challengeList: '/defis/challenge',
  challengeDetail: (id: string) => `/defis/challenge/${encodeURIComponent(id)}` as const,
  challengeLeaderboard: (id: string) =>
    `/defis/challenge/classement/${encodeURIComponent(id)}` as const,
  tournoiList: '/defis/tournoi',
  tournoiDetail: (id: string) => `/defis/tournoi/${encodeURIComponent(id)}` as const,
  tournoiBracket: (id: string) => `/defis/tournoi/bracket/${encodeURIComponent(id)}` as const,
  duelHub: '/defis/duel',
  duelFriendsList: '/defis/duel/amis',
  duelPendingList: '/defis/duel/en-attente',
  duelRecentList: '/defis/duel/recents',
  duelDetail: (id: string) => `/defis/duel/${encodeURIComponent(id)}` as const,
  duelResult: (id: string) => `/defis/duel/resultat/${encodeURIComponent(id)}` as const,
} as const;
