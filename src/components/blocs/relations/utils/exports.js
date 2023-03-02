import * as XLSX from 'xlsx';
import { getComparableNow } from '../../../../utils/dates';
import getRelationTypeLabel from '../../../../utils/get-relation-type-key';

const isFinished = (relation) => ((relation.current !== undefined) && !relation.current) || (relation.active === false) || (relation.endDate < getComparableNow());

const getCivility = (gender) => {
  switch (gender) {
  case 'Homme':
    return 'Monsieur';
  case 'Femme':
    return 'Madame';
  default:
    return null;
  }
};

const getCivilityArticle = (gender) => {
  switch (gender) {
  case 'Homme':
    return 'le ';
  case 'Femme':
    return 'la ';
  default:
    return null;
  }
};

const getCivilityAddress = (relation, person) => {
  const annuaire = relation.mandatePrecision || relation.relationType?.[getRelationTypeLabel(person.gender)];
  if (!annuaire) return '';
  const interim = relation.mandateTemporary ? ' par interim' : '';
  if (!['Homme', 'Femme'].includes(person.gender)) return `${annuaire}${interim}`;
  let article = getCivilityArticle(person.gender);
  const civility = getCivility(person.gender);
  if (['a', 'e', 'i', 'o', 'u', 'y'].includes(annuaire[0].toLowerCase())) { article = "l'"; }
  return `${civility} ${article}${annuaire}${interim}`;
};

const addInterim = (input, interim) => {
  if (!input) return null;
  if (interim) return `${input} par intérim`;
  return input;
};

function createXLSXFile(sheetsObject) {
  const wb = XLSX.utils.book_new();
  Object.entries(sheetsObject).forEach(([k, v]) => {
    const ws = XLSX.utils.json_to_sheet(v);
    XLSX.utils.book_append_sheet(wb, ws, k);
  });
  return XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
}

