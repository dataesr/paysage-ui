import PropTypes from 'prop-types';
import CopyButton from '../../copy/copy-button';
import { getDisplayName } from './formatters';
import MatchSelection from './match-selection';
import AlternativeSearchComponent from './alternative-search';

function RowItem({ row, index, selectedMatches, onMatchSelection, matchedData, setMatchedData, setSelectedMatches }) {
  const hasPrimaryId = Boolean(row.isIdOnlyEntry && row.primaryId);
  const displayName = getDisplayName(row);

  return (
    <tr>
      <td style={{ verticalAlign: 'top' }}>
        <div className="flex flex--center">
          <span className="fr-badge fr-badge--sm fr-badge--blue-cumulus">
            {hasPrimaryId
              ? `${row.primaryIdType || 'ID'}: ${row.primaryId}`
              : displayName}
          </span>
          <CopyButton copyText={hasPrimaryId ? row.primaryId : displayName} title="Copier le nom" />
        </div>
        {row._hasError && (
          <span className="fr-badge fr-badge--error fr-badge--sm">
            Erreur de format
          </span>
        )}

        {!row.isIdOnlyEntry && Object.entries(row)
          .filter(([key, value]) => {
            const ignoreFields = [
              'sourceQuery', 'matches', 'error', 'Name', 'name',
              'Full Name', 'first_name', 'last_name', 'FullName',
              'isIdOnlyEntry', 'primaryId', 'primaryIdType',
            ];
            if (ignoreFields.includes(key)) return false;
            if (!value || value.toString().trim() === '') return false;

            const strValue = value.toString().trim();
            return strValue.length > 3 && /^[A-Za-z0-9._-]+$/.test(strValue);
          })
          .map(([key, value]) => (
            <div key={key} className="flex flex--center">
              <span className="fr-badge fr-badge--sm fr-badge--blue-cumulus">
                {key}
                :
                {' '}
                {value}
              </span>
              <CopyButton copyText={value} title={`Copier ${key}`} />
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
    isIdOnlyEntry: PropTypes.bool,
    primaryId: PropTypes.string,
    primaryIdType: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  selectedMatches: PropTypes.object.isRequired,
  onMatchSelection: PropTypes.func.isRequired,
  matchedData: PropTypes.array.isRequired,
  setMatchedData: PropTypes.func.isRequired,
  setSelectedMatches: PropTypes.func.isRequired,
};

export default RowItem;
