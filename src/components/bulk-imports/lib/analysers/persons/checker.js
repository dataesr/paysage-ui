import api from '../../../../../utils/api';
import { normalize } from '../../../../../utils/strings';

async function nameChecker({ firstName, lastName }) {
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  if (!fullName) return [];
  const { data } = await api.get(`/autocomplete?types=persons&query=${fullName}`);
  const duplicate = data?.data.find((el) => normalize(el.name) === normalize(fullName));
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
  if (!firstName) errors.push({ message: 'Le nom est obligatoire' });
  if (!gender) errors.push({ message: 'Le genre de la personne est obligatoire' });
  return errors;
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

export default async function checker(docs, index) {
  const doc = docs[index];
  const nameDuplicateWarnings = await nameChecker(doc);
  // const idDuplicateWarnings = await idChecker(['orcid', 'wikidata', 'idref'], doc);
  const orcidDuplicate = await idChecker('orcid', doc.orcid);
  const wikidataDuplicate = await idChecker('wikidata', doc.wikidata);
  const idrefDuplicate = await idChecker('idref', doc.idref);
  const requiredErrors = requiredChecker(doc);
  const warning = [...nameDuplicateWarnings, ...orcidDuplicate, ...wikidataDuplicate, ...idrefDuplicate];
  const error = [...requiredErrors];
  let status = 'success';
  if (warning.length) { status = 'warning'; }
  if (error.length) { status = 'error'; }
  return { warning, error, status };
}
