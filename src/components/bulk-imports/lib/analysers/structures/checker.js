import api from '../../../../../utils/api';
import { regexpValidateIdentifiers } from '../../../../../utils/regexpForIdentifiers';
import { normalize } from '../../../../../utils/strings';

async function duplicateIdChecker(keyName, keyValue) {
  if (!keyValue || !keyName) return [];
  const { data } = await api.get(`/autocomplete?types=structures&query=${keyValue}`);
  const duplicate = data?.data.find((el) => el?.identifiers.includes(keyValue));
  if (duplicate) {
    return [{
      message: `L'id ${keyName} (${keyValue}) existe déjà sur cette structure : ${duplicate.name}`,
      href: `/structures/${duplicate.id}`,
    }];
  }
  return [];
}

async function idFormatChecker(keyName, keyValue) {
  if (!keyName) return [];
  const [regexp, errorMessage] = regexpValidateIdentifiers(keyName);
  if (!regexp) {
    return [];
  }
  if ((keyName && keyValue) && !regexp.test(keyValue)) {
    return [{
      message: errorMessage,
    }];
  }
  return [];
}

function extractNamesFromSearch(names) {
  return names.reduce((acc, current) => {
    const { article, createdBy, createdAt, startDate, endDate, id, otherNames, ...rest } = current;
    const others = otherNames || [];
    const allNormalizedNames = [...Object.values(rest), ...others].filter((el) => el).map((el) => normalize(el));
    const allNames = [...new Set(allNormalizedNames)];
    return [...acc, ...allNames];
  }, []);
}

