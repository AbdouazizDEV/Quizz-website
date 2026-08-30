export interface DuelUiStateParams {
  status: string;
  isExpired: boolean;
  isChallenger: boolean;
  isChallenged: boolean;
  myScore: number | null;
  opponentScore: number | null;
  opponentName: string;
}

export interface DuelUiState {
  statusLabel: string;
  motivationalLine: string;
  tips: string[];
}

export function getDuelUiState(params: DuelUiStateParams): DuelUiState {
  const { status, isExpired, isChallenger, isChallenged, myScore, opponentScore, opponentName } =
    params;

  if (isExpired || status === 'expired') {
    return {
      statusLabel: 'Expiré',
      motivationalLine: 'Le délai de 30 minutes est dépassé ⏱',
      tips: [
        'Ce duel figure dans « Mes duels récents ».',
        myScore === null
          ? 'Vous n’avez pas joué avant l’expiration.'
          : 'Votre score quiz a été enregistré.',
      ],
    };
  }

  if (status === 'declined') {
    return {
      statusLabel: 'Refusé',
      motivationalLine: 'Ce duel n’a pas abouti…',
      tips: ['Proposez une revanche à un autre moment !'],
    };
  }

  if (isChallenged && status === 'pending') {
    return {
      statusLabel: 'Invitation',
      motivationalLine: `${opponentName} vous défie — entrez dans l’arène ! 🎯`,
      tips: [
        'Acceptez ou refusez depuis « Duels en attente » (30 min max).',
        'Une seule partie : donnez le meilleur de vous-même !',
      ],
    };
  }

  if (isChallenger && status === 'pending' && myScore === null) {
    return {
      statusLabel: 'En cours',
      motivationalLine: 'Montrez votre niveau avant qu’il ne réponde ! 🔥',
      tips: [
        'Jouez maintenant : votre score reste secret jusqu’à la fin.',
        'Votre adversaire a 30 minutes pour accepter et jouer.',
      ],
    };
  }

  if (isChallenger && status === 'pending' && myScore !== null) {
    return {
      statusLabel: 'En attente',
      motivationalLine: `Score enregistré — ${opponentName} doit encore répondre ⏳`,
      tips: ['Vous serez notifié dès qu’il accepte ou refuse le défi.'],
    };
  }

  if (myScore === null && (status === 'accepted' || status === 'pending')) {
    return {
      statusLabel: 'À vous !',
      motivationalLine: 'C’est le moment de briller — lancez-vous ! ⚡',
      tips: [
        'Chaque bonne réponse rapproche la victoire.',
        'Le score adverse reste caché jusqu’à la fin du duel.',
      ],
    };
  }

  if (myScore !== null && opponentScore === null) {
    return {
      statusLabel: 'Score envoyé',
      motivationalLine: `Vous avez joué — ${opponentName} doit encore répondre 💪`,
      tips: ['Patience… le suspense fait partie du jeu !'],
    };
  }

  if (myScore !== null && opponentScore !== null) {
    return {
      statusLabel: 'Terminé',
      motivationalLine: 'Les deux joueurs ont terminé — découvrez le résultat ! 🏆',
      tips: ['Consultez le résultat pour voir qui a gagné.'],
    };
  }

  return {
    statusLabel: 'Duel',
    motivationalLine: 'Que le meilleur gagne ! 🏆',
    tips: ['Comparez vos scores une fois les deux parties terminées.'],
  };
}
