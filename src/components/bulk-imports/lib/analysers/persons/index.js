import { parseTSV, zip } from '../utils';
import checker from './checker';
import { personsHeadersMapping } from './headers-mapping';

const genderMapping = {
  F: 'Femme',
  H: 'Homme',
  A: 'Autre',
};

const personParsingFunctions = {
  otherNames: (str) => { str?.split(';'); },
  gender: (str) => (['F', 'H', 'A'].includes(str) ? genderMapping[str] : null),
};

export default async function parsePersonTSV(inputString) {
  const { headers, rows } = parseTSV(inputString);
  const type = 'persons';
  const orderedApiHeaders = headers.map((header) => personsHeadersMapping[header]);
  const bodyList = rows.map((row) => zip(orderedApiHeaders, row, personParsingFunctions));
  const result = await Promise.all(bodyList.map(async (body, index) => {
    const { warning, error, status } = await checker(bodyList, index);
    const displayName = `${body.firstName || ''} ${body.lastName || ''}`.trim();
    return { index: index + 2, body, displayName, type, warning, error, status };
  }));
  return result;
}
