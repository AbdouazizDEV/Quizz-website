import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/ui/Icon';
import { HelpContactRow } from '@components/ui/settings/HelpContactRow';
import { HelpFaqAccordionItem } from '@components/ui/settings/HelpFaqAccordionItem';
import { SettingsLeadingHeader } from '@components/ui/settings/SettingsLeadingHeader';
import { SettingsSectionCard } from '@components/ui/settings/SettingsSectionCard';
import { HELP_CONTACT_ENTRIES, HELP_FAQ_ENTRIES } from '@constants/helpCenterContent';
import { Routes } from '@constants/Routes';

export function HelpPage() {
  const navigate = useNavigate();

  return (
    <div className="settings-page is-sub">
      <SettingsLeadingHeader
        title="Centre d'aide"
        onBack={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate(Routes.SETTINGS, { replace: true });
        }}
      />

      <div className="settings-sub-board settings-help-board">
        <section className="settings-framed-hero gains-fade">
          <div className="settings-framed-hero-inner">
            <span className="settings-framed-hero-icon">
              <Icon name="life-buoy" size={28} color="#1F2261" />
            </span>
            <h2>Besoin d’aide ?</h2>
            <p>Retrouvez les réponses aux questions fréquentes ou contactez l’équipe Quizz+.</p>
          </div>
        </section>

        <div className="settings-help-split">
          <SettingsSectionCard title="Questions fréquentes">
            {HELP_FAQ_ENTRIES.map((item, index) => (
              <HelpFaqAccordionItem
                key={item.id}
                question={item.question}
                answer={item.answer}
                defaultOpen={index === 0}
              />
            ))}
          </SettingsSectionCard>

          <SettingsSectionCard title="Nous contacter">
            {HELP_CONTACT_ENTRIES.map((item) => (
              <HelpContactRow key={item.id} entry={item} />
            ))}
          </SettingsSectionCard>
        </div>
      </div>
    </div>
  );
}
