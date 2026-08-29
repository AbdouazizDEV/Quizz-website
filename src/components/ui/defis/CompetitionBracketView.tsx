import type { CompetitionBracket } from '@app-types/challenge.types';

interface CompetitionBracketViewProps {
  bracket: CompetitionBracket;
}

export function CompetitionBracketView({ bracket }: CompetitionBracketViewProps) {
  if (!bracket.rounds.length) {
    return <p className="defis-muted">Le tableau se mettra à jour au fil des matchs.</p>;
  }

  return (
    <div className="defis-bracket">
      {bracket.rounds.map((round) => (
        <div key={round.round} className="defis-bracket-round">
          <strong>{round.label}</strong>
          {round.matches.map((match) => (
            <article key={match.id} className="defis-bracket-match">
              {[match.player1, match.player2].map((player, index) => (
                <div
                  key={player?.id ?? `empty-${index}`}
                  className={
                    player && match.winnerId === player.id
                      ? 'defis-bracket-player is-winner'
                      : 'defis-bracket-player'
                  }
                >
                  <span>{player?.name ?? 'À déterminer'}</span>
                  <span>{player?.score ?? '—'}</span>
                </div>
              ))}
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}
