import { parseTSV, zip } from '../utils';
import checker from './checker';
import { gouvernanceHeadersMapping } from './headers-mapping';

const mandatStatusMapping = {
  O: true,
  N: false,
};

const mandatePositionMapping = {
  1: '1',
  2: '2',
  3: '3+',
};

const mandateTemporaryMapping = {
  O: true,
  N: false,
};

const mandateReasonMapping = {
  E: 'election',
  N: 'nomination',
};

const gouvernanceParsingFunctions = {
  active: (str) => (['O', 'N'].includes(str) ? mandatStatusMapping[str] : null),
  mandateTemporary: (str) => (['O', 'N'].includes(str) ? mandateTemporaryMapping[str] : null),
  mandateReason: (str) => (['E', 'N'].includes(str) ? mandateReasonMapping[str] : null),
  mandatePosition: (str) => (['1', '2', '3+'].includes(str) ? mandatePositionMapping[str] : null),
};

export default async function parseGouvernanceTSV(inputString) {
  const { headers, rows } = parseTSV(inputString);
  const type = 'gouvernance';
  const orderedApiHeaders = headers.map((header) => gouvernanceHeadersMapping[header]);
  const bodyList = rows.map((row) => zip(orderedApiHeaders, row, gouvernanceParsingFunctions));
  const result = await Promise.all(bodyList.map(async (originalBody, index) => {
    const { warning, error, status } = await checker(bodyList, index);
    const body = { ...originalBody, relationTag: 'gouvernance' };

    return { index: index + 2, body, warning, type, error, status };
  }));
  return result;
}
