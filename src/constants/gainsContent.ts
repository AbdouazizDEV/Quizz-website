import type {
  GainsCashPrize,
  GainsHowStep,
  GainsHistoryItem,
  GainsRewardCatalogItem,
  GainsStreakTier,
} from '@app-types/gains.types';
import { GainsRoutes } from '@constants/gainsRoutes';

export const GAINS_NAV_CARDS = [
  {
    id: 'how',
    icon: 'compass',
    title: 'Comment gagner',
    subtitle: 'Joue stratégiquement : Express, défis, série…',
    to: GainsRoutes.howToWin,
    accent: '#FFB703',
    delayMs: 200,
  },
  {
    id: 'prizes',
    icon: 'gift',
    title: 'Ce que je peux gagner',
    subtitle: 'Cash prizes & offres partenaires',
    to: GainsRoutes.prizes,
    accent: '#F97316',
    delayMs: 240,
  },
  {
    id: 'rewards',
    icon: 'shopping-bag',
    title: 'Récompenses',
    subtitle: 'Échange tes points contre des lots',
    to: GainsRoutes.rewards,
    accent: '#22C55E',
    delayMs: 280,
  },
  {
    id: 'mine',
    icon: 'inbox',
    title: 'Mes gains',
    subtitle: 'Historique, stats et activité',
    to: GainsRoutes.myEarnings,
    accent: '#6366F1',
    delayMs: 320,
  },
] as const;

export const GAINS_STREAK_TIERS: GainsStreakTier[] = [
  {
    id: 's3',
    days: 3,
    bonusPoints: 50,
    label: '3 jours',
    hint: '+50 pts bonus',
  },
  {
    id: 's7',
    days: 7,
    bonusPoints: 150,
    label: '7 jours',
    hint: '+150 pts bonus',
  },
  {
    id: 's14',
    days: 14,
    bonusPoints: 300,
    label: '14 jours',
    hint: '+300 pts bonus',
  },
  {
    id: 's30',
    days: 30,
    bonusPoints: 500,
    label: '30 jours',
    hint: '+500 pts bonus',
  },
];

export const GAINS_CASH_PRIZES: GainsCashPrize[] = [
  {
    id: 'p1',
    periodLabel: '1ᵉʳ de la semaine',
    amountLabel: '25 000 FCFA',
    rankLabel: 'Top 1 hebdo',
  },
  {
    id: 'p2',
    periodLabel: '1ᵉʳ du mois',
    amountLabel: '100 000 FCFA',
    rankLabel: 'Top 1 mensuel',
  },
  {
    id: 'p3',
    periodLabel: '1ᵉʳ de l’année',
    amountLabel: '500 000 FCFA',
    rankLabel: 'Top 1 annuel',
  },
];

export const GAINS_REWARD_CATEGORIES = [
  'Bons d’achat',
  'Réductions',
  'Livres',
  'Accessoires',
  'Produits tech',
  'Services éducatifs',
] as const;

export const GAINS_REWARD_CATALOG: GainsRewardCatalogItem[] = [
  {
    id: 'r1',
    title: 'Bon d’achat 5 000 FCFA',
    description: 'À utiliser chez les partenaires Quizz+ pour tes achats du quotidien.',
    costPoints: 800,
    category: 'Bons d’achat',
    available: true,
  },
  {
    id: 'r2',
    title: 'Réduction librairie -15 %',
    description: 'Remise sur tes prochains livres et manuels chez un libraire partenaire.',
    costPoints: 350,
    category: 'Réductions',
    available: true,
  },
  {
    id: 'r3',
    title: 'Ebook culture générale',
    description: 'Un ebook pour réviser et progresser entre deux quiz Express.',
    costPoints: 220,
    category: 'Livres',
    available: true,
  },
  {
    id: 'r4',
    title: 'Casque Quizz+ (partenaire)',
    description: 'Accessoire partenaire — stock limité, échange bientôt ouvert.',
    costPoints: 2_500,
    category: 'Accessoires',
    available: false,
  },
  {
    id: 'r5',
    title: 'Crédit data 2 Go',
    description: 'Forfait data à activer pour jouer et réviser même en déplacement.',
    costPoints: 600,
    category: 'Produits tech',
    available: true,
  },
  {
    id: 'r6',
    title: 'Cours tutorat 1h',
    description: 'Une heure avec un tuteur pour préparer tes prochains défis.',
    costPoints: 1_200,
    category: 'Services éducatifs',
    available: true,
  },
];

export const GAINS_PARTNER_OFFERS = [
  'Réduction accessoires partenaires',
  'Offre librairie partenaire',
  'Accès sponsorisé à un atelier',
] as const;

export const GAINS_HOW_STEPS: GainsHowStep[] = [
  {
    id: 'h1',
    icon: 'zap',
    title: 'Quiz Express',
    body: 'Enchaîne des parties courtes pour cumuler des points rapidement sans perdre le rythme.',
  },
  {
    id: 'h2',
    icon: 'users',
    title: 'Défis & duels',
    body: 'Les défis hebdo et duels rapportent plus : vise les bonus de classement.',
  },
  {
    id: 'h3',
    icon: 'award',
    title: 'Monte au classement',
    body: 'Chaque semaine repart : concentre-toi sur le Top 10 pour maximiser tes chances cash.',
  },
  {
    id: 'h4',
    icon: 'flame',
    title: 'Garde ta série',
    body: '3, 7, 14 puis 30 jours débloquent des bonus points automatiques.',
  },
];

export const GAINS_HISTORY_DEMO: GainsHistoryItem[] = [
  {
    id: 'hi1',
    title: 'Badge « Curieux du jour »',
    subtitle: 'Récompense de série',
    pointsDelta: 40,
    whenLabel: 'Hier',
  },
  {
    id: 'hi2',
    title: 'Challenge hebdo complété',
    subtitle: 'Bonus classement',
    pointsDelta: 120,
    whenLabel: 'Il y a 3 jours',
  },
  {
    id: 'hi3',
    title: 'Bon d’achat débloqué',
    subtitle: 'Échange de points',
    pointsDelta: -800,
    whenLabel: 'Il y a 1 semaine',
  },
];
