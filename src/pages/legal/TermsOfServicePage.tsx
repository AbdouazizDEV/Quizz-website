import { LEGAL_APP_NAME, TERMS_OF_SERVICE } from '@constants/legalContent';
import { Routes } from '@constants/Routes';
import { LegalDocumentPage } from './LegalDocumentPage';

export function TermsOfServicePage() {
  return (
    <LegalDocumentPage
      title="Conditions d’utilisation"
      intro={`Les présentes conditions encadrent l’utilisation de ${LEGAL_APP_NAME}. Veuillez les lire attentivement avant de créer un compte ou de vous connecter.`}
      sections={TERMS_OF_SERVICE}
      alternate={{ label: 'Politique de confidentialité', href: Routes.PRIVACY }}
    />
  );
}
