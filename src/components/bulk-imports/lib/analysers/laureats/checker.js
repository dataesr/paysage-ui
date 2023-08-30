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

export default async function checker(docs, index) {
  try {
    const doc = docs[index];
    const prizeCheck = await prizeChecker(doc?.resourceId);
    const personCheck = await personChecker(doc?.relatedObjectId);

    const warning = [...prizeCheck, ...personCheck];
    const error = [];
    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
