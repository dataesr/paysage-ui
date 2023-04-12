const LINE_SEPARATOR = '\n';
const TSV_SEPARATOR = '\t';

export default function parseTSV(str) {
  const byLineTsv = str.split(LINE_SEPARATOR);
  const headers = byLineTsv.shift().split(TSV_SEPARATOR);
  const rows = byLineTsv.filter((row) => row.length).map((row) => row.split(TSV_SEPARATOR));
  return { headers, rows };
}
