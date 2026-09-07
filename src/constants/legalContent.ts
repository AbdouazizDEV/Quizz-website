export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export const LEGAL_CONTACT_EMAIL = 'aadiop@dizigroup.net';
export const LEGAL_COMPANY = 'DIGIGROUP';
export const LEGAL_APP_NAME = 'Quizz+';
export const LEGAL_SITE_URL = 'https://quizzp.com';
export const LEGAL_LAST_UPDATED = '1 septembre 2026';

export const PRIVACY_POLICY: LegalSection[] = [
  {
    title: '1. Responsable du traitement',
    paragraphs: [
      `${LEGAL_COMPANY} édite l’application ${LEGAL_APP_NAME} accessible sur ${LEGAL_SITE_URL}.`,
      `Pour toute question relative à vos données personnelles : ${LEGAL_CONTACT_EMAIL}.`,
    ],
  },
  {
    title: '2. Données collectées',
    paragraphs: [
      'Lors de la création de compte ou de la connexion, nous pouvons collecter : nom d’utilisateur, adresse e-mail, nom affiché, photo de profil (si fournie via Google), scores, statistiques de jeu et préférences.',
      'En cas de connexion avec Google, nous recevons uniquement les informations autorisées par Google (identifiant, e-mail, nom et photo de profil). Nous n’accédons pas à votre mot de passe Google.',
      'Des données techniques (appareil, logs, adresse IP) peuvent être collectées à des fins de sécurité et de bon fonctionnement du service.',
    ],
  },
  {
    title: '3. Finalités',
    paragraphs: [
      'Vos données sont utilisées pour : créer et gérer votre compte, vous authentifier, afficher votre profil et vos scores, proposer les fonctionnalités sociales (amis, défis, classements), assurer la sécurité du service et répondre à vos demandes de support.',
    ],
  },
  {
    title: '4. Base légale',
    paragraphs: [
      'Le traitement repose sur l’exécution du contrat (utilisation de l’application), votre consentement lorsque requis (ex. connexion Google), et notre intérêt légitime (sécurité, amélioration du service).',
    ],
  },
  {
    title: '5. Partage des données',
    paragraphs: [
      'Nous ne vendons pas vos données personnelles.',
      'Certaines données peuvent être traitées par nos prestataires techniques (hébergement, base de données, authentification Google) strictement pour fournir le service.',
      'Votre pseudo, avatar et scores peuvent être visibles par d’autres joueurs selon les fonctionnalités que vous utilisez.',
    ],
  },
  {
    title: '6. Durée de conservation',
    paragraphs: [
      'Les données sont conservées tant que votre compte est actif. Vous pouvez demander la suppression de votre compte ; les données seront alors effacées ou anonymisées, sauf obligation légale de conservation.',
    ],
  },
  {
    title: '7. Vos droits',
    paragraphs: [
      'Conformément à la réglementation applicable, vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité de vos données.',
      `Pour exercer vos droits, contactez : ${LEGAL_CONTACT_EMAIL}.`,
    ],
  },
  {
    title: '8. Sécurité',
    paragraphs: [
      'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre l’accès non autorisé, la perte ou l’altération.',
    ],
  },
  {
    title: '9. Modifications',
    paragraphs: [
      'Cette politique peut être mise à jour. La date de dernière mise à jour est indiquée en haut de cette page. L’utilisation continue du service vaut acceptation de la version en vigueur.',
    ],
  },
];

export const TERMS_OF_SERVICE: LegalSection[] = [
  {
    title: '1. Objet',
    paragraphs: [
      `Les présentes conditions régissent l’accès et l’utilisation de l’application ${LEGAL_APP_NAME} éditée par ${LEGAL_COMPANY}, accessible sur ${LEGAL_SITE_URL}.`,
      'En créant un compte ou en utilisant le service, vous acceptez ces conditions.',
    ],
  },
  {
    title: '2. Compte utilisateur',
    paragraphs: [
      'Vous devez fournir des informations exactes lors de l’inscription et maintenir la confidentialité de vos identifiants.',
      'La connexion via Google est réservée aux utilisateurs disposant déjà d’un compte Quizz+. Sinon, vous devez d’abord vous inscrire via le parcours prévu à cet effet.',
      'Vous êtes responsable de toute activité réalisée depuis votre compte.',
    ],
  },
  {
    title: '3. Utilisation du service',
    paragraphs: [
      'Vous vous engagez à utiliser Quizz+ de manière loyale, sans tricher, harceler d’autres joueurs, publier de contenus illicites ou tenter de compromettre la sécurité du service.',
      `${LEGAL_COMPANY} se réserve le droit de suspendre ou supprimer un compte en cas de violation de ces règles.`,
    ],
  },
  {
    title: '4. Propriété intellectuelle',
    paragraphs: [
      'L’application, son design, ses contenus (questions, textes, visuels, logo) et sa marque Quizz+ sont protégés. Toute reproduction non autorisée est interdite.',
    ],
  },
  {
    title: '5. Disponibilité',
    paragraphs: [
      'Nous nous efforçons d’assurer un service disponible et de qualité, sans garantie d’absence d’interruption. Des maintenances ou mises à jour peuvent entraîner des indisponibilités temporaires.',
    ],
  },
  {
    title: '6. Limitation de responsabilité',
    paragraphs: [
      'Dans les limites autorisées par la loi, Quizz+ est fourni « en l’état ». DIGIGROUP ne pourra être tenue responsable des dommages indirects liés à l’utilisation du service.',
    ],
  },
  {
    title: '7. Données personnelles',
    paragraphs: [
      `Le traitement de vos données est décrit dans notre politique de confidentialité : ${LEGAL_SITE_URL}/privacy.`,
    ],
  },
  {
    title: '8. Résiliation',
    paragraphs: [
      'Vous pouvez cesser d’utiliser le service à tout moment et demander la suppression de votre compte.',
      `${LEGAL_COMPANY} peut modifier ou interrompre le service, sous réserve des dispositions légales applicables.`,
    ],
  },
  {
    title: '9. Droit applicable',
    paragraphs: [
      'Les présentes conditions sont soumises au droit applicable au siège de DIGIGROUP. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.',
    ],
  },
  {
    title: '10. Contact',
    paragraphs: [`Pour toute question : ${LEGAL_CONTACT_EMAIL}.`],
  },
];
