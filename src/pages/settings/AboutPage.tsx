import { useNavigate } from 'react-router-dom';

import { QuizzoLogoMark } from '@components/ui/brand/QuizzoLogoMark';
import { Icon } from '@components/ui/Icon';
import { AboutFeatureCard } from '@components/ui/settings/AboutFeatureCard';
import { SettingsLeadingHeader } from '@components/ui/settings/SettingsLeadingHeader';
import { SettingsSectionCard } from '@components/ui/settings/SettingsSectionCard';
import {
  ABOUT_APP_NAME,
  ABOUT_DESCRIPTION,
  ABOUT_FEATURES,
  ABOUT_LINKS,
  ABOUT_TAGLINE,
} from '@constants/aboutContent';
import { Routes } from '@constants/Routes';

const FEATURE_ICONS = ['layers', 'zap', 'users'] as const;

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="settings-page is-sub">
      <SettingsLeadingHeader
        title={`À propos de ${ABOUT_APP_NAME}`}
        onBack={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate(Routes.SETTINGS, { replace: true });
        }}
      />

      <section className="settings-framed-hero gains-fade">
        <div className="settings-framed-hero-inner is-about">
          <span className="settings-logo-ring">
            <QuizzoLogoMark size={56} />
          </span>
          <h2>{ABOUT_APP_NAME}</h2>
          <p className="settings-about-tagline">{ABOUT_TAGLINE}</p>
          <span className="settings-version">Version 1.0.0</span>
        </div>
      </section>

      <SettingsSectionCard>
        <p className="settings-copy">{ABOUT_DESCRIPTION}</p>
      </SettingsSectionCard>

      <SettingsSectionCard title="Ce que propose l’app">
        <div className="settings-about-features">
          {ABOUT_FEATURES.map((feature, index) => (
            <AboutFeatureCard
              key={feature.id}
              title={feature.title}
              body={feature.body}
              icon={FEATURE_ICONS[index] ?? 'layers'}
            />
          ))}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard title="Liens utiles">
        {ABOUT_LINKS.map((link) => (
          <a key={link.id} className="settings-contact" href={link.url} target="_blank" rel="noreferrer">
            <strong>{link.label}</strong>
            <Icon name="external-link" size={18} color="#BDBDBD" />
          </a>
        ))}
      </SettingsSectionCard>

      <p className="settings-about-footer">
        © {new Date().getFullYear()} {ABOUT_APP_NAME} · DIGIGROUP
      </p>
    </div>
  );
}
