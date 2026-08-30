import { useNavigate } from 'react-router-dom';

import { PersonalInfoHeroCard } from '@components/ui/settings/PersonalInfoHeroCard';
import { SettingsChoiceChips } from '@components/ui/settings/SettingsChoiceChips';
import { SettingsFormField } from '@components/ui/settings/SettingsFormField';
import { SettingsLeadingHeader } from '@components/ui/settings/SettingsLeadingHeader';
import { SettingsSectionCard } from '@components/ui/settings/SettingsSectionCard';
import { Routes } from '@constants/Routes';
import { useAuthMe } from '@hooks/useAuthMe';
import { usePersonalInfo } from '@hooks/usePersonalInfo';

const ACCOUNT_TYPES = [
  { value: 'personal', label: 'Personnel' },
  { value: 'student', label: 'Étudiant' },
  { value: 'professional', label: 'Professionnel' },
] as const;

const WORKPLACES = [
  { value: 'higher-education', label: 'Enseignement supérieur' },
  { value: 'school', label: 'École / collège / lycée' },
  { value: 'company', label: 'Entreprise' },
  { value: 'other', label: 'Autre' },
] as const;

export function PersonalInfoPage() {
  const navigate = useNavigate();
  const { data: me } = useAuthMe();
  const { form, loading, saving, error, saved, updateField, save } = usePersonalInfo();
  const userId = me?.user?.id ?? '';

  return (
    <div className="settings-page is-sub">
      <SettingsLeadingHeader
        title="Informations personnelles"
        onBack={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate(Routes.SETTINGS, { replace: true });
        }}
      />

      {loading || !form ? (
        <div className="settings-loader" role="status" aria-label="Chargement">
          <div className="settings-spinner-gold" />
        </div>
      ) : (
        <div className="settings-personal-body settings-sub-board">
          <div className="settings-sub-primary">
            <PersonalInfoHeroCard form={form} userId={userId} />
          </div>

          <div className="settings-sub-secondary">
          <SettingsSectionCard title="Identité">
            <SettingsFormField
              label="E-mail"
              value={form.email}
              onChange={() => undefined}
              disabled
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="off"
            />
            <SettingsFormField
              label="Nom complet"
              value={form.fullName}
              onChange={(value) => updateField('fullName', value)}
              placeholder="Votre nom"
              autoComplete="name"
              autoCapitalize="words"
            />
            <SettingsFormField
              label="Nom d'utilisateur"
              value={form.username}
              onChange={(value) => updateField('username', value)}
              placeholder="Pseudo visible"
              autoComplete="username"
              autoCapitalize="off"
            />
            <SettingsFormField
              label="Bio"
              value={form.bio}
              onChange={(value) => updateField('bio', value)}
              placeholder="Quelques mots sur vous…"
              multiline
            />
          </SettingsSectionCard>

          <SettingsSectionCard title="Contact">
            <SettingsFormField
              label="Téléphone"
              value={form.phone}
              onChange={(value) => updateField('phone', value)}
              placeholder="+221…"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
            />
            <SettingsFormField
              label="Date de naissance"
              value={form.birthDate}
              onChange={(value) => updateField('birthDate', value)}
              placeholder="AAAA-MM-JJ"
              autoComplete="bday"
              autoCapitalize="off"
            />
            <SettingsFormField
              label="Pays (code ISO)"
              value={form.countryCode}
              onChange={(value) => updateField('countryCode', value)}
              placeholder="SN, FR…"
              autoComplete="country"
              autoCapitalize="characters"
            />
          </SettingsSectionCard>

          <SettingsSectionCard title="Profil Quizz+">
            <SettingsChoiceChips
              label="Type de compte"
              options={ACCOUNT_TYPES}
              value={form.accountTypeSlug}
              onChange={(value) => updateField('accountTypeSlug', value)}
            />
            <SettingsChoiceChips
              label="Contexte"
              options={WORKPLACES}
              value={form.workplaceSlug}
              onChange={(value) => updateField('workplaceSlug', value)}
            />
            <p className="settings-meta">
              {form.quizzesCompleted} quiz terminés · {form.totalScore} points cumulés
            </p>
          </SettingsSectionCard>

          {error ? <p className="settings-error">{error.message}</p> : null}
          {saved ? <p className="settings-success">Modifications enregistrées.</p> : null}

          <button
            type="button"
            className="settings-save"
            disabled={saving}
            onClick={() => void save()}
          >
            {saving ? <span className="settings-save-spinner" /> : 'Enregistrer'}
          </button>
          </div>
        </div>
      )}
    </div>
  );
}
