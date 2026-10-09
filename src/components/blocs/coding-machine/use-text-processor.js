import { useState } from 'react';

const splitOnSpaces = (row) => {
  const tokens = row.trim().split(/\s+/);
  const firstId = tokens.findIndex((token) => /\d/.test(token));
  return firstId < 1 ? tokens : [tokens.slice(0, firstId).join(' '), ...tokens.slice(firstId)];
};

const useTextProcessor = ({ setData, setError, setMatchedData, setSelectedMatches }) => {
  const [processing, setProcessing] = useState(false);

  const processTableText = (text) => {
    if (!text || !text.trim()) {
      setError('Aucune donnée à traiter');
      return;
    }

    setProcessing(true);
    setError(null);
    setMatchedData([]);
    setSelectedMatches({});

    try {
      const rows = text.trim().split(/\r?\n/);

      if (rows.length < 2) {
        setError("Le tableau doit contenir au moins une ligne d'en-tête et une ligne de données");
        setProcessing(false);
        return;
      }

      const delimiter = ['\t', ','].find((d) => rows[0].includes(d));
      const splitRow = (row) => (delimiter ? row.split(delimiter) : splitOnSpaces(row));
      const headers = splitRow(rows[0]).map((h) => h.trim() || 'Colonne');

      const firstHeaderIsName = headers[0].toLowerCase() === 'name' || headers[0].toLowerCase() === 'nom';
      const isIdOnlyTable = !firstHeaderIsName;

      let jsonData;

      if (isIdOnlyTable) {
        jsonData = rows.slice(1)
          .filter((row) => row.trim())
          .map((row, rowIndex) => {
            const values = splitRow(row);
            const data = {
              name: `ID ${rowIndex + 1}`,
              isIdOnlyEntry: true,
            };

            for (let i = 0; i < headers.length && i < values.length; i += 1) {
              if (values[i] && values[i].trim()) {
                const idValue = values[i].trim();
                data[headers[i]] = idValue;

                if (i === 0) {
                  data.primaryId = idValue;
                  data.primaryIdType = headers[i];
                }
              }
            }

            return data;
          });
      } else {
        jsonData = rows.slice(1)
          .filter((row) => row.trim())
          .map((row) => {
            const values = splitRow(row);
            const data = { name: values[0] ? values[0].trim() : '' };

            for (let i = 1; i < headers.length && i < values.length; i += 1) {
              if (values[i] && values[i].trim()) {
                data[headers[i]] = values[i].trim();
              }
            }

            return data;
          });
      }

      if (jsonData.length === 0) {
        setError('Aucune donnée valide trouvée dans le tableau');
        setProcessing(false);
        return;
      }

      setData(jsonData);
    } catch (err) {
      setError(`Erreur lors du traitement des données : ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return { processTableText, processing };
};

export default useTextProcessor;
