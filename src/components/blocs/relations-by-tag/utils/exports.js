import { Parser } from 'json2csv';

const parser = new Parser({ delimiter: ';', quote: '' });

function createCsvFile(exportList) {
  return parser.parse(exportList);
}

function downloadCsvFile(csv, filename) {
  const downloadUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function createCsvStructureRowFromRelation(relation, inverse) {
  const toExport = inverse ? relation.resource : relation.relatedObject;
  // const parent = inverse ? relation.relatedObject : relation.resource;
  return {
    Libellé: toExport.displayName,
    Status: toExport.structureStatus,
    'Type de liaison': relation.relationTag,
    'Date de début': relation.startDate,
    'Date de fin': relation.endDate,
    'Date de fin prévue': relation.endDatePrevisional,
    'Texte officiel de début de liaison': relation.startDateOfficialText?.title,
    'Lien du texte officiel de début de liaison': relation.startDateOfficialText?.pageUrl,
    'Texte officiel de fin de liaison': relation.endDateOfficialText?.title,
    'Lien du texte officiel de fin de liaison': relation.endDateOfficialText?.pageUrl,
    'ID Paysage': toExport.id,
    'Nom officiel': toExport?.currentName?.officialName,
    'Nom court': toExport?.currentName?.shortName,
    Géolocalisation: toExport.currentLocalisation?.geometry?.coordinates?.toString(),
    Adresse: toExport.currentLocalisation?.address,
    Téléphone: toExport.currentLocalisation?.telephone,
    'Code commune': toExport.currentLocalisation?.cityId,
    Commune: toExport.currentLocalisation?.city,
    Pays: toExport.currentLocalisation?.country,
    wikidata: toExport.identifiers?.find((i) => (i.type === 'Wikidata'))?.value,
    idref: toExport.identifiers?.find((i) => (i.type === 'idRef'))?.value,
    uai: toExport.identifiers?.find((i) => (i.type === 'UAI'))?.value,
    siret: toExport.identifiers?.find((i) => (i.type === 'Siret'))?.value,
    grid: toExport.identifiers?.find((i) => (i.type === 'GRID'))?.value,
    ror: toExport.identifiers?.find((i) => (i.type === 'ROR'))?.value,
    Type: toExport.collection,
    Acronyme: toExport?.currentName?.acronymFr,
    Catégorie: toExport.category?.usualNameFr,
    Catégories: toExport.categories?.map((c) => c.usualNameFr).join('|'),
    'Catégorie juridique': toExport.legalcategory?.longNameFr,
  };
}

const inverseMapping = {
  'categorie-parent': null,
  gouvernance: null,
  laureat: null,
  'personne-categorie': null,
  'personne-terme': null,
  'prix-categorie': null,
  'prix-terme': null,
  'prix-porteur': null,
  'projet-contact': null,
  'projet-categorie': null,
  'projet-participation': null,
  'projet-terme': null,
  'structure-categorie': createCsvStructureRowFromRelation,
  'structure-categorie-juridique': createCsvStructureRowFromRelation,
  'structure-interne': createCsvStructureRowFromRelation,
  'structure-predecesseur': createCsvStructureRowFromRelation,
  'referent-mesr': null,
  'structure-terme': createCsvStructureRowFromRelation,
  'structure-tutelle': null,
  'terme-categorie': null,
  'terme-parent': null,
};
const regularMapping = {
  'categorie-parent': null,
  gouvernance: null,
  laureat: null,
  'personne-categorie': null,
  'personne-terme': null,
  'prix-categorie': null,
  'prix-terme': null,
  'prix-porteur': null,
  'projet-contact': null,
  'projet-categorie': null,
  'projet-participation': null,
  'projet-terme': null,
  'structure-categorie': null,
  'structure-categorie-juridique': null,
  'structure-interne': createCsvStructureRowFromRelation,
  'structure-predecesseur': createCsvStructureRowFromRelation,
  'referent-mesr': null,
  'structure-terme': null,
  'structure-tutelle': createCsvStructureRowFromRelation,
  'terme-categorie': null,
  'terme-parent': null,
  structures: createCsvStructureRowFromRelation,
};

export function exportToCsv(data, filename, tag, inverse = false) {
  const func = inverse ? inverseMapping[tag] : regularMapping[tag];
  const exportList = data?.map((item) => func(item, inverse));
  const csv = createCsvFile(exportList);
  return downloadCsvFile(csv, filename);
}
export function hasExport(tag, inverse = false) {
  return !!(inverse ? inverseMapping[tag] : regularMapping[tag]);
}
