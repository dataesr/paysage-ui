import PropTypes from 'prop-types';
import { Text } from '@dataesr/react-dsfr';
import { getDisplayName } from './formatters';
import MatchSelection from './match-selection';
import AlternativeSearchComponent from './alternative-search';

function RowItem({ row, index, selectedMatches, onMatchSelection, matchedData, setMatchedData, setSelectedMatches }) {
  return (
    <tr>
      <td style={{ verticalAlign: 'top' }}>
        <Text size="sm" bold>{getDisplayName(row)}</Text>
        {row._hasError && (
          <span className="fr-badge fr-badge--error fr-badge--sm">
            Erreur de format
          </span>
        )}
        {Object.entries(row)
          .filter(([key, value]) => {
            const ignoreFields = ['sourceQuery', 'matches', 'error', 'Name', 'name', 'Full Name', 'first_name', 'last_name', 'FullName'];
            if (ignoreFields.includes(key)) return false;
            if (!value || value.toString().trim() === '') return false;

            const strValue = value.toString().trim();
            return strValue.length > 3 && /^[A-Za-z0-9._-]+$/.test(strValue);
          })
          .map(([key, value]) => (
            <div key={key}>
              <span className="fr-badge fr-badge--sm fr-badge--blue-cumulus">
                ID renseigné:
                {' '}
                {value}
              </span>
            </div>
          ))}
      </td>
      <td>
        {Array.isArray(row.matches) && row.matches.length > 0 ? (
          <>
            <MatchSelection
              matches={row.matches}
              rowIndex={index}
              selectedMatches={selectedMatches}
              onMatchSelection={onMatchSelection}
            />
            <AlternativeSearchComponent
              rowIndex={index}
              onMatchSelection={onMatchSelection}
              matchedData={matchedData}
              setMatchedData={setMatchedData}
              setSelectedMatches={setSelectedMatches}
            />
          </>
        ) : (
          <>
            <div className="fr-alert fr-alert--info fr-alert--sm">
              <p>Aucune correspondance trouvée</p>
            </div>
            <AlternativeSearchComponent
              rowIndex={index}
              onMatchSelection={onMatchSelection}
              matchedData={matchedData}
              setMatchedData={setMatchedData}
              setSelectedMatches={setSelectedMatches}
            />
          </>
        )}
      </td>
    </tr>
  );
}

RowItem.propTypes = {
  row: PropTypes.shape({
    matches: PropTypes.array,
    _hasError: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number.isRequired,
  selectedMatches: PropTypes.object.isRequired,
  onMatchSelection: PropTypes.func.isRequired,
  matchedData: PropTypes.array.isRequired,
  setMatchedData: PropTypes.func.isRequired,
  setSelectedMatches: PropTypes.func.isRequired,
};

export default RowItem;
