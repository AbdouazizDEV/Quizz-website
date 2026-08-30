import clsx from 'clsx';
import type {
  CompetitionBracket,
  CompetitionBracketMatch,
  CompetitionBracketPlayer,
  CompetitionBracketRound,
} from '@app-types/challenge.types';

type RoundStatus = 'done' | 'live' | 'future';

interface CompetitionBracketViewProps {
  bracket: CompetitionBracket;
  currentUserId?: string;
}

function resolveRoundTitle(round: CompetitionBracketRound, index: number, total: number): string {
  const label = round.label?.trim() ?? '';
  const matchCount = round.matches.length;
  if (index === total - 1) {
    return /finale/i.test(label) ? label : 'Finale';
  }
  if (matchCount === 2 || index === total - 2) {
    return /demi/i.test(label) ? label : 'Demi';
  }
  if (matchCount === 4 || /1\/4|quart/i.test(label)) return '1/4';
  if (matchCount === 8 || /1\/8|huitième/i.test(label)) return '1/8';
  if (/1\/8|huitième|1\/4|quart|demi|finale/i.test(label)) return label;
  return label || `Tour ${round.round}`;
}

function matchStatus(match: CompetitionBracketMatch): RoundStatus {
  if (match.winnerId) return 'done';
  if (match.player1 && match.player2) return 'live';
  return 'future';
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="bracket-legend-item">
      <i className="bracket-legend-dot" style={{ background: color }} aria-hidden />
      {label}
    </span>
  );
}

function RoundConnector() {
  return (
    <div className="bracket-connector" aria-hidden>
      <span className="bracket-connector-line" />
      <span className="bracket-connector-arrow">›</span>
    </div>
  );
}

function PlayerSlot({
  player,
  match,
  accent,
  currentUserId,
  isFinal,
}: {
  player: CompetitionBracketPlayer | null;
  match: CompetitionBracketMatch;
  accent: string;
  currentUserId?: string;
  isFinal: boolean;
}) {
  const isUser = Boolean(player && currentUserId && player.id === currentUserId);
  const isWinner = Boolean(player && match.winnerId === player.id);
  const isLost = Boolean(player && match.winnerId && match.winnerId !== player.id);
  const isPlaceholder = !player;

  const displayName = isPlaceholder
    ? 'En attente'
    : isUser
      ? 'Vous'
      : player.name;

  return (
    <div
      className={clsx(
        'bracket-slot',
        isUser && 'is-user',
        isFinal && 'is-final',
        isLost && 'is-lost',
        isPlaceholder && 'is-placeholder',
        isWinner && 'is-winner',
      )}
      style={{ borderLeftColor: accent }}
    >
      <span className="bracket-slot-name">{displayName}</span>
      {!isPlaceholder ? (
        <span className="bracket-slot-score">{player.score ?? '—'}</span>
      ) : null}
    </div>
  );
}

export function CompetitionBracketView({ bracket, currentUserId }: CompetitionBracketViewProps) {
  const rounds = bracket.rounds;
  const total = rounds.length;

  if (!total) {
    return (
      <p className="bracket-empty-hint">
        Le tableau se mettra à jour au fil des matchs. Aucune rencontre générée pour l’instant.
      </p>
    );
  }

  const hasPartial = rounds.some(
    (round) =>
      round.matches.length === 0 ||
      round.matches.some((match) => !match.player1 || !match.player2),
  );

  return (
    <div className="bracket-tree">
      <div className="bracket-legend" aria-label="Légende">
        <LegendDot color="#2ECC71" label="Qualifié" />
        <LegendDot color="#F5A623" label="En cours" />
        <LegendDot color="#CBD5E1" label="À venir" />
      </div>

      <div className="bracket-scroll">
        {rounds.map((round, index) => {
          const isFinal = index === total - 1;
          const title = resolveRoundTitle(round, index, total);

          return (
            <div key={`${round.round}-${title}`} className="bracket-round-wrap">
              {index > 0 ? <RoundConnector /> : null}
              <section className={clsx('bracket-round', isFinal && 'is-final')}>
                <header className={clsx('bracket-round-header', isFinal && 'is-final')}>
                  <h3>
                    {isFinal ? '🏆 ' : ''}
                    {title}
                  </h3>
                </header>

                <div className="bracket-round-matches">
                  {round.matches.map((match) => {
                    const localStatus = matchStatus(match);
                    const localAccent =
                      localStatus === 'done'
                        ? '#2ECC71'
                        : localStatus === 'live'
                          ? '#F5A623'
                          : '#CBD5E1';
                    return (
                      <article key={match.id} className="bracket-match">
                        <PlayerSlot
                          player={match.player1}
                          match={match}
                          accent={localAccent}
                          currentUserId={currentUserId}
                          isFinal={isFinal}
                        />
                        <PlayerSlot
                          player={match.player2}
                          match={match}
                          accent={localAccent}
                          currentUserId={currentUserId}
                          isFinal={isFinal}
                        />
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>
          );
        })}
      </div>

      {hasPartial ? (
        <p className="bracket-demo-hint">
          Bracket en cours de génération — les matchs incomplets s’afficheront ici dès qu’ils seront
          disponibles.
        </p>
      ) : null}
    </div>
  );
}
