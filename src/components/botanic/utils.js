export const STEPS = ['Personne', 'Identifiants', 'Fonction', 'Structure'];

export const GENDER_OPTIONS = [
  { value: '', label: 'Sélectionner' },
  { value: 'Homme', label: 'Homme' },
  { value: 'Femme', label: 'Femme' },
  { value: 'Autre', label: 'Autre' },
];

export const PYDREF_GENDER = { M: 'Homme', F: 'Femme' };

export const OFFICIAL_TEXT_NATURE_OPTIONS = [
  { value: '', label: 'Sélectionner' },
  { value: 'Publication au JO', label: 'Publication au JO' },
  { value: 'Publication au BOESR', label: 'Publication au BOESR' },
];

export const OFFICIAL_TEXT_TYPE_OPTIONS = [
  { value: '', label: 'Sélectionner' },
  { value: 'Loi', label: 'Loi' },
  { value: 'Décret', label: 'Décret' },
  { value: 'Ordonnance', label: 'Ordonnance' },
  { value: "Avis de vacance d'emploi", label: "Avis de vacance d'emploi" },
  { value: 'Arrêté', label: 'Arrêté' },
  { value: 'Circulaire', label: 'Circulaire' },
];

export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function capitalizeName(str) {
  return str
    .split(' ')
    .map((word) => word.split('-').map((part) => (part ? part[0].toUpperCase() + part.slice(1) : '')).join('-'))
    .join(' ');
}

export function deduceName(text, mode = 'first') {
  const tokens = (text || '').trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { firstName: '', lastName: '' };
  if (tokens.length === 1) return { firstName: tokens[0], lastName: '' };
  if (mode === 'last') {
    return { firstName: tokens[tokens.length - 1], lastName: tokens.slice(0, -1).join(' ') };
  }
  return { firstName: tokens[0], lastName: tokens.slice(1).join(' ') };
}

export function sanitizeIdentifierValue(type, value) {
  let v = value;
  if (type === 'siret') v = v.replaceAll(' ', '').trim();
  if (type === 'researchgate') {
    const [, profileId] = v.split('profile/');
    if (profileId !== undefined) v = profileId;
  }
  return v;
}
