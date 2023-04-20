import { parseTSV, zip } from '../utils';
import checker from './checker';
import headersMapping from './headers-mapping';

const statusMapping = {
  O: 'active',
  F: 'inactive',
  P: 'forthcoming',
};

const structureParsingFunctions = {
  otherNames: (str) => { str?.split(';'); },
  structureStatus: (str) => (['O', 'F', 'P'].includes(str) ? statusMapping[str] : null),
  categories: (str) => str?.split(';').filter((category) => category.trim()),
  coordinates: (str) => {
    if (!str) return null;
    const [lat, lng] = str.split(',');
    return { lat: Number(lat.trim()), lng: Number(lng.trim()) };
  },
  iso3: (str) => str?.toUpperCase(),
};

export default async function parseStructureTSV(inputString) {
  const { headers, rows } = parseTSV(inputString);
  const orderedApiHeaders = headers.map((header) => headersMapping[header]);
  const bodyList = rows.map((row) => zip(orderedApiHeaders, row, structureParsingFunctions));
  const result = await Promise.all(bodyList.map(async (body, index) => {
    const { warning, error, status } = await checker(bodyList, index);
    return { index: index + 2, body, displayName: body.usualName, warning, error, status };
  }));
  return result;
}
