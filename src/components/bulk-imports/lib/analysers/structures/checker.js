import api from '../../../../../utils/api';
import { normalize } from '../../../../../utils/strings';

async function siretChecker({ siret }) {
  if (!siret) return [];
  const { data } = await api.get(`/autocomplete?types=structures&query=${siret}`);
  const duplicate = data?.data.find((el) => el?.identifiers.includes(siret));
  if (duplicate) {
    return [{
      message: `Le siret ${siret} existe déjà pour la structure ${duplicate.name}`,
      href: `/structures/${duplicate.id}`,
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

// function rowsChecker(docs, index) {
//   const { usualName, siret } = docs[index];
//   const duplicateSiretIndex = docs.filter((el) => el.siret === siret).length > 1;
//   return errors;
// }

export default async function checker(docs, index) {
  try {
    const doc = docs[index];
    const siretDuplicateWarnings = await siretChecker(doc);
    const nameDuplicateWarnings = await nameChecker(doc);
    const requiredErrors = requiredChecker(doc);
    const categoriesErrors = await categoriesChecker(doc);
    const websiteChecked = await websiteChecker(doc);
    const warning = [...siretDuplicateWarnings, ...nameDuplicateWarnings, ...websiteChecked];
    const error = [...requiredErrors, ...categoriesErrors];
    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
