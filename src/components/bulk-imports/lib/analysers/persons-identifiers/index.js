import { parseTSV, zip } from '../utils';
import checker from './checker';
import { personsIdentifiersHeadersMapping } from './headers-mapping';

const mandatStatusMapping = {
  O: true,
  N: false,
};

const personIdentifierParsingFunctions = {
  active: (str) => (['O', 'N'].includes(str) ? mandatStatusMapping[str] : null),
};

export default async function parsePersonsIdentifiersTSV(inputString) {
  const { headers, rows } = parseTSV(inputString);
  const type = 'personnes (identifiants)';
  const orderedApiHeaders = headers.map((header) => personsIdentifiersHeadersMapping[header]);

  const result = await Promise.all(rows.map(async (row, index) => {
    const body = zip(orderedApiHeaders, row, personIdentifierParsingFunctions);
    const { warning, error, status } = await checker(body, index);
    const formattedBody = {
      personId: body.personId,
      type: body.type,
      value: body.value,
      startDate: body.startDate,
      endDate: body.endDate,
      active: body.active,
    };
    return { index: index + 2, body: formattedBody, type, warning, error, status };
  }));
  return result;
}
