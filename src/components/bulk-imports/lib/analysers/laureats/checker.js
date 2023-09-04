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

async function structureChecker(otherAssociatedObjectIds) {
  const structureWarning = [];
  if (otherAssociatedObjectIds) {
    const response = await api.get(`/autocomplete?types=structure&query=${otherAssociatedObjectIds}`);
    const apiCategory = response.data.data?.[0]?.id;
    if (!apiCategory) {
      structureWarning.push({ message: `Le prix ${otherAssociatedObjectIds} n'existe pas` });
    }
  }
  return structureWarning;
}

export default async function checker(docs) {
  try {
    const prizeCheck = await prizeChecker(docs?.resourceId);
    const personCheck = await personChecker(docs?.relatedObjectId);
    const structureCheck = await structureChecker(docs?.otherAssociatedObjectIds);
    const warning = [];
    const error = [...prizeCheck, ...personCheck, ...structureCheck];
    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
