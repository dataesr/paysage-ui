import { parseTSV, zip } from '../utils';
import checker from './checker';
import { laureatHeadersMapping } from './headers-mapping';

const laureatesParsingFunctions = {
  otherAssociatedObjectIds: (str) => str?.split(';').filter((structure) => structure.trim()),
};

export default async function parseLaureatsTSV(inputString) {
  const { headers, rows } = parseTSV(inputString);
  const relationTag = 'laureat';
  const type = 'laureats';
  const orderedApiHeaders = headers.map((header) => laureatHeadersMapping[header]);

  const bodyList = rows.map((row) => {
    const body = zip(orderedApiHeaders, row, laureatesParsingFunctions);
    return { ...body, relationTag };
  });

  const result = await Promise.all(bodyList.map(async (body, index) => {
    const { warning, error, status } = await checker(body, index);
    return { index: index + 2, body, type, warning, error, status };
  }));

  return result;
}
