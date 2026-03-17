import { useState } from 'react';
import * as XLSX from 'xlsx';

const PYDREF_API = 'https://pydref.staging.dataesr.ovh/identify';

const useFileReader = ({ setData, setError, setResults }) => {
  const [processing, setProcessing] = useState(false);

  const readFile = (file) => {
    if (!file) return;

    setProcessing(true);
    setError(null);
    setResults([]);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (!rows || rows.length === 0) {
          setError('Le fichier est vide ou ne contient pas de données.');
          setProcessing(false);
          return;
        }

        const headers = Object.keys(rows[0]);
        const lastNameHeader = headers.find((h) => h.toLowerCase() === 'last_name');
        const firstNameHeader = headers.find((h) => h.toLowerCase() === 'first_name');

        if (!lastNameHeader && !firstNameHeader) {
          setError('Le fichier doit contenir au moins une des colonnes "last_name" ou "first_name".');
          setProcessing(false);
          return;
        }

        const getCell = (row, header) => (header ? row[header] : '');

        const parsed = rows
          .filter((row) => getCell(row, lastNameHeader) || getCell(row, firstNameHeader))
          .map((row, idx) => ({
            index: idx,
            last_name: String(getCell(row, lastNameHeader) || '').trim(),
            first_name: String(getCell(row, firstNameHeader) || '').trim(),
          }));

        if (parsed.length === 0) {
          setError('Aucune ligne valide trouvée dans le fichier.');
          setProcessing(false);
          return;
        }

        setData(parsed);
      } catch (err) {
        setError(`Erreur lors de la lecture du fichier : ${err.message}`);
      } finally {
        setProcessing(false);
      }
    };

    reader.onerror = () => {
      setError('Impossible de lire le fichier.');
      setProcessing(false);
    };

    reader.readAsBinaryString(file);
  };

  return { readFile, processing };
};

export { PYDREF_API };
export default useFileReader;
