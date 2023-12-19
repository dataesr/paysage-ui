import api from '../../../../../utils/api';
import { regexpValidateIdentifiers } from '../../../../../utils/regexpForIdentifiers';
import { PERSONS_TYPES_MAPPING } from './persons-types-mapping';

function requiredChecker({ personId, value, type, active }, index) {
  const errors = [];
  if (!personId) errors.push({ message: "L'id de la personne est obligatoire" });
  if (!type) errors.push({ message: `Il manque le type d'identifiant de ${personId}` });
  if (!value) errors.push({ message: `Il manque une valeur pour l'identifant de ${personId}` });
  if (active !== false && active !== true) {
    errors.push({ message: "La valeur de 'actif' doit être O pour actif, ou N pour inactif" });
  }

  if (index > 199) errors.push({ message: 'Votre fichier est trop long. Ne depassez pas les 200 lignes' });

  return errors;
}

async function typeChecker({ type }) {
  if (!type) return [];
  const errors = [];
  if (!Object.keys(PERSONS_TYPES_MAPPING).includes(type)) {
    errors.push({ message: `L'identifiant "${type}" n'existe pas, vérifiez la modale` });
  }
  return errors;
}

async function idFormatChecker({ type, value }) {
  if (!type || !value) return [];

  const [regexp, errorMessage] = regexpValidateIdentifiers(type);
  if (!regexp) {
    return [];
  }
  if (!regexp.test(value)) {
    return [{
      message: errorMessage,
    }];
  }

  return [];
}

async function duplicateIdChecker({ type, value }) {
  if (!type || !value) return [];
  const { data } = await api.get(`/autocomplete?types=persons&query=${value}`);
  const duplicate = data?.data.find((el) => el?.identifiers.includes(value));
  if (duplicate) {
    return [{
      message: `L'id ${type} (${value}) existe déjà sur cette structure : ${duplicate.name}`,
      href: `/personnes/${duplicate.id}`,
    }];
  }
  return [];
}

async function personChecker({ personId }) {
  const personWarning = [];
  if (personId) {
    const response = await api.get(`/autocomplete?types=persons&query=${personId}`);
    const apiCategory = response.data.data?.[0]?.id;
    if (!apiCategory) {
      personWarning.push({ message: `La structure ${personId} n'existe pas` });
    }
  }
  return personWarning;
}

export default async function checker(docs, index) {
  try {
    const requiredErrors = requiredChecker(docs, index);
    const idFormat = await idFormatChecker(docs);
    const typeToChecker = await typeChecker(docs);

    if (idFormat.length > 0) {
      return { warning: [], error: idFormat, status: 'error' };
    }

    const duplicateChecker = await duplicateIdChecker(docs);
    const personsExistingChecker = await personChecker(docs);

    const warning = [...duplicateChecker];
    const error = [...requiredErrors, ...personsExistingChecker, ...typeToChecker];

    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
