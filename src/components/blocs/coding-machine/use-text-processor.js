import { useState } from 'react';

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

      const delimiter = rows[0].includes('\t') ? '\t' : ',';
      const headers = rows[0].split(delimiter).map((h) => h.trim() || 'Colonne');

      const firstHeaderIsName = headers[0].toLowerCase() === 'name' || headers[0].toLowerCase() === 'nom';
      const isIdOnlyTable = !firstHeaderIsName;

      let jsonData;

      if (isIdOnlyTable) {
        jsonData = rows.slice(1)
          .filter((row) => row.trim())
          .map((row, rowIndex) => {
            const values = row.split(delimiter);
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
            const values = row.split(delimiter);
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
