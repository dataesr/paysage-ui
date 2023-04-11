function parse(row) {
  return { ...row, displayName: null, body: {} };
}

async function checker(row) {
  return { ...row, error: null, warning: null, status: null };
}

export default async function structuresAnalyser(rows) {
  return rows.map((row) => checker(parse(row)));
}
