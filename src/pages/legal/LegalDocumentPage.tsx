import { Link } from 'react-router-dom';
import type { LegalSection } from '@constants/legalContent';
import { LEGAL_APP_NAME, LEGAL_LAST_UPDATED, LEGAL_SITE_URL } from '@constants/legalContent';
import { Routes } from '@constants/Routes';

type Props = {
  title: string;
  intro: string;
  sections: LegalSection[];
  alternate?: { label: string; href: string };
};

export function LegalDocumentPage({ title, intro, sections, alternate }: Props) {
  return (
    <main className="legal-page">
      <header className="legal-page__header">
        <Link to={Routes.LANDING} className="legal-page__brand">
          <img src="/assets/icons/logo.png" alt="Quizz+" width={40} height={40} />
          <span>{LEGAL_APP_NAME}</span>
        </Link>
      </header>

      <article className="legal-page__content">
        <h1>{title}</h1>
        <p className="legal-page__meta">Dernière mise à jour : {LEGAL_LAST_UPDATED}</p>
        <p className="legal-page__intro">{intro}</p>

        {sections.map((section) => (
          <section key={section.title} className="legal-page__section">
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        {alternate ? (
          <p className="legal-page__footer-link">
            Voir aussi : <Link to={alternate.href}>{alternate.label}</Link>
          </p>
        ) : null}
      </article>

      <footer className="legal-page__footer">
        <p>© {new Date().getFullYear()} {LEGAL_APP_NAME} · DIGIGROUP</p>
        <p>
          <a href={LEGAL_SITE_URL}>{LEGAL_SITE_URL.replace('https://', '')}</a>
        </p>
      </footer>
    </main>
  );
}
