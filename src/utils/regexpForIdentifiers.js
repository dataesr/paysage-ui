export function regexpValidateIdentifiers(type) {
  const validator = {
    euTransparency: [/^\d{12}-\d{2}$/, 'Un identifiant EU Transparency doit contenir 12 caractères suivi d"un ' - ' et de 2 charactères'],
    hatvp: [/^H\d{9}$/, 'Un identifiant HATVP doit contenir 10 caractères'],
    googleScholar: [/^[a-zA-Z0-9]{12,20}$/, "L'identifiant googleScholar n'est pas valide"],
    idref: [/^\d{8}[\dX]{1}$/, 'Un idRef doit commencer par 8 chiffres suivis d\'un chiffre ou d\'un "X"'],
    rna: [/^W[0-9]{9}$/, 'Un RNA doit commencer par "W" suivi par 9 chiffres'],
    rnsr: [/^\d{9}[A-Z]{1}$/, "Un RNSR doit commencer par 9 chiffres suivis d'une lettre majuscule"],
    ror: [/^[a-z0-9]{9}$/, 'Un ROR doit contenir 9 caractères'],
    rncp: [/^RNCP\d{1,10}$/, "Format invalide. Veuillez utiliser 'RNCP' suivi d'au moins 1 et au plus 10 chiffres."],
    siret: [/^\s*(?:\d\s*){14}$/, 'Un Siret doit contenir 14 chiffres'],
    researchgate: [/researchgate/, 'Renseigner l\'url de votre profil "researchgate".'],
    'piaweb-organization': [/^\d{1,10}$/, 'Un PIA ne contient que des chiffres'],
    'piaweb-project': [/^\d{1,10}$/, 'Un PIA ne contient que des chiffres'],
    uai: [/^[0-9]{7}[A-Z]{1}$/, "Un UAI doit commencer par 7 chiffres suivis d'une lettre majuscule"],
    wikidata: [/^Q[0-9]+$/, 'Un wikidata doit commencer par "Q"'],
    orcid: [/^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/, 'Un orcid doit contenir 4 fois 4 chiffres et se termine par un chiffre ou un "X"'],
  };
  return validator[type] || [null, null];
}
