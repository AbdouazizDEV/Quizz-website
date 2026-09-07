import { LEGAL_APP_NAME, PRIVACY_POLICY } from '@constants/legalContent';
import { Routes } from '@constants/Routes';
import { LegalDocumentPage } from './LegalDocumentPage';

export function PrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      title="Politique de confidentialité"
      intro={`Cette politique explique comment ${LEGAL_APP_NAME} collecte, utilise et protège vos données personnelles lorsque vous utilisez notre application et notre site web.`}
      sections={PRIVACY_POLICY}
      alternate={{ label: 'Conditions d’utilisation', href: Routes.TERMS }}
    />
  );
}
