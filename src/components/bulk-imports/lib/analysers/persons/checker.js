import api from '../../../../../utils/api';
import { regexpValidateIdentifiers } from '../../../../../utils/regexpForIdentifiers';
import { normalize } from '../../../../../utils/strings';

async function nameChecker({ firstName, lastName }) {
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  if (!fullName) return [];
  const { data } = await api.get(`/autocomplete?types=persons&query=${fullName}`);
  const duplicate = data?.data.find((el) => normalize(el.name.replace('\t', '').trim()) === normalize(fullName));
  if (duplicate) {
    return [{
      message: `Le nom ${fullName} existe déjà dans la base de donnée`,
      href: `/persons/${duplicate.id}`,
    }];
  }
  return [];
}

function requiredChecker({ firstName, lastName, gender }) {
  const errors = [];
  if (!lastName) errors.push({ message: 'Le nom est obligatoire' });
  if (!firstName) errors.push({ message: 'Le prénom est obligatoire' });
  if (!gender) errors.push({ message: 'Le genre de la personne est obligatoire' });
  return errors;
}

function genderChecker({ gender }) {
  if (gender && gender !== 'Homme' && gender !== 'Femme' && gender !== 'Autre') {
    return [{ message: `Le genre "${gender}" n'existe pas dans l'API` }];
  }
  return [];
}

function duplicateInImportFile(docs) {
  const allValues = {};
  const errors = [];

  for (let i = 0; i < docs.length; i += 1) {
    const el = docs[i];
    const entries = Object.entries(el);
    for (let j = 0; j < entries.length; j += 1) {
      const [key, value] = entries[j];
      if (key !== 'firstName' && key !== 'gender' && key !== 'activity' && value && allValues[key] && allValues[key].includes(value)) {
        errors.push({ message: `La valeur "${value}" pour la clé "${key}" existe déjà dans votre fichier d'import` });
      } else {
        allValues[key] = allValues[key] || [];
        allValues[key].push(value);
      }
    }
  }
  return errors;
}

function websiteChecker({ websiteFr, websiteEn }) {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  if (websiteFr && !urlRegex.test(websiteFr)) {
    return [{ message: `L'URL ${websiteFr} n'est pas valide` }];
  }
  if (websiteEn && !urlRegex.test(websiteEn)) {
    return [{ message: `L'URL ${websiteEn} n'est pas valide` }];
  }
  return [];
}

async function idFormatChecker(keyName, keyValue) {
  if (!keyValue) return [];
  const [regexp, errorMessage] = regexpValidateIdentifiers(keyName);
  if (!regexp) {
    return [];
  }
  if (!regexp.test(keyValue)) {
    return [{
      message: errorMessage,
    }];
  }
  return [];
}

async function duplicateIdChecker(keyName, keyValue) {
  if (!keyValue && !keyName) return [];
  const { data } = await api.get(`/autocomplete?types=persons&query=${keyValue}`);
  const duplicate = data?.data.find((el) => el?.identifiers.includes(keyValue));
  if (duplicate) {
    return [{
      message: `L'id ${keyName} (${keyValue}) existe déjà sur cette personne : ${duplicate.name}`,
      href: `/personnes/${duplicate.id}`,
    }];
  }
  return [];
}

function rowsChecker(rows, index) {
  const warnings = [];
  const rowsWithoutIndex = rows.filter((r, i) => i !== index);

  const { firstName } = rows[index];

  const duplicateFirstNames = rowsWithoutIndex
    .map((row) => row.firstName)
    .filter((name) => name === firstName);

  if (duplicateFirstNames.length > 0) {
    warnings.push({
      message: `Le nom ${firstName} que vous souhaitez ajouter existe déjà ${duplicateFirstNames.length} fois dans votre fichier d'import.`,
    });
  }
  const { lastName } = rows[index];

  const duplicateLastNames = rowsWithoutIndex
    .map((row) => row.lastName)
    .filter((name) => name === lastName);

  if (duplicateLastNames.length > 0) {
    warnings.push({
      message: `Le nom ${lastName} que vous souhaitez ajouter existe déjà ${duplicateLastNames.length} fois dans votre fichier d'import.`,
    });
  }

  const checkDuplicates = (property, propertyName) => {
    const duplicateValues = rowsWithoutIndex
      .map((row) => row[property])
      .filter((value) => value)
      .filter((value, i, arr) => arr.indexOf(value) !== i);

    if (duplicateValues.length > 0) {
      warnings.push({
        message: `L'identifiant ${propertyName} ${rows[index][property]} que vous souhaitez ajouter existe déjà ${duplicateValues.length} fois dans votre fichier d'import.`,
      });
    }
  };

  checkDuplicates('orcid', 'ORCID');
  checkDuplicates('idref', 'IDREF');
  checkDuplicates('wikidata', 'Wikidata');
  checkDuplicates('researchgate', 'ResearchGate');

  return warnings;
}

export default async function checker(docs, index) {
  try {
    const doc = docs[index];
    const isDuplicatedInImportFile = await duplicateInImportFile(docs);
    const nameDuplicateWarnings = await nameChecker(doc);
    const orcidDuplicate = await duplicateIdChecker('orcid', doc.orcid);
    const wikidataDuplicate = await duplicateIdChecker('wikidata', doc.wikidata);
    const idrefDuplicate = await duplicateIdChecker('idref', doc.idref);
    const orcidFormat = await idFormatChecker('orcid', doc.orcid);
    const wikidataFormat = await idFormatChecker('wikidata', doc.wikidata);
    const idrefFormat = await idFormatChecker('idref', doc.idref);
    const websiteChecked = await websiteChecker(doc);
    const genderChecked = await genderChecker(doc);
    const requiredErrors = requiredChecker(doc);
    const duplicateChecker = await rowsChecker(docs, index);
    const warning = [...nameDuplicateWarnings, ...duplicateChecker, ...isDuplicatedInImportFile, ...wikidataFormat, ...orcidDuplicate, ...wikidataDuplicate, ...idrefDuplicate, ...websiteChecked];
    const error = [...requiredErrors, ...genderChecked, ...orcidFormat, ...wikidataFormat, ...idrefFormat];
    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
