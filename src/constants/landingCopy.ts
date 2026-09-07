export type LandingLang = 'fr' | 'en';

export const LANDING_COPY = {
  fr: {
    nav: {
      home: 'Accueil',
      about: 'À propos',
      partners: 'Partenaires',
      contact: 'Contact',
      login: 'Se connecter',
      play: 'Jouer',
    },
    hero: {
      kicker: 'Arène de quiz · Afrique & francophonie',
      titleBefore: 'Le savoir',
      titleAccent: 'qui marque',
      titleAfter: 'des points.',
      lead:
        'Quizz+ transforme chaque partie en duel, classement et gains. Pas un cours en ligne - une arène où la culture générale devient un sport.',
      ctaPrimary: 'Entrer dans l’arène',
      ctaSecondary: 'Créer mon compte',
      chipLive: 'Parties en cours',
      chipWins: 'Gains à gagner',
      chipFriends: 'Défis entre amis',
    },
    about: {
      kicker: 'Pourquoi Quizz+',
      title: 'Une arène, pas une appli scolaire.',
      videoLabel: 'Spot Quizz+ — duel de connaissances entre étudiants',
      videoLive: 'En boucle',
      videoBrandLeft: 'Quizz+',
      videoBrandRight: 'Dizigroup',
      p1:
        'On a conçu Quizz+ pour ceux qui aiment gagner, pas seulement “apprendre”. Quiz solo, défis entre potes, tournois et récompenses - le même feu que sur mobile, maintenant sur le web.',
      p2:
        'Chaque bonne réponse fait grimper ton rang. Chaque duel laisse une trace. Et les gains, ce n’est pas du folklore : c’est le cœur du jeu.',
      points: [
        { n: '01', t: 'Quiz & catégories', d: 'Culture, sport, tech, société - des decks qui tournent.' },
        { n: '02', t: 'Défis & duels', d: 'Invite un ami, tranche le score, remonte le classement.' },
        { n: '03', t: 'Gains réels', d: 'Joue, accumule, vise les récompenses de la saison.' },
      ],
    },
    partners: {
      kicker: 'Ils jouent avec nous',
      title: 'Partenaires & maisons amies',
      lead: 'Des structures qui croient à une culture ludique, locale et ambitieuse.',
    },
    contact: {
      kicker: 'On t’écoute',
      title: 'Écris-nous. Sans formulaire froid.',
      lead: 'Partenariat, presse, bug ou idée de quiz - une ligne directe vers l’équipe.',
      name: 'Ton nom',
      email: 'Ton e-mail',
      message: 'Ton message',
      send: 'Envoyer le message',
      sent: 'Message prêt - ton client mail va s’ouvrir.',
      hint: 'Ou écris directement à',
    },
    footer: {
      tagline: 'Joue. Progresse. Gagne.',
      rights: 'Tous droits réservés.',
      login: 'Connexion',
      register: 'Inscription',
      privacy: 'Confidentialité',
      terms: 'Conditions',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      partners: 'Partners',
      contact: 'Contact',
      login: 'Log in',
      play: 'Play',
    },
    hero: {
      kicker: 'Quiz arena · Africa & Francophonie',
      titleBefore: 'Knowledge',
      titleAccent: 'that scores',
      titleAfter: 'points.',
      lead:
        'Quizz+ turns every match into duels, rankings and rewards. Not an online course - an arena where general knowledge becomes a sport.',
      ctaPrimary: 'Enter the arena',
      ctaSecondary: 'Create my account',
      chipLive: 'Matches live',
      chipWins: 'Prizes to win',
      chipFriends: 'Friend challenges',
    },
    about: {
      kicker: 'Why Quizz+',
      title: 'An arena, not a school app.',
      videoLabel: 'Quizz+ spot — knowledge duel between students',
      videoLive: 'Looping',
      videoBrandLeft: 'Quizz+',
      videoBrandRight: 'Dizigroup',
      p1:
        'Quizz+ is built for people who love winning, not just “learning”. Solo quizzes, friend challenges, tournaments and rewards - the same heat as on mobile, now on the web.',
      p2:
        'Every right answer climbs your rank. Every duel leaves a mark. And prizes aren’t folklore - they’re the heart of the game.',
      points: [
        { n: '01', t: 'Quizzes & categories', d: 'Culture, sport, tech, society - decks that keep spinning.' },
        { n: '02', t: 'Challenges & duels', d: 'Invite a friend, settle the score, climb the board.' },
        { n: '03', t: 'Real rewards', d: 'Play, stack points, chase the season prizes.' },
      ],
    },
    partners: {
      kicker: 'Playing with us',
      title: 'Partners & friendly houses',
      lead: 'Teams that believe in playful, local, ambitious culture.',
    },
    contact: {
      kicker: 'We’re listening',
      title: 'Write to us. No cold form.',
      lead: 'Partnership, press, bug or quiz idea - a direct line to the team.',
      name: 'Your name',
      email: 'Your email',
      message: 'Your message',
      send: 'Send message',
      sent: 'Ready - your mail client will open.',
      hint: 'Or write straight to',
    },
    footer: {
      tagline: 'Play. Level up. Win.',
      rights: 'All rights reserved.',
      login: 'Log in',
      register: 'Sign up',
      privacy: 'Privacy',
      terms: 'Terms',
    },
  },
} as const;

export const LANDING_PARTNERS = [
  { id: 'digigroup', name: 'Digigroup', mark: 'DG' },
  { id: 'dizigroup', name: 'DiziGroup', mark: 'DZ' },
  { id: 'quizzplus', name: 'Quizz+', mark: 'Q+' },
  { id: 'neon', name: 'Neon Arena', mark: 'NA' },
  { id: 'pulse', name: 'Pulse Culture', mark: 'PC' },
  { id: 'orbit', name: 'Orbit Quiz', mark: 'OQ' },
] as const;

export const CONTACT_EMAIL = 'contact@quizzp.com';
