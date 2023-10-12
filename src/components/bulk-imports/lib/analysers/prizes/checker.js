import api from '../../../../../utils/api';

async function prizeChecker(priceId) {
  const priceWarning = [];
  if (priceId) {
    const response = await api.get(`/autocomplete?types=prize&query=${priceId}`);
    const apiCategory = response.data.data?.[0]?.id;
    if (!apiCategory) {
      priceWarning.push({ message: `Le prix ${priceId} n'existe pas` });
    }
  }
  return priceWarning;
}

async function personChecker(personId) {
  const personWarning = [];
  if (personId) {
    const response = await api.get(`/autocomplete?types=person&query=${personId}`);
    const apiCategory = response.data.data?.[0]?.id;
    if (!apiCategory) {
      personWarning.push({ message: `Le prix ${personId} n'existe pas` });
    }
  }
  return personWarning;
}

function requiredChecker({ nameFr }) {
  const errors = [];
  if (!nameFr) errors.push({ message: 'Le nom du prix est obligatoire' });
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

export default async function checker(docs, index) {
  try {
    const doc = docs[index];
    const prizeCheck = await prizeChecker(doc?.resourceId);
    const personCheck = await personChecker(doc?.relatedObjectId);
    const websiteChecked = await websiteChecker(doc);
    const requiredErrors = requiredChecker(doc);

    const warning = [...websiteChecked];
    const error = [...prizeCheck, ...personCheck, ...requiredErrors];
    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
