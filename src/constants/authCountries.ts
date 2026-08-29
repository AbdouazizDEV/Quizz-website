export interface AuthCountry {
  cca2: string;
  name: string;
  dial: string;
  flag: string;
}

export const AUTH_COUNTRIES: AuthCountry[] = [
  { cca2: 'SN', name: 'Sénégal', dial: '221', flag: '🇸🇳' },
  { cca2: 'CI', name: 'Côte d’Ivoire', dial: '225', flag: '🇨🇮' },
  { cca2: 'ML', name: 'Mali', dial: '223', flag: '🇲🇱' },
  { cca2: 'GN', name: 'Guinée', dial: '224', flag: '🇬🇳' },
  { cca2: 'BF', name: 'Burkina Faso', dial: '226', flag: '🇧🇫' },
  { cca2: 'NE', name: 'Niger', dial: '227', flag: '🇳🇪' },
  { cca2: 'TG', name: 'Togo', dial: '228', flag: '🇹🇬' },
  { cca2: 'BJ', name: 'Bénin', dial: '229', flag: '🇧🇯' },
  { cca2: 'MR', name: 'Mauritanie', dial: '222', flag: '🇲🇷' },
  { cca2: 'GM', name: 'Gambie', dial: '220', flag: '🇬🇲' },
  { cca2: 'GW', name: 'Guinée-Bissau', dial: '245', flag: '🇬🇼' },
  { cca2: 'CM', name: 'Cameroun', dial: '237', flag: '🇨🇲' },
  { cca2: 'GA', name: 'Gabon', dial: '241', flag: '🇬🇦' },
  { cca2: 'CG', name: 'Congo', dial: '242', flag: '🇨🇬' },
  { cca2: 'CD', name: 'RDC', dial: '243', flag: '🇨🇩' },
  { cca2: 'MA', name: 'Maroc', dial: '212', flag: '🇲🇦' },
  { cca2: 'DZ', name: 'Algérie', dial: '213', flag: '🇩🇿' },
  { cca2: 'TN', name: 'Tunisie', dial: '216', flag: '🇹🇳' },
  { cca2: 'EG', name: 'Égypte', dial: '20', flag: '🇪🇬' },
  { cca2: 'FR', name: 'France', dial: '33', flag: '🇫🇷' },
  { cca2: 'BE', name: 'Belgique', dial: '32', flag: '🇧🇪' },
  { cca2: 'CH', name: 'Suisse', dial: '41', flag: '🇨🇭' },
  { cca2: 'CA', name: 'Canada', dial: '1', flag: '🇨🇦' },
  { cca2: 'US', name: 'États-Unis', dial: '1', flag: '🇺🇸' },
  { cca2: 'GB', name: 'Royaume-Uni', dial: '44', flag: '🇬🇧' },
  { cca2: 'DE', name: 'Allemagne', dial: '49', flag: '🇩🇪' },
  { cca2: 'ES', name: 'Espagne', dial: '34', flag: '🇪🇸' },
  { cca2: 'IT', name: 'Italie', dial: '39', flag: '🇮🇹' },
  { cca2: 'PT', name: 'Portugal', dial: '351', flag: '🇵🇹' },
];

export function getDefaultAuthCountry(): AuthCountry {
  return (
    AUTH_COUNTRIES.find((c) => c.cca2 === 'SN') ??
    AUTH_COUNTRIES.find((c) => c.cca2 === 'FR') ??
    AUTH_COUNTRIES.find((c) => c.cca2 === 'US') ??
    AUTH_COUNTRIES[0]
  );
}

export function getAuthCountry(cca2: string): AuthCountry | undefined {
  return AUTH_COUNTRIES.find((c) => c.cca2 === cca2);
}

export function toE164(dial: string, national: string): string {
  const digits = national.replace(/\D/g, '').replace(/^0+/, '');
  if (!digits) return '';
  return `+${dial}${digits}`;
}
