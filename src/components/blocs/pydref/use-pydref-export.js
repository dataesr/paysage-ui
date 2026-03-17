import * as XLSX from 'xlsx';

const collectIdentifierTypes = (results, selectedMatches) => {
  const types = new Set();
  results.forEach((row) => {
    const identifiers = selectedMatches[row.index]?.identifiers || row.identifiers || [];
    identifiers.forEach((idObj) => Object.keys(idObj).forEach((k) => types.add(k)));
  });
  return Array.from(types);
};

const getIdentifierValue = (identifiers, type) => {
  const idObj = (identifiers || []).find((o) => Object.prototype.hasOwnProperty.call(o, type));
  return idObj ? idObj[type] : '';
};

const usePydrefExport = ({ results, selectedMatches }) => {
  const exportResults = () => {
    if (!results || results.length === 0) return;

    const idTypes = collectIdentifierTypes(results, selectedMatches);

    const rows = results.map((row) => {
      const resolvedMatch = selectedMatches[row.index];
      const identifiers = resolvedMatch?.identifiers || row.identifiers || [];

      const base = {
        last_name: row.lastName,
        first_name: row.firstName,
        status: resolvedMatch ? 'manually_selected' : row.status,
        nb_homonyms: row.nb_homonyms,
      };

      idTypes.forEach((t) => { base[t] = getIdentifierValue(identifiers, t); });

      if (row.error) base.error = row.error;

      return base;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Résultats');
    XLSX.writeFile(wb, 'pydref_results.xlsx');
  };

  return { exportResults };
};

export default usePydrefExport;
