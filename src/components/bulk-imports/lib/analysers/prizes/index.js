import { parseTSV, zip } from '../utils';
import checker from './checker';
import { prizesHeadersMapping } from './headers-mapping';

const prizesParsingFunctions = {
  categories: (str) => str?.split(';').filter((category) => category.trim()),
  structures: (str) => str?.split(';').filter((structure) => structure.trim()),
};

export default async function parsePriceTSV(inputString) {
  const { headers, rows } = parseTSV(inputString);
  const type = 'price';
  const orderedApiHeaders = headers.map((header) => prizesHeadersMapping[header]);
  const bodyList = rows.map((row) => zip(orderedApiHeaders, row, prizesParsingFunctions));
  const result = await Promise.all(bodyList.map(async (body, index) => {
    const { warning, error, status } = await checker(bodyList, index);
    return { index: index + 2, body, displayName: body.nameFr, type, warning, error, status };
  }));
  return result;
}
