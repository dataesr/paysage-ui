import api from '../../../../../utils/api';
import { regexpValidateIdentifiers } from '../../../../../utils/regexpForIdentifiers';
import { TYPES_MAPPING } from './types-mappings';

function requiredChecker({ structureId, value, type, active }, index) {
  const errors = [];
  if (!structureId) errors.push({ message: "L'id de la structure est obligatoire" });
  if (!type) errors.push({ message: `Il manque le type d'identifiant de ${structureId}` });
  if (!value) errors.push({ message: `Il manque une valeur pour l'identifant de ${structureId}` });
  if (index > 199) errors.push({ message: 'Votre fichier est trop long. Ne depassez pas les 200 lignes' });
  if (active !== false && active !== true) {
    errors.push({ message: "La valeur de 'actif' doit être O pour actif, ou N pour inactif" });
  }

  return errors;
}

async function typeChecker({ type }) {
  if (!type) return [];
  const errors = [];

  if (!Object.keys(TYPES_MAPPING).includes(type)) {
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
  const { data } = await api.get(`/autocomplete?types=structures&query=${value}`);
  const duplicate = data?.data.find((el) => el?.identifiers.includes(value));
  if (duplicate) {
    return [{
      message: `L'id ${type} (${value}) existe déjà sur cette structure : ${duplicate.name}`,
      href: `/structures/${duplicate.id}`,
    }];
  }
  return [];
}

async function structureChecker({ structureId }) {
  const structureWarning = [];
  if (structureId) {
    const response = await api.get(`/autocomplete?types=structures&query=${structureId}`);
    const apiCategory = response.data.data?.[0]?.id;
    if (!apiCategory) {
      structureWarning.push({ message: `La structure ${structureId} n'existe pas` });
    }
  }
  return structureWarning;
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
    const structureExistingChecker = await structureChecker(docs);

    const warning = [...duplicateChecker];
    const error = [...requiredErrors, ...structureExistingChecker, ...typeToChecker];

    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