function downloadCsvFile(csv, filename) {
  const downloadUrl = URL.createObjectURL(new Blob([csv], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', `${filename}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function createCsvStructureRowFromRelation({ relation, inverse, listName }) {
  const toExport = inverse ? relation.resource : relation.relatedObject;
  return {
    Libellé: toExport.displayName,
    Type: listName,
    'Status de la liaison': isFinished(relation) ? 'Terminée' : 'En cours',
    'Date de début': relation.startDate,
    'Date de fin': relation.endDate,
    'Terminée à une date inconnue': (isFinished(relation) && !relation.endDate) ? 'Oui' : null,
    'Date de fin prévue': relation.endDatePrevisional,
    'Texte officiel de début de liaison': relation.startDateOfficialText?.title,
    'Lien du texte officiel de début de liaison': relation.startDateOfficialText?.pageUrl,
    'Texte officiel de fin de liaison': relation.endDateOfficialText?.title,
    'Lien du texte officiel de fin de liaison': relation.endDateOfficialText?.pageUrl,
    "Nom d'usage": toExport.displayName,
    Acronyme: toExport?.currentName?.acronymFr,
    'Nom officiel': toExport?.currentName?.officialName,
    'Nom court': toExport?.currentName?.shortName,
    'Catégorie juridique': toExport.legalcategory?.longNameFr,
    Catégorie: toExport.category?.usualNameFr,
    Catégories: toExport.categories?.map((c) => c.usualNameFr).join('|'),
    'Status de la structure': toExport.structureStatus,
    'Date de création': toExport?.creationDate,
    'Date de fermeture': toExport?.closureDate,
    Géolocalisation: toExport.currentLocalisation?.geometry?.coordinates?.toString(),
    'Mention de distribution': toExport.currentLocalisation?.distributionStatement,
    Adresse: toExport.currentLocalisation?.address,
    'Lieu-dit': toExport.currentLocalisation?.place,
    'Numéro de boite postale': toExport.currentLocalisation?.postOfficeBoxNumber,
    'Code postal': toExport.currentLocalisation?.postalCode,
    Localité: toExport.currentLocalisation?.locality,
    Commune: toExport.currentLocalisation?.city,
    'Code commune': toExport.currentLocalisation?.cityId,
    Pays: toExport.currentLocalisation?.country,
    'Code Pays': toExport.currentLocalisation?.iso3,
    'Site web': (toExport?.websites?.length) ? (toExport?.websites.find((w) => w.language?.toLowerCase() === 'fr')?.url || toExport?.websites?.[0]?.url) : null,
    Téléphone: toExport.currentLocalisation?.phonenumber,
    'ID Paysage': toExport.id,
    wikidata: toExport.identifiers?.filter((i) => (i.type === 'wikidata'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    idref: toExport.identifiers?.filter((i) => (i.type === 'idref'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    uai: toExport.identifiers?.filter((i) => (i.type === 'UAI'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    siret: toExport.identifiers?.filter((i) => (i.type === 'Siret'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    grid: toExport.identifiers?.filter((i) => (i.type === 'GRID'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    ror: toExport.identifiers?.filter((i) => (i.type === 'ROR'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant Annelis': toExport.identifiers?.filter((i) => (i.type === 'id annelis'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant établissement ESGBU': toExport.identifiers?.filter((i) => (i.type === 'EtId'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant SCD ESGBU': toExport.identifiers?.filter((i) => (i.type === 'ESGBU')).sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant bibliothèque ESGBU': toExport.identifiers?.filter((i) => (i.type === 'BibId'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant Ecole doctorale': toExport.identifiers?.filter((i) => (i.type === "Numéro d'ED"))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Email générique Direction': toExport?.emails.find((m) => m.emailTypeId === 'NVdq8NVdq8NVdq8')?.email,
    'Email générique DGS/SG': toExport?.emails.find((m) => m.emailTypeId === '4puTu4puTu4puTu')?.email,
  };
}

function createCategoryTermRowFromRelation({ relation, inverse, listName }) {
  const toExport = inverse ? relation.resource : relation.relatedObject;
  const currentObject = inverse ? relation.relatedObject : relation.resource;
  return {
    'ID paysage ressource': currentObject.id,
    Ressource: currentObject.displayName,
    'ID paysage': toExport.id,
    Libellé: toExport.displayName,
    'Libellé en anglais': toExport.usualNameFr,
    Description: toExport.decriptionFr,
    'Desciption en anglais': toExport.displayName,
    Type: listName,
    'Date de début': relation.startDate,
    'Date de fin': relation.endDate,
    'Relation terminée à une date inconnue': (isFinished(relation) && !relation.endDate) ? 'Oui' : null,
    'Date de fin prévue': relation.endDatePrevisional,
    'Texte officiel de début de liaison': relation.startDateOfficialText?.title,
    'Lien du texte officiel de début de liaison': relation.startDateOfficialText?.pageUrl,
    'Texte officiel de fin de liaison': relation.endDateOfficialText?.title,
    'Lien du texte officiel de fin de liaison': relation.endDateOfficialText?.pageUrl,
  };
}
function createTutelleRowFromRelation({ relation, inverse, listName }) {
  const toExport = inverse ? relation.resource : relation.relatedObject;
  const currentObject = inverse ? relation.relatedObject : relation.resource;
  return {
    'ID paysage ressource': currentObject.id,
    Ressource: currentObject.displayName,
    'ID paysage': toExport.id,
    Libellé: toExport.displayName,
    Type: listName,
    'Date de début': relation.startDate,
    'Date de fin': relation.endDate,
    'Relation terminée à une date inconnue': (isFinished(relation) && !relation.endDate) ? 'Oui' : null,
    'Date de fin prévue': relation.endDatePrevisional,
    'Texte officiel de début de liaison': relation.startDateOfficialText?.title,
    'Lien du texte officiel de début de liaison': relation.startDateOfficialText?.pageUrl,
    'Texte officiel de fin de liaison': relation.endDateOfficialText?.title,
    'Lien du texte officiel de fin de liaison': relation.endDateOfficialText?.pageUrl,
  };
}
function createLegalCategoryRowFromRelation({ relation, inverse, listName }) {
  const toExport = inverse ? relation.resource : relation.relatedObject;
  const currentObject = inverse ? relation.relatedObject : relation.resource;
  return {
    'ID paysage ressource': currentObject.id,
    Ressource: currentObject.displayName,
    'ID paysage': toExport.id,
    Libellé: toExport.displayName,
    'Libellé en anglais': toExport.longNameEn,
    'Personalité morale': toExport.legalPersonality,
    Secteur: toExport.sector,
    'Appartient à la recherche publique': toExport.inPublicReasearch,
    'Code INSEE': toExport.inseeCode,
    Type: listName,
    'Date de début': relation.startDate,
    'Date de fin': relation.endDate,
    'Relation terminée à une date inconnue': (isFinished(relation) && !relation.endDate) ? 'Oui' : null,
    'Date de fin prévue': relation.endDatePrevisional,
    'Texte officiel de début de liaison': relation.startDateOfficialText?.title,
    'Lien du texte officiel de début de liaison': relation.startDateOfficialText?.pageUrl,
    'Texte officiel de fin de liaison': relation.endDateOfficialText?.title,
    'Lien du texte officiel de fin de liaison': relation.endDateOfficialText?.pageUrl,
  };
}
function createCsvLaureatesFromRelation({ relation, listName }) {
  const laureate = relation.relatedObject;
  const prize = relation.resource;
  const { otherAssociatedObjects } = relation;
  return {
    Liste: listName,
    'Type de Lauréat': (laureate.collection === 'structures') ? 'Structure' : 'Personne',
    Précision: `${relation.laureatePrecision ? relation.laureatePrecision : ''}`,
    'Libellé Lauréat': laureate.displayName,
    'Code Paysage Lauréat': laureate.id,
    'idref lauréat': laureate.identifiers?.filter((i) => (i.type === 'idref'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Orcid lauréat': laureate.identifiers?.filter((i) => (i.type === 'orcid'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Libellé du prix': prize.displayName,
    'Libellé complément prix': prize.descriptionFr,
    'Code Paysage Prix': prize.id,
    'Année lauréat': relation.startDate,
    'Affiliation lauréat associée à obtention -- libellé': otherAssociatedObjects.map((item) => item.currentName?.usualName).join(';'),
    'Affiliation lauréat associée à obtention -- code paysage': otherAssociatedObjects.map((item) => item.id).join(';'),
    'Affiliation lauréat associée à obtention -- code RNSR': otherAssociatedObjects
      .map((item) => item.identifiers?.length && item.identifiers.filter((i) => i.active).find((i) => (i.type === 'RNSR'))?.value)
      .join(';'),
    'Affiliation lauréat associée à obtention -- code wikidata': otherAssociatedObjects
      .map((item) => item.identifiers?.length && item.identifiers.filter((i) => i.active).find((i) => (i.type === 'wikidata'))?.value)
      .join(';'),
    'Affiliation lauréat associée à obtention -- code SIREN': otherAssociatedObjects
      .map((item) => item.identifiers?.length && item.identifiers.filter((i) => i.active).find((i) => (i.type === 'Siret'))?.value)
      .join(';'),
    'Affiliation lauréat associée à obtention -- code ROR': otherAssociatedObjects
      .map((item) => item.identifiers?.length && item.identifiers.filter((i) => i.active).find((i) => (i.type === 'ROR'))?.value)
      .join(';'),
  };
}

function createCsvGovernanceFromRelation({ relation, short = false }) {
  const person = relation.relatedObject;
  const structure = relation.resource;
  const result = {
    'Type de structure': structure.category?.usualNameFr,
    Civilité: getCivility(person.gender),
    Nom: person.lastName,
    Prénom: person.firstName,
    Structure: structure.displayName,
    Titre: addInterim(relation.mandatePrecision || relation.relationType?.[getRelationTypeLabel(person.gender)], relation.mandateTemporary),
    'Civilité Adresse + Lettre': getCivilityAddress(relation, person),
    Adresse: [structure.currentLocalisation?.distributionStatement, structure.currentLocalisation?.address, structure.currentLocalisation?.place]
      .map((a) => a).join('\n').trim(),
    CP: structure.currentLocalisation?.postalCode,
    Ville: structure.currentLocalisation?.locality,
    'Email générique': relation.mandateEmail,
    'Email nominatif': relation.personalEmail,
    Téléphone: relation.mandatePhonenumber,
    Genre: person.gender,
    Fonction: relation.relationType?.[getRelationTypeLabel(person.gender)],
    'Intitulé exact de la fonction': relation.mandatePrecision,
    'Raison du mandat (nomination/election)': relation.mandateReason,
    'Position du mandat': (relation.mandatePosition !== 'ND') ? relation.mandatePosition : null,
    'Fonction par intérim': relation.mandateTemporary ? 'Oui' : null,
    'Date de début': relation.startDate,
    'Date de fin': relation.endDate,
    'Fonction terminée à une date inconnue': (isFinished(relation) && !relation.endDate) ? 'Oui' : null,
    'Date de fin prévue': relation.endDatePrevisional,
    'Texte officiel de début de fonction': relation.startDateOfficialText?.title,
    'Lien du texte officiel de début de fonction': relation.startDateOfficialText?.pageUrl,
    'Texte officiel de fin de fonction': relation.endDateOfficialText?.title,
    'Lien du texte officiel de fin de fonction': relation.endDateOfficialText?.pageUrl,
    'Identifiant paysage de la structure': structure.id,
    'Identifiant paysage de la personne': person.id,
    'idref de la personne': person.identifiers?.filter((i) => (i.type === 'idref'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Orcid de la personne': person.identifiers?.filter((i) => (i.type === 'orcid'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'wikidata de la personne': person.identifiers?.filter((i) => (i.type === 'wikidata'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'wikidata de la structure': structure.identifiers?.filter((i) => (i.type === 'wikidata'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'idref de la structure': structure.identifiers?.filter((i) => (i.type === 'idref'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'uai de la structure': structure.identifiers?.filter((i) => (i.type === 'UAI'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'siret de la structure': structure.identifiers?.filter((i) => (i.type === 'Siret'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'grid de la structure': structure.identifiers?.filter((i) => (i.type === 'GRID'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'ror de la structure': structure.identifiers?.filter((i) => (i.type === 'ROR'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant Annelis de la structure': structure.identifiers?.filter((i) => (i.type === 'id annelis'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant établissement ESGBU de la structure': structure.identifiers?.filter((i) => (i.type === 'EtId'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant SCD ESGBU de la structure': structure.identifiers?.filter((i) => (i.type === 'ESGBU'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant bibliothèque ESGBU de la structure': structure.identifiers?.filter((i) => (i.type === 'BibId'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant Ecole doctorale de la structure': structure.identifiers?.filter((i) => (i.type === "Numéro d'ED"))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
  };
  if (short) {
    delete result.Adresse;
    delete result.CP;
    delete result.Ville;
    delete result.Téléphone;
    delete result['Email générique'];
    delete result['Civilité Adresse + Lettre'];
    delete result['Email nominatif'];
    delete result.mandatePhonenumer;
  }
  return result;
}
function createCsvPersonFromRelation({ relation, inverse }) {
  const person = inverse ? relation.resource : relation.relatedObject;
  const relatedObject = inverse ? relation.relatedObject : relation.resource;
  return {
    'ID paysage ressource': relatedObject.id,
    Ressource: relatedObject.displayName,
    Civilité: getCivility(person.gender),
    Nom: person.lastName,
    Prénom: person.firstName,
    Fonction: relation.relationType?.[getRelationTypeLabel(person.gender)] || 'Appartient à la liste',
    'Date de début': relation.startDate,
    'Date de fin': relation.endDate,
    'Terminée à une date inconnue': (isFinished(relation) && !relation.endDate) ? 'Oui' : null,
    'Date de fin prévue': relation.endDatePrevisional,
    'Texte officiel de début de fonction': relation.startDateOfficialText?.title,
    'Lien du texte officiel de début de fonction': relation.startDateOfficialText?.pageUrl,
    'Texte officiel de fin de fonction': relation.endDateOfficialText?.title,
    'Lien du texte officiel de fin de fonction': relation.endDateOfficialText?.pageUrl,
    'Identifiant paysage de la personne': person.id,
    'idref de la personne': person.identifiers?.filter((i) => (i.type === 'idref'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Orcid de la personne': person.identifiers?.filter((i) => (i.type === 'orcid'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
    'wikidata de la personne': person.identifiers?.filter((i) => (i.type === 'wikidata'))
      .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|'),
  };
}

function createCsvPrizeFromRelation({ relation, inverse }) {
  const prize = inverse ? relation.resource : relation.relatedObject;
  const relatedObject = inverse ? relation.relatedObject : relation.resource;
  return {
    'ID paysage ressource': relatedObject.id,
    Ressource: relatedObject.displayName,
    Libellé: prize.displayName,
    'Libellé anglais': prize.nameEn,
    Description: prize.descriptionFr,
    'Description en anglais': prize.descriptionEn,
    'Date de début': relation.startDate,
    'Date de fin': relation.endDate,
    'Terminée à une date inconnue': (isFinished(relation) && !relation.endDate) ? 'Oui' : null,
    'Date de fin prévue': relation.endDatePrevisional,
    'Texte officiel de début de fonction': relation.startDateOfficialText?.title,
    'Lien du texte officiel de début de fonction': relation.startDateOfficialText?.pageUrl,
    'Texte officiel de fin de fonction': relation.endDateOfficialText?.title,
    'Lien du texte officiel de fin de fonction': relation.endDateOfficialText?.pageUrl,
  };
}

const inverseMapping = {
  'categorie-parent': createCategoryTermRowFromRelation,
  gouvernance: createCsvGovernanceFromRelation,
  laureat: createCsvLaureatesFromRelation,
  'personne-categorie': createCsvPersonFromRelation,
  'personne-terme': createCsvPersonFromRelation,
  'prix-categorie': createCsvPrizeFromRelation,
  'prix-terme': createCsvPrizeFromRelation,
  'prix-porteur': null,
  'projet-contact': null,
  'projet-categorie': null,
  'projet-participation': null,
  'projet-terme': null,
  'structure-categorie': createCsvStructureRowFromRelation,
  'structure-categorie-juridique': createCsvStructureRowFromRelation,
  'structure-interne': createCsvStructureRowFromRelation,
  'structure-predecesseur': createCsvStructureRowFromRelation,
  'referent-mesr': createCsvGovernanceFromRelation,
  'structure-terme': createCsvStructureRowFromRelation,
  'structure-tutelle': createTutelleRowFromRelation,
  'terme-categorie': createCategoryTermRowFromRelation,
  'terme-parent': createCategoryTermRowFromRelation,
};
const regularMapping = {
  'categorie-parent': createCategoryTermRowFromRelation,
  gouvernance: createCsvGovernanceFromRelation,
  laureat: createCsvLaureatesFromRelation,
  'personne-categorie': createCategoryTermRowFromRelation,
  'personne-terme': createCategoryTermRowFromRelation,
  'prix-categorie': createCategoryTermRowFromRelation,
  'prix-terme': createCategoryTermRowFromRelation,
  'prix-porteur': createCsvStructureRowFromRelation,
  'projet-contact': null,
  'projet-categorie': createCategoryTermRowFromRelation,
  'projet-participation': null,
  'projet-terme': createCategoryTermRowFromRelation,
  'structure-categorie': createCategoryTermRowFromRelation,
  'structure-categorie-juridique': createLegalCategoryRowFromRelation,
  'structure-interne': createCsvStructureRowFromRelation,
  'structure-predecesseur': createCsvStructureRowFromRelation,
  'referent-mesr': createCsvGovernanceFromRelation,
  'structure-terme': createCategoryTermRowFromRelation,
  'structure-tutelle': createCsvStructureRowFromRelation,
  'terme-categorie': createCategoryTermRowFromRelation,
  'terme-parent': createCategoryTermRowFromRelation,
  structures: createCsvStructureRowFromRelation,
  persons: createCsvPersonFromRelation,
  prizes: createCsvPrizeFromRelation,
  'prix-des-membres': createCsvLaureatesFromRelation,
};

const hasSingleSheet = ['prix-des-membres', 'laureat'];

export function exportToCsv({ data, fileName, listName, tag, inverse = false }) {
  const func = inverse ? inverseMapping[tag] : regularMapping[tag];
  const sheetsObject = {};
  const singleSheet = hasSingleSheet.includes(tag);
  if (!singleSheet) {
    sheetsObject.Actif = data?.filter((i) => !isFinished(i))?.map((item) => func({ relation: item, inverse, listName }));
    sheetsObject.Inactif = data?.filter((i) => isFinished(i))?.map((item) => func({ relation: item, inverse, listName, short: true }));
  }
  sheetsObject.Tout = data?.map((item) => func({ relation: item, inverse, listName, short: true }));
  const xlsx = createXLSXFile(sheetsObject);
  return downloadCsvFile(xlsx, fileName);
}
export function hasExport({ tag, inverse = false }) {
  return !!(inverse ? inverseMapping[tag] : regularMapping[tag]);
}
