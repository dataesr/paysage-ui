import api from '../../../../../utils/api';

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
    const response = await api.get(`https://api.paysage.staging.dataesr.ovh/relation-types/${relationTypeId}`);
    const apiCategory = response.data.data?.[0]?.id;
    if (!apiCategory) {
      personWarning.push({ message: `Le prix ${relationTypeId} n'existe pas` });
    }
  }
  return personWarning;
}

async function mandatePositionChecker(mandatePosition) {
  const mandatePositionWarning = [];
  if (mandatePosition !== 1 || mandatePosition !== 2 || mandatePosition !== 3 || mandatePosition.length !== 0) {
    mandatePositionWarning.push({ message: 'Veuillez saisir 1,2,3 ou laisse un vide' });
  }
  return mandatePositionWarning;
}

async function phoneNumberChecker(mandatePhonenumber) {
  const phoneNumberWarning = [];
  if (mandatePhonenumber.length !== 10) {
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

    const warning = [...mandatePositionCheck, ...phoneNumberCheck];
    const error = [...prizeCheck, ...personCheck, ...relationTypeCheck];
    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
