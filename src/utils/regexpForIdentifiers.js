export function regexpValidateIdentifiers(type) {
  const validator = {
    idref: [/^\d{8}[\dX]{1}$/, 'Un idRef doit commencer par 8 chiffres suivis d\'un chiffre ou d\'un "X"'],
    rna: [/^W[0-9]{9}$/, 'Un RNA doit commencer par "W" suivi par 9 chiffres'],
    rnsr: [/^\d{9}[A-Z]{1}$/, "Un RNSR doit commencer par 9 chiffres suivis d'une lettre majuscule"],
    ror: [/^[a-z0-9]{9}$/, 'Un ROR doit contenir 9 caractères'],
    siret: [/^\s*(?:\d\s*){14}$/, 'Un Siret doit contenir 14 chiffres'],
    uai: [/^[0-9]{7}[A-Z]{1}$/, "Un UAI doit commencer par 7 chiffres suivis d'une lettre majuscule"],
    wikidata: [/^Q[0-9]+$/, 'Un wikidata doit commencer par "Q"'],
    orcid: [/^0000-000(1-[5-9]|2-[0-9]|3-[0-4])\d{3}-\d{3}[\dX]$/, 'Un orcid doit commencer par 0000-000 et se termine par un chiffre ou la lettre X'],
  };
  return validator[type] || [null, null];
}
