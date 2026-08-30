import { GainsExpressCta } from '@components/ui/gains/GainsExpressCta';
import { GainsPageShell } from '@components/ui/gains/GainsPageShell';
import { Icon } from '@components/ui/Icon';
import { GAINS_HOW_STEPS } from '@constants/gainsContent';

export function GainsHowPage() {
  return (
    <GainsPageShell title="Comment gagner" showBack>
      <div className="gains-sub-board gains-how-board">
        <div className="gains-sub-primary">
          <section className="gains-how-hero gains-fade">
            <h2>Joue stratégiquement</h2>
            <p>Combine Quiz Express, défis et série pour maximiser tes points et viser le cash.</p>
          </section>
          <GainsExpressCta />
        </div>

        <div className="gains-how-list">
          {GAINS_HOW_STEPS.map((step, index) => (
            <article
              key={step.id}
              className="gains-how-step gains-fade"
              style={{ animationDelay: `${80 + index * 70}ms` }}
            >
              <span className="gains-how-step-icon">
                <Icon name={step.icon} size={18} color="#1F2347" />
              </span>
              <div className="gains-how-step-copy">
                <h3>
                  {index + 1}. {step.title}
                </h3>
                <p>{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </GainsPageShell>
  );
}
