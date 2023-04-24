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
  const { data } = await api.get(`/autocomplete?types=structures&query=${usualName}`);
  const duplicate = data?.data.find((el) => {
    if (!el.names) return false;
    const names = extractNamesFromSearch(el.names);
    return names.includes(normalize(usualName));
  });
  if (duplicate) {
    return [{
      message: `Le nom ${usualName} est déja utilisé pour une structure`,
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

function requiredChecker({ usualName, country, iso3, structureStatus, categories, legalCategory }) {
  const errors = [];
  if (!usualName) errors.push({ message: 'Le nom usuel est obligatoire' });
  if (!structureStatus) errors.push({ message: "Le status ['O', 'F', 'P'] est obligatoire" });
  if (categories.length === 0) errors.push({ message: 'Vous devez renseigner au moins une catégorie' });
  if (!legalCategory) errors.push({ message: 'Vous devez renseigner la catégorie juridique' });
  if (!iso3) errors.push({ message: 'Le code iso3 est obligatoire' });
  if (!country) errors.push({ message: 'Le pays est obligatoire' });
  return errors;
}

function rowsChecker(rows, index) {
  const warnings = [];
  const rowsWithoutIndex = rows.filter((r, i) => (i !== index));

  const isDuplicateUsualName = rowsWithoutIndex
    .map((row) => row.usualName)
    .filter((name) => name)
    .includes(rows[index].usualName);
  if (isDuplicateUsualName) {
    warnings.push({ message: `Le nom ${rows[index].usualName} que vous souhaitez ajouter existe déjà dans votre fichier d'import.` });
  }
  const isDuplicateSiret = rowsWithoutIndex
    .map((row) => row.siret)
    .filter((id) => id)
    .includes(rows[index].siret);
  if (isDuplicateSiret) {
    warnings.push({ message: `Le SIRET ${rows[index].siret} que vous souhaitez ajouter existe déjà dans votre fichier d"import.'` });
  }

  const isDuplicateIdref = rowsWithoutIndex
    .map((row) => row.idref)
    .filter((id) => id)
    .includes(rows[index].idref);
  if (isDuplicateIdref) {
    warnings.push({ message: `L'identifiant idref ${rows[index].idref} que vous souhaitez ajouter existe déjà dans votre fichier d"import.'` });
  }

  const isDuplicateEd = rowsWithoutIndex
    .map((row) => row.ed)
    .filter((id) => id)
    .includes(rows[index].ed);
  if (isDuplicateEd) {
    warnings.push({ message: `L'identifiant ed ${rows[index].ed} que vous souhaitez ajouter existe déjà dans votre fichier d"import.'` });
  }

  const isDuplicateRnsr = rowsWithoutIndex
    .map((row) => row.rnsr)
    .filter((id) => id)
    .includes(rows[index].rnsr);
  if (isDuplicateRnsr) {
    warnings.push({ message: `L'identifiant rnsr ${rows[index].rnsr} que vous souhaitez ajouter existe déjà dans votre fichier d"import.'` });
  }

  const isDuplicateRor = rowsWithoutIndex
    .map((row) => row.ror)
    .filter((id) => id)
    .includes(rows[index].ror);
  if (isDuplicateRor) {
    warnings.push({ message: `L'identifiant ror ${rows[index].ror} que vous souhaitez ajouter existe déjà dans votre fichier d"import.'` });
  }

  const isDuplicateWikidata = rowsWithoutIndex
    .map((row) => row.wikidata)
    .filter((id) => id)
    .includes(rows[index].wikidata);
  if (isDuplicateWikidata) {
    warnings.push({ message: `L'identifiant wikidata ${rows[index].wikidata} que vous souhaitez ajouter existe déjà dans votre fichier d"import.'` });
  }

  const isDuplicateUai = rowsWithoutIndex
    .map((row) => row.uai)
    .filter((id) => id)
    .includes(rows[index].uai);
  if (isDuplicateUai) {
    warnings.push({ message: `L'identifiant uai ${rows[index].uai} que vous souhaitez ajouter existe déjà dans votre fichier d"import.'` });
  }
  return warnings;
}

export default async function checker(docs, index) {
  try {
    const doc = docs[index];
    const categoriesErrors = await categoriesChecker(doc);
    const nameDuplicateWarnings = await nameChecker(doc);
    const requiredErrors = requiredChecker(doc);
    const edDuplicate = await duplicateIdChecker('ed', doc.ed);
    const idrefDuplicate = await duplicateIdChecker('idref', doc.idref);
    const siretDuplicate = await duplicateIdChecker('siret', doc.siret);
    const rnsrDuplicate = await duplicateIdChecker('rnsr', doc.rnsr);
    const rorDuplicate = await duplicateIdChecker('ror', doc.ror);
    const uaiDuplicate = await duplicateIdChecker('uai', doc.uai);
    const wikidataDuplicate = await duplicateIdChecker('wikidata', doc.wikidata);
    const edFormat = await idFormatChecker('ed', doc.ed);
    const idrefFormat = await idFormatChecker('idref', doc.idref);
    const siretFormat = await idFormatChecker('siret', doc.siret);
    const rnsrFormat = await idFormatChecker('rnsr', doc.rnsr);
    const rorFormat = await idFormatChecker('ror', doc.ror);
    const uaiFormat = await idFormatChecker('uai', doc.uai);
    const wikidataFormat = await idFormatChecker('wikidata', doc.wikidata);
    const legalCategoryCheck = await legalCategoriesChecker(doc);
    const websiteChecked = await websiteChecker(doc);
    const duplicateChecker = await rowsChecker(docs, index);
    const warning = [...idrefDuplicate, ...duplicateChecker,
      ...siretDuplicate, ...edDuplicate, ...rnsrDuplicate, ...uaiDuplicate, ...rorDuplicate, ...wikidataDuplicate, ...nameDuplicateWarnings, ...websiteChecked];
    const error = [...requiredErrors, ...legalCategoryCheck, ...categoriesErrors, ...edFormat, ...idrefFormat, ...siretFormat, ...rnsrFormat, ...rorFormat, ...uaiFormat, ...wikidataFormat];
    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
