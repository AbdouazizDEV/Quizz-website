import { Routes } from '@constants/Routes';

export type HomeNavItemId = 'home' | 'play' | 'defis' | 'gains' | 'profile';

export const HOME_NAV_ITEMS: Array<{
  id: HomeNavItemId;
  icon: string;
  label: string;
  to: string;
}> = [
  { id: 'home', icon: 'home', label: 'Accueil', to: Routes.HOME },
  { id: 'play', icon: 'play-circle', label: 'Jouer', to: Routes.CATEGORIES },
  { id: 'defis', icon: 'flag', label: 'Défis', to: Routes.DEFIS },
  { id: 'gains', icon: 'gift', label: 'Gains', to: Routes.GAINS },
  { id: 'profile', icon: 'user', label: 'Profil', to: Routes.PROFILE },
];

export function resolveActiveNavId(pathname: string): HomeNavItemId {
  if (pathname.includes('profile') || pathname.startsWith('/users/')) return 'profile';
  if (pathname.includes('defis')) return 'defis';
  if (pathname.includes('gains') || pathname.includes('premium')) return 'gains';
  if (pathname.includes('categories') || pathname.includes('/quiz/')) return 'play';
  return 'home';
}
