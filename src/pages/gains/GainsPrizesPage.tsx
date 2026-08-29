import { GainsPageShell } from '@components/ui/gains/GainsPageShell';
import { GAINS_CASH_PRIZES, GAINS_PARTNER_OFFERS } from '@constants/gainsContent';

export function GainsPrizesPage() {
  return (
    <GainsPageShell title="Ce que je peux gagner" showBack>
      <section className="gains-hero-navy">
        <p className="gains-rank-kicker">Cash prizes</p>
        <h2 style={{ margin: '8px 0 0', fontSize: 24 }}>Les récompenses du classement officiel</h2>
      </section>
      <div className="gains-prize-grid">
        {GAINS_CASH_PRIZES.map((prize) => (
          <article key={prize.id} className="gains-prize">
            <p className="gains-footnote">{prize.rankLabel}</p>
            <strong>{prize.amountLabel}</strong>
            <p style={{ margin: '4px 0 0', fontWeight: 700 }}>{prize.periodLabel}</p>
          </article>
        ))}
      </div>
      <section className="gains-streak">
        <h2>Offres partenaires</h2>
        {GAINS_PARTNER_OFFERS.map((offer) => (
          <p key={offer} style={{ margin: '8px 0 0', fontWeight: 700 }}>
            {offer}
          </p>
        ))}
      </section>
      <p className="gains-footnote">Selon le classement officiel Quizz+.</p>
    </GainsPageShell>
  );
}
