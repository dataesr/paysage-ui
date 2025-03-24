import PropTypes from 'prop-types';
import { formatMatchInfo } from './formatters';
import useAlternativeSearch from './use-alternative-search';
import SearchBar from '../../search-bar';

export default function AlternativeSearchComponent({
  rowIndex,
  matchedData,
  setMatchedData,
  setSelectedMatches,
  onMatchSelection,
}) {
  const { loading, options, query, handleSearchChange, handleOptionSelect } = useAlternativeSearch({
    rowIndex,
    matchedData,
    setMatchedData,
    setSelectedMatches,
    onMatchSelection,
  });

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    handleSearchChange(newValue);
  };

  return (
    <div className="fr-mt-2w">
      <div className="fr-fieldset">
        <legend className="fr-fieldset__legend fr-text--sm">
          Rechercher d'autres correspondances
        </legend>
        <SearchBar
          buttonLabel="Rechercher"
          isSearching={loading}
          onChange={handleInputChange}
          onSelect={handleOptionSelect}
          options={options}
          placeholder="Entrez un nom d'établissement ou de personne..."
          value={query}
          renderOption={(option) => (
            <div>
              <strong>{option.name}</strong>
              <div style={{ fontSize: '0.85em', color: '#666' }}>
                {formatMatchInfo(option)}
              </div>
            </div>
          )}
        />
        {options.length === 0 && !loading && query && query.trim().length >= 2 && (
          <div className="fr-alert fr-alert--info fr-alert--sm fr-mt-2w">
            <p>Aucun résultat trouvé pour cette requête.</p>
          </div>
        )}
      </div>
    </div>
  );
}

AlternativeSearchComponent.propTypes = {
  rowIndex: PropTypes.number.isRequired,
  matchedData: PropTypes.array.isRequired,
  setMatchedData: PropTypes.func.isRequired,
  setSelectedMatches: PropTypes.func.isRequired,
  onMatchSelection: PropTypes.func.isRequired,
};
