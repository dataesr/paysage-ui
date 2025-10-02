export function regexpValidateIdentifiers(type) {
  const validator = {
    euTransparency: [/^\d{11,13}-\d{2}$/, 'Un identifiant EU Transparency doit contenir 11 à 12 chiffres, suivi d"un ' - ' et de 2 chiffres'],
    googleScholar: [/^[a-zA-Z0-9]{12,20}$/, "L'identifiant googleScholar n'est pas valide"],
    hatvp: [/^H\d{9}$/, 'Un identifiant HATVP doit contenir 10 caractères'],
    idref: [/^\d{8}[\dX]{1}$/, 'Un idRef doit commencer par 8 chiffres suivis d\'un chiffre ou d\'un "X"'],
    orcid: [/^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/, 'Un orcid doit contenir 4 fois 4 chiffres et se termine par un chiffre ou un "X"'],
    openAlexStructId: [/^I[A-Za-z0-9]+$/, 'Un identifiant OpenAlex doit commencer par un I et doit être suivis par des chiffres'],
    openAlexPersonId: [/^A[A-Za-z0-9]+$/, 'Un identifiant OpenAlex doit commencer par un A et doit être suivis par des chiffres'],
    openAlexTermId: [/^C[A-Za-z0-9]+$/, 'Un identifiant OpenAlex doit commencer par un C et doit être suivis par des chiffres'],
    rna: [/^W[0-9]{9}$/, 'Un RNA doit commencer par "W" suivi par 9 chiffres'],
    rnsr: [/^\d{9}[A-Z]{1}$/, "Un RNSR doit commencer par 9 chiffres suivis d'une lettre majuscule"],
    ror: [/^[a-z0-9]{9}$/, 'Un ROR doit contenir 9 caractères'],
    rncp: [/^RNCP\d{1,10}$/, "Format invalide. Veuillez utiliser 'RNCP' suivi d'au moins 1 et au plus 10 chiffres."],
    siret: [/^\s*(?:\d\s*){14}$/, 'Un Siret doit contenir 14 chiffres'],
    researchgate: [/^[\w\d-]+$/, 'Uniquement votre identifiant "researchgate".'],
    'piaweb-organization': [/^\d{1,10}$/, 'Un PIA ne contient que des chiffres'],
    'piaweb-project': [/^\d{1,10}$/, 'Un PIA ne contient que des chiffres'],
    uai: [/^[0-9]{7}[A-Z]{1}$/, "Un UAI doit commencer par 7 chiffres suivis d'une lettre majuscule"],
    wikidata: [/^Q[0-9]+$/, "L'identifiant wikidata n'est pas valide"],
  };
  return validator[type] || [null, null];
}
