import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { LandingDeck } from '@components/landing/LandingDeck';
import { LandingSpotVideo } from '@components/landing/LandingSpotVideo';
import {
  CONTACT_EMAIL,
  LANDING_COPY,
  LANDING_PARTNERS,
} from '@constants/landingCopy';
import { Routes } from '@constants/Routes';
import { useInViewOnce } from '@hooks/useInViewOnce';

// Bascule FR/EN désactivée — contenu français statique.
// const LANG_KEY = 'quizz.landing.lang';

function Reveal({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { ref, visible } = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className={clsx(className, 'lp-reveal', visible && 'lp-reveal--on')}>
      {children}
    </div>
  );
}

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sentHint, setSentHint] = useState(false);

  const t = LANDING_COPY.fr;
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    document.documentElement.lang = 'fr';
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onContact = (event: FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent(`[Quizz+] ${name.trim() || 'Contact'}`);
    const body = encodeURIComponent(
      `${message.trim()}\n\n—\n${name.trim()}\n${email.trim()}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSentHint(true);
  };

  // const toggleLang = () => setLang((prev) => (prev === 'fr' ? 'en' : 'fr'));

  return (
    <div className="lp-root">
      <div className="lp-noise" aria-hidden />
      <div className="lp-grid" aria-hidden />

      <header className={clsx('lp-nav', scrolled && 'lp-nav--solid')}>
        <a href="#accueil" className="lp-brand" onClick={(e) => { e.preventDefault(); scrollTo('accueil'); }}>
          <img src="/assets/icons/logo.png" alt="Quizz+" width={36} height={36} />
          <span>Quizz+</span>
        </a>

        <nav className={clsx('lp-nav-links', menuOpen && 'lp-nav-links--open')} aria-label="Navigation">
          <button type="button" onClick={() => scrollTo('accueil')}>{t.nav.home}</button>
          <button type="button" onClick={() => scrollTo('apropos')}>{t.nav.about}</button>
          <button type="button" onClick={() => scrollTo('partenaires')}>{t.nav.partners}</button>
          <button type="button" onClick={() => scrollTo('contact')}>{t.nav.contact}</button>
        </nav>

        <div className="lp-nav-actions">
          {/* <button type="button" className="lp-lang" onClick={toggleLang} aria-label="Language">
            {lang === 'fr' ? 'EN' : 'FR'}
          </button> */}
          <Link to={Routes.LOGIN} className="lp-btn lp-btn--ghost">{t.nav.login}</Link>
          <Link to={Routes.LOGIN} className="lp-btn lp-btn--gold">{t.nav.play}</Link>
          <button
            type="button"
            className="lp-burger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <section id="accueil" className="lp-hero">
          <div className="lp-hero-copy">
            <p className="lp-kicker">
              <span className="lp-kicker-dot" />
              {t.hero.kicker}
            </p>
            <h1 className="lp-hero-title">
              <span>{t.hero.titleBefore}</span>{' '}
              <em>{t.hero.titleAccent}</em>{' '}
              <span className="lp-hero-title-end">{t.hero.titleAfter}</span>
            </h1>
            <p className="lp-hero-lead">{t.hero.lead}</p>
            <div className="lp-hero-cta">
              <Link to={Routes.LOGIN} className="lp-btn lp-btn--gold lp-btn--lg">
                {t.hero.ctaPrimary}
              </Link>
              <Link to={Routes.CREATE_ACCOUNT_TYPE} className="lp-btn lp-btn--outline lp-btn--lg">
                {t.hero.ctaSecondary}
              </Link>
            </div>
            <ul className="lp-chips">
              <li>{t.hero.chipLive}</li>
              <li>{t.hero.chipWins}</li>
              <li>{t.hero.chipFriends}</li>
            </ul>
          </div>
          <LandingDeck />
        </section>

        <div className="lp-ticker" aria-hidden>
          <div className="lp-ticker-track">
            {Array.from({ length: 2 }).map((_, loop) => (
              <div key={`tick-${loop}`} className="lp-ticker-group">
                <span>Quiz</span>
                <span>·</span>
                <span>Duels</span>
                <span>·</span>
                <span>Tournois</span>
                <span>·</span>
                <span>Gains</span>
                <span>·</span>
                <span>Classements</span>
                <span>·</span>
                <span>Quizz+</span>
                <span>·</span>
              </div>
            ))}
          </div>
        </div>

        <section id="apropos" className="lp-section lp-about">
          <Reveal>
            <p className="lp-kicker">{t.about.kicker}</p>
            <h2 className="lp-section-title">{t.about.title}</h2>
          </Reveal>
          <Reveal className="lp-spot-wrap">
            <LandingSpotVideo
              label={t.about.videoLabel}
              liveLabel={t.about.videoLive}
              brandLeft={t.about.videoBrandLeft}
              brandRight={t.about.videoBrandRight}
            />
          </Reveal>
          <Reveal>
            <div className="lp-about-grid">
              <div className="lp-about-prose">
                <p>{t.about.p1}</p>
                <p>{t.about.p2}</p>
              </div>
              <ol className="lp-about-points">
                {t.about.points.map((item) => (
                  <li key={item.n}>
                    <span className="lp-about-n">{item.n}</span>
                    <div>
                      <strong>{item.t}</strong>
                      <p>{item.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </section>

        <section id="partenaires" className="lp-section lp-partners">
          <Reveal>
            <p className="lp-kicker">{t.partners.kicker}</p>
            <h2 className="lp-section-title">{t.partners.title}</h2>
            <p className="lp-section-lead">{t.partners.lead}</p>
          </Reveal>
          <div className="lp-marquee">
            <div className="lp-marquee-track">
              {[0, 1].map((loop) => (
                <ul key={`m-${loop}`} className="lp-partner-list">
                  {LANDING_PARTNERS.map((p) => (
                    <li key={`${loop}-${p.id}`} className="lp-partner-card">
                      <span className="lp-partner-mark">{p.mark}</span>
                      <span className="lp-partner-name">{p.name}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="lp-section lp-contact">
          <Reveal className="lp-contact-panel">
            <div className="lp-contact-intro">
              <p className="lp-kicker">{t.contact.kicker}</p>
              <h2 className="lp-section-title">{t.contact.title}</h2>
              <p className="lp-section-lead">{t.contact.lead}</p>
              <p className="lp-contact-hint">
                {t.contact.hint}{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>
            </div>
            <form className="lp-contact-form" onSubmit={onContact}>
              <label>
                <span>{t.contact.name}</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
              </label>
              <label>
                <span>{t.contact.email}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </label>
              <label className="lp-contact-message">
                <span>{t.contact.message}</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                />
              </label>
              <button type="submit" className="lp-btn lp-btn--gold lp-btn--lg">
                {t.contact.send}
              </button>
              {sentHint ? <p className="lp-contact-sent">{t.contact.sent}</p> : null}
            </form>
          </Reveal>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-top">
          <div className="lp-footer-brand">
            <img src="/assets/icons/logo.png" alt="Quizz+" width={40} height={40} />
            <div>
              <strong>Quizz+</strong>
              <p>{t.footer.tagline}</p>
            </div>
          </div>
          <div className="lp-footer-links">
            <Link to={Routes.LOGIN}>{t.footer.login}</Link>
            <Link to={Routes.CREATE_ACCOUNT_TYPE}>{t.footer.register}</Link>
            <Link to={Routes.PRIVACY}>{t.footer.privacy}</Link>
            <Link to={Routes.TERMS}>{t.footer.terms}</Link>
            <button type="button" onClick={() => scrollTo('contact')}>{t.nav.contact}</button>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <span>© {year} Quizz+. {t.footer.rights}</span>
          {/* <button type="button" className="lp-lang lp-lang--footer" onClick={toggleLang}>
            {lang === 'fr' ? 'English' : 'Français'}
          </button> */}
        </div>
      </footer>
    </div>
  );
}
