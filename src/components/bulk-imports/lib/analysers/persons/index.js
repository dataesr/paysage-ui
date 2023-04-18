import { parseTSV, zip } from '../utils';
import checker from './checker';
import headersMapping from './headers-mapping';

const genderMapping = {
  F: 'Femme',
  H: 'Homme',
  A: 'Autre',
};

const publicSearchMapping = {
  O: 'Oui',
  N: 'Non',
};

const personParsingFunctions = {
  otherNames: (str) => { str?.split(';'); },
  personGender: (str) => (['F', 'H', 'A'].includes(str) ? genderMapping[str] : null),
  categories: (str) => (str ? str.split(';').filter((category) => category.trim()) : []),
  publicSearchPerson: (str) => (['O', 'N'].includes(str) ? publicSearchMapping[str] : null),
};

export default async function parsePersonTSV(inputString) {
  const { headers, rows } = parseTSV(inputString);
  const orderedApiHeaders = headers.map((header) => headersMapping[header]);
  const bodyList = rows.map((row) => zip(orderedApiHeaders, row, personParsingFunctions));
  const result = await Promise.all(bodyList.map(async (body, index) => {
    const { warning, error, status } = await checker(bodyList, index);
    const displayName = `${body.firstName || ''} ${body.lastName || ''}`.trim();
    return { index: index + 2, body, displayName, warning, error, status };
  }));
  return result;
}
