import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '@components/ui/auth/AuthShell';
import { OnboardingContinueBar } from '@components/ui/onboarding/OnboardingContinueBar';
import { OnboardingCountryPickerField } from '@components/ui/onboarding/OnboardingCountryPickerField';
import { OnboardingDateField } from '@components/ui/onboarding/OnboardingDateField';
import { OnboardingFilledField } from '@components/ui/onboarding/OnboardingFilledField';
import {
  OnboardingGenderField,
  type OnboardingGender,
} from '@components/ui/onboarding/OnboardingGenderField';
import { OnboardingInternationalPhoneField } from '@components/ui/onboarding/OnboardingInternationalPhoneField';
import { OnboardingNavbar } from '@components/ui/onboarding/OnboardingNavbar';
import { AUTH_FORM_PLACEHOLDERS } from '@constants/authFormPlaceholders';
import { getDefaultAuthCountry, toE164 } from '@constants/authCountries';
import { Routes } from '@constants/Routes';
import { notifyUser } from '@platform/notify';
import { useOnboardingRegisterStore } from '@stores/onboardingRegisterStore';

function computeAge(birth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return Math.max(0, age);
}

export function CreateAccountProfilePage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<OnboardingGender | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultAuthCountry);
  const [phoneValue, setPhoneValue] = useState('');
  const setProfile = useOnboardingRegisterStore((s) => s.setProfile);
  const ageLabel = useMemo(() => (birthDate ? String(computeAge(birthDate)) : ''), [birthDate]);

  const handleContinue = () => {
    if (!birthDate) {
      notifyUser('Profil incomplet', 'Indiquez votre date de naissance.');
      return;
    }
    const y = birthDate.getFullYear();
    const m = String(birthDate.getMonth() + 1).padStart(2, '0');
    const d = String(birthDate.getDate()).padStart(2, '0');
    const birthDateIso = `${y}-${m}-${d}`;
    const phoneE164 = toE164(selectedCountry.dial, phoneValue) || phoneValue.replace(/\s/g, '');
    if (!fullName.trim() || !phoneE164) {
      notifyUser('Profil incomplet', 'Indiquez au minimum votre nom et votre numéro de téléphone.');
      return;
    }
    if (!gender) {
      notifyUser('Profil incomplet', 'Indiquez votre genre pour personnaliser votre avatar.');
      return;
    }
    setProfile({
      fullName: fullName.trim(),
      birthDateIso,
      countryCca2: selectedCountry.cca2,
      phoneE164,
      gender,
    });
    navigate(Routes.REGISTER);
  };

  return (
    <AuthShell
      artSrc="/assets/icons/image3.png"
      headline="Ton profil, tes règles"
      subline="Ces infos restent privées. Elles servent uniquement à personnaliser ton expérience."
      footer={<OnboardingContinueBar onPress={handleContinue} />}
    >
      <OnboardingNavbar progress={1} onBack={() => navigate(Routes.CREATE_ACCOUNT_WORKPLACE)} />
      <div className="auth-text-block">
        <h1 className="auth-title profile-title">Créer un compte ✏️</h1>
        <p className="auth-subtitle auth-subtitle--profile">
          Veuillez compléter votre profil. Ne vous inquiétez pas, vos données resteront privées et
          vous seul pourrez les voir.
        </p>
      </div>
      <div className="auth-scroll">
        <div className="auth-form auth-form--profile">
          <OnboardingFilledField
            label="Nom complet"
            value={fullName}
            onChangeText={setFullName}
            placeholder={AUTH_FORM_PLACEHOLDERS.fullName}
            inputProps={{ autoComplete: 'name' }}
          />
          <OnboardingDateField
            label="Date de naissance"
            value={birthDate}
            onChange={setBirthDate}
            placeholder={AUTH_FORM_PLACEHOLDERS.birthDate}
          />
          <OnboardingGenderField label="Genre" value={gender} onChange={setGender} />
          <OnboardingInternationalPhoneField
            label="Numéro de téléphone"
            country={selectedCountry}
            onChangeCountry={setSelectedCountry}
            nationalNumber={phoneValue}
            onChangePhoneNumber={setPhoneValue}
            placeholder={AUTH_FORM_PLACEHOLDERS.phone}
          />
          <OnboardingCountryPickerField
            label="Pays"
            country={selectedCountry}
            onChangeCountry={setSelectedCountry}
          />
          <OnboardingFilledField label="Âge" value={ageLabel} editable={false} />
        </div>
      </div>
    </AuthShell>
  );
}
