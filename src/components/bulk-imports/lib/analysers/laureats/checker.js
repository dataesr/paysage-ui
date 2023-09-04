import api from '../../../../../utils/api';

function requiredChecker({ resourceId, relatedObjectId }) {
  const errors = [];
  if (!resourceId) errors.push({ message: "L'id du prix es obligatoire" });
  if (!relatedObjectId) errors.push({ message: "L'id de la personne à lier est obligatoire" });
  return errors;
}

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
    const apiPerson = response.data.data?.[0]?.id;
    if (!apiPerson) {
      personWarning.push({ message: `La personne à l'id : ${personId} n'existe pas` });
    }
  }
  return personWarning;
}

async function structureChecker(otherAssociatedObjectIds) {
  const structureWarnings = [];

  if (otherAssociatedObjectIds && Array.isArray(otherAssociatedObjectIds)) {
    const promises = otherAssociatedObjectIds.map(async (id) => {
      const encodedId = encodeURIComponent(id);
      const response = await api.get(`/autocomplete?types=structure&query=${encodedId}`);
      const apiStructure = response.data.data?.[0]?.id;

      if (!apiStructure) {
        structureWarnings.push({ message: `La structure : ${id} n'existe pas` });
      }
    });
    await Promise.all(promises);
  }
  return structureWarnings;
}

export default async function checker(docs) {
  try {
    const prizeCheck = await prizeChecker(docs?.resourceId);
    const personCheck = await personChecker(docs?.relatedObjectId);
    const structureCheck = await structureChecker(docs?.otherAssociatedObjectIds);
    const requiredErrors = requiredChecker(docs);
    const warning = [];
    const error = [...prizeCheck, ...structureCheck, ...requiredErrors, ...personCheck];
    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
