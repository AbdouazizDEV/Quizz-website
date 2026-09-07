import { LEGAL_APP_NAME, LEGAL_COMPANY, LEGAL_SITE_URL } from '@constants/legalContent';
import { CONTACT_EMAIL } from '@constants/landingCopy';
import { Routes } from '@constants/Routes';

export const SITE_URL = LEGAL_SITE_URL;
export const SITE_NAME = LEGAL_APP_NAME;
export const SITE_LOCALE = 'fr_FR';
export const DEFAULT_OG_IMAGE_PATH = '/og-image.png';

export const DEFAULT_SEO_TITLE =
  'Quizz+ | Quiz en ligne, duels et gains — Afrique & francophonie';
export const DEFAULT_SEO_DESCRIPTION =
  'Quizz+ est l’arène de quiz en ligne : culture générale, duels entre amis, tournois et gains. Joue, progresse et grimpe au classement.';

export type SeoRobots = 'index,follow' | 'noindex,follow' | 'noindex,nofollow';

export type SeoPageConfig = {
  title: string;
  description: string;
  path: string;
  robots: SeoRobots;
  jsonLd?: boolean;
};

export const SEO_PAGES = {
  landing: {
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_SEO_DESCRIPTION,
    path: Routes.LANDING,
    robots: 'index,follow',
    jsonLd: true,
  },
  login: {
    title: 'Connexion | Quizz+ — quiz, duels et classements',
    description:
      'Connectez-vous à Quizz+ pour jouer aux quiz, défier vos amis et suivre vos gains.',
    path: Routes.LOGIN,
    robots: 'index,follow',
  },
  register: {
    title: 'Créer un compte | Quizz+',
    description: 'Inscrivez-vous sur Quizz+ et entrez dans l’arène de quiz.',
    path: Routes.REGISTER,
    robots: 'noindex,follow',
  },
  privacy: {
    title: 'Politique de confidentialité | Quizz+',
    description: `Comment ${LEGAL_COMPANY} collecte et protège vos données sur ${SITE_NAME}.`,
    path: Routes.PRIVACY,
    robots: 'index,follow',
  },
  terms: {
    title: 'Conditions d’utilisation | Quizz+',
    description: `Les règles d’utilisation de ${SITE_NAME}, l’arène de quiz de ${LEGAL_COMPANY}.`,
    path: Routes.TERMS,
    robots: 'index,follow',
  },
} as const satisfies Record<string, SeoPageConfig>;

const APP_SEO: SeoPageConfig = {
  title: SITE_NAME,
  description: DEFAULT_SEO_DESCRIPTION,
  path: Routes.HOME,
  robots: 'noindex,follow',
};

export function resolveSeoFromPath(pathname: string): SeoPageConfig {
  if (pathname === Routes.SPLASH) {
    return { ...SEO_PAGES.landing, robots: 'noindex,follow' };
  }
  if (pathname === Routes.LANDING) {
    return SEO_PAGES.landing;
  }
  if (pathname === Routes.LOGIN) return SEO_PAGES.login;
  if (pathname === Routes.REGISTER) return SEO_PAGES.register;
  if (pathname === Routes.PRIVACY) return SEO_PAGES.privacy;
  if (pathname === Routes.TERMS) return SEO_PAGES.terms;
  return { ...APP_SEO, path: pathname };
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildWebsiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: LEGAL_COMPANY,
        url: SITE_URL,
        logo: absoluteUrl('/icons/icon-512.png'),
        email: CONTACT_EMAIL,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: absoluteUrl(Routes.LANDING),
        inLanguage: 'fr-FR',
        description: DEFAULT_SEO_DESCRIPTION,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'WebApplication',
        '@id': `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: absoluteUrl(Routes.LANDING),
        applicationCategory: 'GameApplication',
        operatingSystem: 'Web',
        inLanguage: 'fr-FR',
        description: DEFAULT_SEO_DESCRIPTION,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'XOF',
        },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
}
