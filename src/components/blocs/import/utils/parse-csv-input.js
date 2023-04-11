import { statusMapping, structureMapping, structureParsingFunction } from './mappings';

const LINE_SEPARATOR = '\n';
const TSV_SEPARATOR = '\t';

function parseTSV(str) {
  const byLineTsv = JSON.parse(JSON.stringify(str)).split(LINE_SEPARATOR);
  const headers = byLineTsv.shift().split(TSV_SEPARATOR);
  const rows = byLineTsv.filter((row) => row.length).map((row) => row.split(TSV_SEPARATOR));
  return { headers, rows };
}

function zip(headers, row) {
  return headers.reduce((acc, current, index) => {
    if (typeof current === 'undefined') return acc;
    const key = JSON && JSON.parse(JSON.stringify(current));
    if (row[index]) return { ...acc, [key]: row[index] };
    return acc;
  }, {});
}

// function parseStructure(structure) {
//   const body = {};
//   Object.keys(structure).forEach((key) => {
//     const parsingFunction = structureParsingFunction[key];
//     if (parsingFunction) { body[key] = parsingFunction[structure[key]]; }
//     if (key === 'structureStatus') {
//       body[key] = statusMapping[structure[key]];
//     }
//   });
//   return body;
// }

export function parseStructureCSV(inputString) {
  const { headers: inputHeaders, rows } = parseTSV(inputString);
  const headers = inputHeaders.map((header) => structureMapping[header]);
  const result = rows.map((row) => zip(headers, row));
  //   const parsedResult = result.map((res) => parseStructure(res));
  return result;
}
