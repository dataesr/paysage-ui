import * as XLSX from 'xlsx';
import { getDisplayName } from './formatters';

const useExportResults = ({ matchedData, selectedMatches }) => {
  const exportResults = () => {
    if (!matchedData.length) return;

    const workbook = XLSX.utils.book_new();

    const selectedData = matchedData.map((row, index) => {
      const selectedId = selectedMatches[index];
      const selectedMatch = row.matches?.find((m) => m.id === selectedId) || {};

      return {
        Source: row.sourceQuery || '',
        PaysageId: selectedMatch.id || 'Non sélectionné',
        MatchName: selectedMatch.name || '',
        ObjectType: selectedMatch.objectType || '',
        Category: selectedMatch.category || '',
        City: selectedMatch.city || '',
        Acronym: selectedMatch.acronym || '',
        Status: selectedMatch.structureStatus || '',
        Activity: selectedMatch.activity || '',
        CreationDate: selectedMatch.creationDate || '',
        ClosureDate: selectedMatch.closureDate || '',
        Identifiers: selectedMatch.identifiers || '',
      };
    });

    const allPropositionsData = [];
    matchedData.forEach((row) => {
      const sourceName = row.sourceQuery || getDisplayName(row) || 'Sans nom';

      if (!Array.isArray(row.matches) || row.matches.length === 0) {
        allPropositionsData.push({
          Source: sourceName,
          IsSelected: 'N/A',
          PaysageId: 'Aucune correspondance',
          MatchName: '',
          ObjectType: '',
          Score: '',
          Category: '',
          City: '',
          Activity: '',
        });
      } else {
        row.matches.forEach((match) => {
          const isSelected = selectedMatches[matchedData.indexOf(row)] === match.id;

          allPropositionsData.push({
            Source: sourceName,
            IsSelected: isSelected ? 'Oui' : 'Non',
            PaysageId: match.id,
            MatchName: match.name,
            ObjectType: match.objectType,
            Score: Math.round(match.score),
            Category: match.category || '',
            City: match.city || '',
            Acronym: match.acronym || '',
            Activity: match.activity || '',
            CreationDate: match.creationDate || '',
            ClosureDate: match.closureDate || '',
            Status: match.structureStatus || '',
            Identifiers: match.identifiers || '',
          });
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
