import * as XLSX from 'xlsx';

const useFileProcessor = ({ setData, setError, setMatchedData, setSelectedMatches }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);
    setMatchedData([]);
    setSelectedMatches({});

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      try {
        let jsonData = [];

        if (file.name.endsWith('.csv')) {
          const text = target.result;
          const rows = text.split('\n').map((row) => row.split(','));
          const headers = rows[0];
          jsonData = rows.slice(1)
            .filter((row) => row.length > 0 && row[0].trim() !== '')
            .map((row) => headers.reduce((acc, header, index) => {
              acc[header.trim()] = row[index] ? row[index].trim() : '';
              return acc;
            }, {}));
        } else if (file.name.endsWith('.xlsx')) {
          const workbook = XLSX.read(target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          jsonData = XLSX.utils.sheet_to_json(sheet);
        }

        setData(jsonData);
      } catch (err) {
        setError(`Erreur lors du traitement du fichier: ${err.message}`);
      }
    };

    if (file.name.endsWith('.xlsx')) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  return { handleFileUpload };
};

export default useFileProcessor;
