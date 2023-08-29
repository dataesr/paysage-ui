import api from '../../../../../utils/api';
import { regexpValidateIdentifiers } from '../../../../../utils/regexpForIdentifiers';
import { normalize } from '../../../../../utils/strings';

// async function idChecker(resourceId, relatedObjectId,associatedQuery) {
// if (!resourceId) {
//     return [{
//       message: `Le nom ${usualName} est déjà utilisé pour une structure`,
//       href: `/structures/${duplicate.id}`,
//     }];
//   }}

export default async function checker(docs, index) {
  try {
    const doc = docs[index];
    const warning = [];
    const error = [];
    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