async function nameChecker({ usualName }) {
  if (!usualName) return [];

  const encodedUsualName = encodeURIComponent(usualName);
  const { data } = await api.get(`/autocomplete?types=structures&query=${encodedUsualName}`);

  const duplicate = data?.data.find((el) => {
    if (!el.names) return false;
    const names = extractNamesFromSearch(el.names);
    return names.includes(normalize(usualName));
  });

  if (duplicate) {
    return [{
      message: `Le nom ${usualName} est déjà utilisé pour une structure (${duplicate.id})`,
      href: `/structures/${duplicate.id}`,
    }];
  }

  return [];
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

async function categoriesChecker({ categories }) {
  if (!categories || categories.length === 0) return [{ message: 'Vous devez renseigner au moins une catégorie' }];
  const categoriesWarning = [];
  const wrongFormattedCategories = categories.filter((category) => category?.length !== 5);
  if (wrongFormattedCategories.length > 0) {
    const wrongFormattedCategoryLabels = wrongFormattedCategories.join('; ');
    categoriesWarning.push({ message: `Les catégories suivantes ne sont pas correctement renseignées : ${wrongFormattedCategoryLabels}` });
    return categoriesWarning;
  }
  if (categories) {
    const requests = categories.map(async (category) => api.get(`/autocomplete?types=categories&query=${category}`));
    const apiData = await Promise.all(requests);
    const apiCategories = apiData?.map((el) => el.data.data?.[0]?.id);
    categories.forEach((category) => {
      if (!apiCategories.includes(category)) {
        categoriesWarning.push({ message: `La catégorie ${category} n'existe pas` });
      }
    });
  }
  return categoriesWarning;
}

async function parentChecker({ parentId }) {
  const parentWarning = [];
  if (!parentId) { return []; }
  if (parentId?.length !== 5) {
    parentWarning.push({ message: `Le parent n'est pas correctement renseigné : ${parentId}` });
    return parentWarning;
  }
  if (parentId) {
    const requests = [api.get(`/autocomplete?types=structure&query=${parentId}`)];
    const apiData = await Promise.all(requests);
    const apiCategories = apiData?.map((el) => el.data.data?.[0]?.id);
    if (!apiCategories) {
      parentWarning.push({ message: `La structure parente ${parentId} n'existe pas` });
    }
  }
  return parentWarning;
}

async function legalCategoriesChecker({ legalCategory }) {
  const legalCategoriesWarning = [];
  if (legalCategory) {
    const response = await api.get(`/autocomplete?types=legalcategories&query=${legalCategory}`);
    const apiCategory = response.data.data?.[0]?.id;
    if (!apiCategory) {
      legalCategoriesWarning.push({ message: `La catégorie juridique ${legalCategory} n'existe pas` });
    }
  }
  return legalCategoriesWarning;
}

function requiredChecker({ usualName, country, iso3, structureStatus, categories, legalCategory }, index) {
  const errors = [];
  if (!usualName) errors.push({ message: 'Le nom usuel est obligatoire' });
  if (!structureStatus) errors.push({ message: "Le status ['O', 'F', 'P'] est obligatoire" });
  if (categories?.length === 0) errors.push({ message: 'Vous devez renseigner au moins une catégorie' });
  if (!legalCategory) errors.push({ message: 'Vous devez renseigner la catégorie juridique' });
  if (!iso3) errors.push({ message: 'Le code iso3 est obligatoire' });
  if (!country) errors.push({ message: 'Le pays est obligatoire' });
  if (index > 199) errors.push({ message: 'Votre fichier est trop long. Ne depassez pas les 200 lignes' });

  return errors;
}

function rowsChecker(rows, index) {
  const warnings = [];
  const rowsWithoutIndex = rows.filter((r, i) => i !== index);

  const { usualName } = rows[index];

  const duplicateNames = rowsWithoutIndex
    .map((row) => row.usualName)
    .filter((name) => name === usualName);

  if (duplicateNames.length > 0) {
    warnings.push({
      message: `Le nom ${usualName} que vous souhaitez ajouter existe déjà ${duplicateNames.length} fois dans votre fichier d'import.`,
    });
  }
  return warnings;
}

function checkDuplicateIdentifiers(rows, index) {
  const warnings = [];
  const rowsWithoutIndex = rows.filter((r, i) => i !== index);
  const identifiers = ['idref', 'wikidata', 'ror', 'uai', 'siret', 'ed'];
  identifiers.forEach((identifier) => {
    const { [identifier]: currentIdentifierValue } = rows[index];
    if (currentIdentifierValue === null || currentIdentifierValue === undefined) {
      return;
    }

    const duplicateIdentifiers = rowsWithoutIndex
      .map((row) => row[identifier])
      .filter((value) => value === currentIdentifierValue);

    if (duplicateIdentifiers.length > 0) {
      warnings.push({
        message: `L'identifiant ${identifier.toUpperCase()} ${currentIdentifierValue} que vous souhaitez ajouter existe déjà ${duplicateIdentifiers.length} fois dans votre fichier d'import.`,
      });
    }
  });
  return warnings;
}

export default async function checker(docs, index) {
  try {
    const doc = docs[index];
    const categoriesErrors = await categoriesChecker(doc);
    const parentErrors = await parentChecker(doc);
    const nameDuplicateWarnings = await nameChecker(doc);
    const requiredErrors = requiredChecker(doc, index);
    const edDuplicate = await duplicateIdChecker('ed', doc.ed);
    const idrefDuplicate = await duplicateIdChecker('idref', doc.idref);
    const siretDuplicate = await duplicateIdChecker('siret', doc.siret);
    const rnsrDuplicate = await duplicateIdChecker('rnsr', doc.rnsr);
    const rorDuplicate = await duplicateIdChecker('ror', doc.ror);
    const uaiDuplicate = await duplicateIdChecker('uai', doc.uai);
    const cruchbaseDuplicate = await duplicateIdChecker('cruchbase', doc.cruchbase);
    const dealroomDuplicate = await duplicateIdChecker('dealroom', doc.dealroom);
    const wikidataDuplicate = await duplicateIdChecker('wikidata', doc.wikidata);
    const edFormat = await idFormatChecker('ed', doc.ed);
    const identifiersDuplicateInFile = await checkDuplicateIdentifiers(docs, index);
    const idrefFormat = await idFormatChecker('idref', doc.idref);
    const siretFormat = await idFormatChecker('siret', doc.siret);
    const rnsrFormat = await idFormatChecker('rnsr', doc.rnsr);
    const rorFormat = await idFormatChecker('ror', doc.ror);
    const uaiFormat = await idFormatChecker('uai', doc.uai);
    const wikidataFormat = await idFormatChecker('wikidata', doc.wikidata);
    const legalCategoryCheck = await legalCategoriesChecker(doc);
    const websiteChecked = await websiteChecker(doc);
    const duplicateChecker = await rowsChecker(docs, index);
    const warning = [
      ...cruchbaseDuplicate, ...dealroomDuplicate,
      ...duplicateChecker, ...edDuplicate,
      ...idrefDuplicate, ...identifiersDuplicateInFile, ...nameDuplicateWarnings, ...rorDuplicate,
      ...rnsrDuplicate, ...siretDuplicate, ...uaiDuplicate, ...websiteChecked, ...wikidataDuplicate,
    ];
    const error = [...requiredErrors, ...parentErrors,
      ...legalCategoryCheck, ...categoriesErrors, ...edFormat, ...idrefFormat, ...siretFormat, ...rnsrFormat, ...rorFormat, ...uaiFormat, ...wikidataFormat];
    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
