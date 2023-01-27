import * as XLSX from 'xlsx';

function createXLSXFile(exportList) {
  const ws = XLSX.utils.json_to_sheet(exportList);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'liste');
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

function createCsvStructureRowFromRelation(relation, inverse, listName) {
  const toExport = inverse ? relation.resource : relation.relatedObject;
  return {
    Libellé: toExport.displayName,
    Type: listName,
    'Status de la liaison': (relation.active === false || (relation.startDate < relation.endDate)) ? 'Terminée' : 'En cours',
    'Date de début': relation.startDate,
    'Date de fin': relation.endDate,
    'Date de fin prévue': relation.endDatePrevisional,
    'Texte officiel de début de liaison': relation.startDateOfficialText?.title,
    'Lien du texte officiel de début de liaison': relation.startDateOfficialText?.pageUrl,
    'Texte officiel de fin de liaison': relation.endDateOfficialText?.title,
    'Lien du texte officiel de fin de liaison': relation.endDateOfficialText?.pageUrl,
    'Nom officiel': toExport?.currentName?.officialName,
    'Nom court': toExport?.currentName?.shortName,
    Acronyme: toExport?.currentName?.acronymFr,
    'Catégorie juridique': toExport.legalcategory?.longNameFr,
    Catégorie: toExport.category?.usualNameFr,
    Catégories: toExport.categories?.map((c) => c.usualNameFr).join('|'),
    'Status de la structure': toExport.structureStatus,
    'Date de création': toExport?.creationDate,
    'Date de fermeture': toExport?.closureDate,
    Géolocalisation: toExport.currentLocalisation?.geometry?.coordinates?.toString(),
    Adresse: toExport.currentLocalisation?.address,
    'Code postal': toExport.currentLocalisation?.postalCode,
    Commune: toExport.currentLocalisation?.city,
    Localité: toExport.currentLocalisation?.locality,
    'Mention de distribution': toExport.currentLocalisation?.postOfficeBoxNumber,
    'Code commune': toExport.currentLocalisation?.cityId,
    Pays: toExport.currentLocalisation?.country,
    'Code Pays': toExport.currentLocalisation?.iso3,
    'Site web': (toExport?.websites?.length) && (toExport?.websites.find((w) => w.language === 'Fr') || toExport?.websites?.[0]),
    Téléphone: toExport.currentLocalisation?.telephone,
    'ID Paysage': toExport.id,
    wikidata: toExport.identifiers?.filter((i) => (i.type === 'Wikidata')).sort((a, b) => a?.startDate?.localCompare(b?.startDate)).map((i) => i.value).join('|'),
    idref: toExport.identifiers?.filter((i) => (i.type === 'idRef')).sort((a, b) => a?.startDate?.localCompare(b?.startDate)).map((i) => i.value).join('|'),
    uai: toExport.identifiers?.filter((i) => (i.type === 'UAI')).sort((a, b) => a?.startDate?.localCompare(b?.startDate)).map((i) => i.value).join('|'),
    siret: toExport.identifiers?.filter((i) => (i.type === 'Siret')).sort((a, b) => a?.startDate?.localCompare(b?.startDate)).map((i) => i.value).join('|'),
    grid: toExport.identifiers?.filter((i) => (i.type === 'GRID')).sort((a, b) => a?.startDate?.localCompare(b?.startDate)).map((i) => i.value).join('|'),
    ror: toExport.identifiers?.filter((i) => (i.type === 'ROR')).sort((a, b) => a?.startDate?.localCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant Annelis': toExport.identifiers?.filter((i) => (i.type === 'ALId')).sort((a, b) => a?.startDate?.localCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant bibliothèque ESGBU': toExport.identifiers?.filter((i) => (i.type === 'BibId')).sort((a, b) => a?.startDate?.localCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant établissement ESGBU': toExport.identifiers?.filter((i) => (i.type === 'EtId')).sort((a, b) => a?.startDate?.localCompare(b?.startDate)).map((i) => i.value).join('|'),
    ESGBU: toExport.identifiers?.filter((i) => (i.type === 'ESGBU')).sort((a, b) => a?.startDate?.localCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Identifiant Ecole doctorale': toExport.identifiers?.filter((i) => (i.type === "Numéro d'ED")).sort((a, b) => a?.startDate?.localCompare(b?.startDate)).map((i) => i.value).join('|'),
    'Email générique Direction': toExport?.emails.find((m) => m.emailTypeId === 'NVdq8NVdq8NVdq8')?.email,
    'Email générique DGS/SG': toExport?.emails.find((m) => m.emailTypeId === '4puTu4puTu4puTu')?.email,
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

export function exportToCsv(data, filename, listName, tag, inverse = false) {
  const func = inverse ? inverseMapping[tag] : regularMapping[tag];
  const exportList = data?.map((item) => func(item, inverse, listName));
  const xlsx = createXLSXFile(exportList);
  return downloadCsvFile(xlsx, filename);
}
export function hasExport(tag, inverse = false) {
  return !!(inverse ? inverseMapping[tag] : regularMapping[tag]);
}
