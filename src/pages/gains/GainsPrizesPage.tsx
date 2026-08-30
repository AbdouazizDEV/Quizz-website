import { GainsPageShell } from '@components/ui/gains/GainsPageShell';
import { Icon } from '@components/ui/Icon';
import { GAINS_CASH_PRIZES, GAINS_PARTNER_OFFERS } from '@constants/gainsContent';

export function GainsPrizesPage() {
  return (
    <GainsPageShell title="Ce que je peux gagner" showBack>
      <div className="gains-sub-board gains-prizes-board">
        <section className="gains-prizes-hero gains-fade">
          <span className="gains-prizes-hero-icon" aria-hidden>
            <Icon name="award" size={22} color="#FFB703" />
          </span>
          <p className="gains-prizes-kicker">Cash prizes</p>
          <h2>Les récompenses du classement officiel</h2>
          <p>Selon le classement officiel Quizz+ — semaine, mois et année.</p>
        </section>

        <div className="gains-prizes-main">
          <div className="gains-prizes-list">
            {GAINS_CASH_PRIZES.map((prize, index) => (
              <article
                key={prize.id}
                className="gains-prizes-card gains-fade"
                style={{ animationDelay: `${80 + index * 70}ms` }}
              >
                <div className="gains-prizes-card-top">
                  <span>{prize.rankLabel}</span>
                  <strong>{prize.amountLabel}</strong>
                </div>
                <p>{prize.periodLabel}</p>
              </article>
            ))}
          </div>

          <section className="gains-partners gains-fade" style={{ animationDelay: '280ms' }}>
            <div className="gains-partners-head">
              <Icon name="flag" size={16} color="#1F2347" />
              <h2>Offres partenaires</h2>
            </div>
            {GAINS_PARTNER_OFFERS.map((offer) => (
              <div key={offer} className="gains-partners-row">
                <span className="gains-partners-bullet" aria-hidden />
                <p>{offer}</p>
              </div>
            ))}
          </section>
        </div>
      </div>

      <p className="gains-prizes-footnote">Selon le classement officiel Quizz+.</p>
    </GainsPageShell>
  );
}
