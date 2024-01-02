import { parseTSV, zip } from '../utils';
import checker from './checker';
import { structuresIdentifiersHeadersMapping } from './headers-mapping';

const mandatStatusMapping = {
  O: true,
  N: false,
};

const structureIdentifierParsingFunctions = {
  active: (str) => (['O', 'N'].includes(str) ? mandatStatusMapping[str] : null),
};

export default async function parseStructureIdentifiersTSV(inputString) {
  const { headers, rows } = parseTSV(inputString);
  const type = 'structures (identifiants)';
  const orderedApiHeaders = headers.map((header) => structuresIdentifiersHeadersMapping[header]);

  const result = await Promise.all(rows.map(async (row, index) => {
    const body = zip(orderedApiHeaders, row, structureIdentifierParsingFunctions);
    const { warning, error, status } = await checker(body, index);
    const formattedBody = {
      structureId: body.structureId,
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
