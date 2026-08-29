import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '@components/ui/auth/AuthShell';
import {
  AccountTypeOption,
  AccountTypeOptionCard,
} from '@components/ui/onboarding/AccountTypeOptionCard';
import { OnboardingNavbar } from '@components/ui/onboarding/OnboardingNavbar';
import { OnboardingSkipBar } from '@components/ui/onboarding/OnboardingSkipBar';
import { Routes } from '@constants/Routes';
import { useOnboardingRegisterStore } from '@stores/onboardingRegisterStore';

const WORKPLACE_OPTIONS: AccountTypeOption[] = [
  { id: 'school', label: 'École', gradientStart: '#FFB703', icon: 'file-text' },
  {
    id: 'higher-education',
    label: 'Enseignement\nsupérieur',
    gradientStart: '#FB8500',
    icon: 'check-square',
  },
  { id: 'teams', label: 'Équipes', gradientStart: '#00B894', icon: 'users' },
  { id: 'enterprise', label: 'Entreprise', gradientStart: '#FF6B6B', icon: 'briefcase' },
];

export function CreateAccountWorkplacePage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const setWorkplaceId = useOnboardingRegisterStore((s) => s.setWorkplaceId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setWorkplaceId(id);
    navigate(Routes.CREATE_ACCOUNT_PROFILE);
  };

  return (
    <AuthShell
      artSrc="/assets/icons/image2.png"
      headline="Ton univers de jeu"
      subline="École, campus, équipe ou entreprise : on adapte l’expérience autour de toi."
      footer={<OnboardingSkipBar onSkip={() => navigate(Routes.WALKTHROUGH, { replace: true })} />}
    >
      <OnboardingNavbar progress={2 / 3} onBack={() => navigate(Routes.CREATE_ACCOUNT_TYPE)} />
      <div className="auth-scroll">
        <div className="auth-text-block">
          <h1 className="auth-title workplace-title">
            Décrivez un lieu de
            <br />
            travail qui vous convient
          </h1>
          <p className="auth-subtitle auth-subtitle--onb">Vous pouvez l&apos;ignorer si vous n&apos;êtes pas sûr.</p>
        </div>
        <div className="auth-options">
          {WORKPLACE_OPTIONS.map((option) => (
            <AccountTypeOptionCard
              key={option.id}
              option={option}
              selected={selectedId === option.id}
              onPress={handleSelect}
            />
          ))}
        </div>
      </div>
    </AuthShell>
  );
}
