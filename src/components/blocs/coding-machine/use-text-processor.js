import { useState } from 'react';

const useTextProcessor = ({ setData, setError, setMatchedData, setSelectedMatches }) => {
  const [processing, setProcessing] = useState(false);
  // Ajouter un état pour stocker la liste complète des erreurs
  const [validationErrors, setValidationErrors] = useState([]);

  const processTableText = (text) => {
    if (!text || !text.trim()) {
      setError('Aucune donnée à traiter');
      return;
    }

    setProcessing(true);
    setError(null);
    setMatchedData([]);
    setSelectedMatches({});
    setValidationErrors([]);

    try {
      const errors = [];

      const rows = text.trim().split(/\r?\n/);

      if (rows.length < 2) {
        setError("Le tableau doit contenir au moins une ligne d'en-tête et une ligne de données");
        setProcessing(false);
        return;
      }

      const delimiter = rows[0].includes('\t') ? '\t' : ',';
      const headers = rows[0].split(delimiter).map((header) => header.trim());

      if (!headers.includes('Name') && !headers.includes('name')) {
        setError("L'en-tête 'Name' est requis dans le tableau");
        setProcessing(false);
        return;
      }

      const emptyHeaders = headers.some((h) => h === '');
      if (emptyHeaders) {
        errors.push('Attention : certains en-têtes sont vides, ce qui pourrait causer des problèmes.');
      }

      const jsonData = [];
      const rowErrors = [];

      rows.slice(1).forEach((row, rowIndex) => {
        if (row.trim() === '') return;

        const values = row.split(delimiter);

        if (values.length !== headers.length) {
          rowErrors.push(`Ligne ${rowIndex + 2}: Le nombre de colonnes (${values.length}) ne correspond pas au nombre d'en-têtes (${headers.length}).`);
        }

        // Vérifier si le champ Name est rempli
        const nameValue = values[headers.indexOf('Name') !== -1 ? headers.indexOf('Name') : headers.indexOf('name')];
        if (!nameValue || nameValue.trim() === '') {
          rowErrors.push(`Ligne ${rowIndex + 2}: Le champ Name est vide.`);
        }

        const dataObj = headers.reduce((acc, header, index) => {
          acc[header] = values[index] ? values[index].trim() : '';
          return acc;
        }, {});

        if (rowErrors.length > 0) {
          dataObj._hasError = true;
        }

        jsonData.push(dataObj);
      });

      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
      }

      if (jsonData.length === 0) {
        setError('Aucune donnée valide trouvée dans le tableau');
        setProcessing(false);
        return;
      }

      if (errors.length > 0) {
        setValidationErrors(errors);
        setError(`${errors.length} problème(s) détecté(s). Voir les détails ci-dessous.`);
      }

      setData(jsonData);
    } catch (err) {
      setError(`Erreur lors du traitement des données : ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return { processTableText, processing, validationErrors };
};

export default useTextProcessor;
