export const STEPS = ['Personne', 'Identifiants', 'Fonction', 'Structure'];

export const GENDER_OPTIONS = [
  { value: '', label: 'Sélectionner' },
  { value: 'Homme', label: 'Homme' },
  { value: 'Femme', label: 'Femme' },
  { value: 'Autre', label: 'Autre' },
];

export const PYDREF_GENDER = { M: 'Homme', F: 'Femme' };

export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function capitalizeName(str) {
  return str
    .split(' ')
    .map((word) => word.split('-').map((part) => (part ? part[0].toUpperCase() + part.slice(1) : '')).join('-'))
    .join(' ');
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
