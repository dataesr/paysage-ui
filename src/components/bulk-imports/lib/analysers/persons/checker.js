import api from '../../../../../utils/api';
import { normalize } from '../../../../../utils/strings';

async function nameChecker({ firstName, lastName }) {
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  if (!fullName) return [];
  const { data } = await api.get(`/autocomplete?types=persons&query=${fullName}`);
  const duplicate = data?.data.find((el) => normalize(el.name.replace('\t', '').trim()) === normalize(fullName));
  if (duplicate) {
    return [{
      message: `Le nom ${fullName} existe déjà`,
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

async function idChecker(keyName, keyValue) {
  if (!keyValue) return [];
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

export default async function checker(docs, index) {
  const doc = docs[index];
  const nameDuplicateWarnings = await nameChecker(doc);
  // const idDuplicateWarnings = await idChecker(['orcid', 'wikidata', 'idref'], doc);
  const orcidDuplicate = await idChecker('orcid', doc.orcid);
  const wikidataDuplicate = await idChecker('wikidata', doc.wikidata);
  const idrefDuplicate = await idChecker('idref', doc.idref);
  const websiteChecked = await websiteChecker(doc);
  const categoriesChecked = await categoriesChecker(doc);
  const requiredErrors = requiredChecker(doc);
  const warning = [...nameDuplicateWarnings, ...orcidDuplicate, ...wikidataDuplicate, ...idrefDuplicate, ...websiteChecked];
  const error = [...requiredErrors, ...categoriesChecked];
  let status = 'success';
  if (warning.length) { status = 'warning'; }
  if (error.length) { status = 'error'; }
  return { warning, error, status };
}
