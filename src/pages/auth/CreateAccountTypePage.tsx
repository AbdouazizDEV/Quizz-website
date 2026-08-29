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

const OPTIONS: AccountTypeOption[] = [
  { id: 'personal', label: 'Personnel', gradientStart: '#FFB703', icon: 'user' },
  { id: 'teacher', label: 'Professeur', gradientStart: '#FB8500', icon: 'users' },
  { id: 'student', label: 'Étudiant', gradientStart: '#00B894', icon: 'user-check' },
  { id: 'professional', label: 'Professionnel', gradientStart: '#FF6B6B', icon: 'briefcase' },
];

export function CreateAccountTypePage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const setAccountTypeId = useOnboardingRegisterStore((s) => s.setAccountTypeId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setAccountTypeId(id);
    navigate(Routes.CREATE_ACCOUNT_WORKPLACE);
  };

  return (
    <AuthShell
      artSrc="/assets/icons/image1.png"
      headline="Crée le compte qui te ressemble"
      subline="Personnel, prof, étudiant ou pro — tu pourras toujours l’ajuster plus tard."
      footer={<OnboardingSkipBar onSkip={() => navigate(Routes.WALKTHROUGH, { replace: true })} />}
    >
      <OnboardingNavbar progress={1 / 3} onBack={() => navigate(-1)} />
      <div className="auth-scroll">
        <div className="auth-text-block">
          <h1 className="auth-title create-title">
            Quel type de compte
            <br />
            aimez-vous créer ? 👦
          </h1>
          <p className="auth-subtitle auth-subtitle--onb">Vous pouvez l&apos;ignorer si vous n&apos;êtes pas sûr.</p>
        </div>
        <div className="auth-options">
          {OPTIONS.map((option) => (
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
