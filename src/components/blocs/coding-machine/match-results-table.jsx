import PropTypes from 'prop-types';
import RowItem from './row-items';

function MatchResultsTable({ matchedData, selectedMatches, onMatchSelection, setMatchedData, setSelectedMatches }) {
  return (
    <table className="fr-table">
      <thead>
        <tr>
          <th>Nom source</th>
          <th>Correspondances disponibles</th>
        </tr>
      </thead>
      <tbody>
        {matchedData.map((row, index) => (
          <RowItem
            key={index}
            row={row}
            index={index}
            selectedMatches={selectedMatches}
            onMatchSelection={onMatchSelection}
            matchedData={matchedData}
            setMatchedData={setMatchedData}
            setSelectedMatches={setSelectedMatches}
          />
        ))}
      </tbody>
    </table>
  );
}

MatchResultsTable.propTypes = {
  matchedData: PropTypes.array.isRequired,
  selectedMatches: PropTypes.object.isRequired,
  onMatchSelection: PropTypes.func.isRequired,
  setMatchedData: PropTypes.func.isRequired,
  setSelectedMatches: PropTypes.func.isRequired,
};

export default MatchResultsTable;
