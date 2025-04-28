import * as XLSX from 'xlsx';
import { getDisplayName } from './formatters';

const useExportResults = ({ matchedData, selectedMatches }) => {
  const collectIdentifierTypes = (data) => {
    const types = new Set();

    data.forEach((row) => {
      if (Array.isArray(row.matches)) {
        row.matches.forEach((match) => {
          if (match.identifiantsLists && Array.isArray(match.identifiantsLists)) {
            match.identifiantsLists.forEach((id) => {
              if (id && id.type) {
                types.add(id.type);
              }
            });
          }
        });
      }
    });

    return Array.from(types);
  };

  const getIdentifierValue = (match, idType) => {
    if (!match || !match.identifiantsLists || !Array.isArray(match.identifiantsLists)) {
      return '';
    }

    const identifier = match.identifiantsLists.find((id) => id && id.type === idType);
    return identifier ? identifier.value : '';
  };

  const exportResults = () => {
    if (!matchedData.length) return;

    const identifierTypes = collectIdentifierTypes(matchedData);

    const workbook = XLSX.utils.book_new();

    const selectedData = matchedData.map((row, index) => {
      const selectedId = selectedMatches[index];
      const selectedMatch = row.matches?.find((m) => m.id === selectedId) || {};

      const rowData = {
        Source: row.sourceQuery || '',
        PaysageId: selectedMatch.id || 'Non sélectionné',
        MatchName: selectedMatch.name || '',
        ObjectType: selectedMatch.objectType || '',
        Category: selectedMatch.category || '',
        City: selectedMatch.city || '',
        Country: selectedMatch.country || '',
        Acronym: selectedMatch.acronym || '',
        Status: selectedMatch.structureStatus || '',
        Activity: selectedMatch.activity || '',
        CreationDate: selectedMatch.creationDate || '',
        ClosureDate: selectedMatch.closureDate || '',
        Score: selectedMatch.score ? Math.round(selectedMatch.score) : '',
      };

      identifierTypes.forEach((idType) => {
        rowData[idType] = getIdentifierValue(selectedMatch, idType);
      });

      return rowData;
    });

    const allPropositionsData = [];
    matchedData.forEach((row) => {
      const sourceName = row.sourceQuery || getDisplayName(row) || 'Sans nom';

      if (!Array.isArray(row.matches) || row.matches.length === 0) {
        const emptyRow = {
          Source: sourceName,
          IsSelected: 'N/A',
          PaysageId: 'Non sélectionné',
          MatchName: '',
          ObjectType: '',
          Score: '',
          Category: '',
          City: '',
          Country: '',
          Acronym: '',
          Status: '',
          Activity: '',
          CreationDate: '',
          ClosureDate: '',
        };

        identifierTypes.forEach((idType) => {
          emptyRow[idType] = '';
        });

        allPropositionsData.push(emptyRow);
      } else {
        row.matches.forEach((match) => {
          const isSelected = selectedMatches[matchedData.indexOf(row)] === match.id;

          const rowData = {
            Source: sourceName,
            IsSelected: isSelected ? 'Oui' : 'Non',
            PaysageId: match.id,
            MatchName: match.name,
            ObjectType: match.objectType,
            Score: Math.round(match.score),
            Category: match.category || '',
            City: match.city || '',
            Country: match.country || '',
            Acronym: match.acronym || '',
            Status: match.structureStatus || '',
            Activity: match.activity || '',
            CreationDate: match.creationDate || '',
            ClosureDate: match.closureDate || '',
          };

          identifierTypes.forEach((idType) => {
            rowData[idType] = getIdentifierValue(match, idType);
          });

          allPropositionsData.push(rowData);
        });
      }
    });

    const selectedWorksheet = XLSX.utils.json_to_sheet(selectedData);
    const allPropositionsWorksheet = XLSX.utils.json_to_sheet(allPropositionsData);

    XLSX.utils.book_append_sheet(workbook, selectedWorksheet, 'Sélections');
    XLSX.utils.book_append_sheet(workbook, allPropositionsWorksheet, 'Toutes propositions');

    XLSX.writeFile(workbook, 'resultats_machine_a_coder.xlsx');
  };

  return { exportResults };
};

export default useExportResults;
