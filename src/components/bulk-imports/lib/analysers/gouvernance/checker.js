import api from '../../../../../utils/api';

function requiredChecker({ resourceId, relationTypeId, relatedObjectId }) {
  const errors = [];
  if (!resourceId) errors.push({ message: 'Le nom du prix est obligatoire' });
  if (!relationTypeId) errors.push({ message: 'Le code de la fonction est obligatoire' });
  if (!relatedObjectId) errors.push({ message: "L'id de la personne est obligatoire" });
  return errors;
}

async function structureChecker(structureId) {
  const priceWarning = [];
  if (structureId) {
    const response = await api.get(`/autocomplete?types=prize&query=${structureId}`);
    const apiCategory = response.data.data?.[0]?.id;
    if (!apiCategory) {
      priceWarning.push({ message: `Le prix ${structureId} n'existe pas` });
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
async function relationTypeChecker(relationTypeId) {
  const personWarning = [];
  if (relationTypeId) {
    try {
      const response = await api.get(`/relation-types/${relationTypeId}`);
      if (!response.ok) {
        throw new Error(`La requête a échoué avec le code d'erreur : ${response.status}`);
      }

      if (!response.bodyUsed) {
        const responseData = await response.json();
        const apiCategory = responseData.data?.[0]?.id;

        if (!apiCategory) {
          personWarning.push({ message: `Le code de la fonction/responsabilité ${relationTypeId} n'existe pas` });
        }
      }
    } catch (error) {
      // console.log(error);
      personWarning.push({ message: 'Une erreur s\'est produite lors de la requête à l\'API' });
    }
  }
  return personWarning;
}

async function mandatePositionChecker(mandatePosition) {
  const mandatePositionWarning = [];
  const validValues = ['1', '2', '3+', ''];

  if (mandatePosition && !validValues.includes(mandatePosition)) {
    mandatePositionWarning.push({ message: 'Veuillez saisir 1, 2, 3 ou laisser vide' });
  }

  return mandatePositionWarning;
}

async function phoneNumberChecker(mandatePhonenumber) {
  const phoneNumberWarning = [];
  if (!mandatePhonenumber) {
    return [];
  }
  if (mandatePhonenumber?.length !== 10) {
    phoneNumberWarning.push({ message: "Le numéro de téléphone n'est pas valide" });
  }
  return phoneNumberWarning;
}

export default async function checker(docs, index) {
  try {
    const doc = docs[index];
    const prizeCheck = await structureChecker(doc?.resourceId);
    const personCheck = await personChecker(doc?.relatedObjectId);
    const relationTypeCheck = await relationTypeChecker(doc?.relationTypeId);
    const mandatePositionCheck = await mandatePositionChecker(doc?.mandatePosition);
    const phoneNumberCheck = await phoneNumberChecker(doc?.mandatePhonenumber);
    const requiredErrors = requiredChecker(doc);
    const warning = [...mandatePositionCheck, ...phoneNumberCheck];
    const error = [...prizeCheck, ...personCheck, ...relationTypeCheck, ...requiredErrors];
    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
