import { GainsExpressCta } from '@components/ui/gains/GainsExpressCta';
import { GainsPageShell } from '@components/ui/gains/GainsPageShell';
import { Icon } from '@components/ui/Icon';
import { GAINS_HOW_STEPS } from '@constants/gainsContent';

export function GainsHowPage() {
  return (
    <GainsPageShell title="Comment gagner" showBack>
      <section className="gains-hero-navy">
        <h2 style={{ margin: 0, fontSize: 22 }}>Joue stratégiquement</h2>
        <p style={{ margin: '8px 0 0', fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>
          Enchaîne Quiz Express, vise les défis et duels, puis garde ta série pour cumuler plus de
          points.
        </p>
      </section>
      <GainsExpressCta />
      <div className="gains-step-grid">
        {GAINS_HOW_STEPS.map((step) => (
          <article key={step.id} className="gains-step">
            <span className="gains-nav-icon" style={{ background: '#FFB703' }}>
              <Icon name={step.icon} size={20} color="#1A1A2E" />
            </span>
            <div>
              <h3 style={{ margin: 0 }}>{step.title}</h3>
              <p className="gains-footnote" style={{ marginTop: 4 }}>
                {step.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </GainsPageShell>
  );
}
