import { parseTSV, zip } from '../utils';
import checker from './checker';
import { termsHeadersMapping } from './headers-mapping';

const termsParsingFunctions = {
  otherNamesFr: (str) => { str?.split(';'); },
};

export default async function parseTermsTSV(inputString) {
  const { headers, rows } = parseTSV(inputString);
  const type = 'terms';
  const orderedApiHeaders = headers.map((header) => termsHeadersMapping[header]);
  const bodyList = rows.map((row) => {
    const body = zip(orderedApiHeaders, row, termsParsingFunctions);
    return { ...body };
  });
  const result = await Promise.all(bodyList.map(async (body, index) => {
    const { warning, error, status } = await checker(bodyList, index);
    return { index: index + 2, body, displayName: body.nameFr, type, warning, error, status };
  }));
  return result;
}
