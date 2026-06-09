import { useMemo } from 'react';
import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import DateInput from '../../../date-input';
import SearchBar from '../../../search-bar';

export default function FonctionStep({
  relationTypeQuery, setRelationTypeQuery, relationTypeOptions,
  selectedRelationType, onSelectRelationType, onUnselectRelationType,
  startDate, onStartDateChange, endDate, onEndDateChange,
  errors, showErrors, idrefDescriptions,
}) {
  const suggestions = useMemo(() => {
    if (!idrefDescriptions?.length || !relationTypeOptions?.length) return [];
    const descText = idrefDescriptions.join(' ').toLowerCase();
    return relationTypeOptions.filter((rt) => {
      const words = rt.name.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      return words.some((w) => descText.includes(w));
    }).slice(0, 5);
  }, [idrefDescriptions, relationTypeOptions]);

  return (
    <Row gutters>
      <Col n="12">
        <SearchBar
          buttonLabel="Rechercher"
          label="Type de mandat / fonction"
          hint="Ex : Directeur général, Président, Chargé de mission…"
          required
          value={selectedRelationType ? '' : relationTypeQuery}
          placeholder="Rechercher un type de mandat…"
          scope={selectedRelationType ? selectedRelationType.name : null}
          onChange={(e) => { onUnselectRelationType(); setRelationTypeQuery(e.target.value); }}
          onDeleteScope={onUnselectRelationType}
          options={relationTypeOptions}
          onSelect={onSelectRelationType}
          isSearching={false}
          size="lg"
        />
        {showErrors && errors.relationTypeId && (
          <p className="fr-error-text fr-text--sm fr-mt-1v">{errors.relationTypeId}</p>
        )}
      </Col>

      {!selectedRelationType && suggestions.length > 0 && (
        <Col n="12">
          <p className="fr-text--xs fr-mb-1w">Suggestions d&apos;après le profil IdRef :</p>
          <ul className="fr-tags-group">
            {suggestions.map((rt) => (
              <li key={rt.id}>
                <button type="button" className="fr-tag" onClick={() => onSelectRelationType(rt)}>
                  {rt.name}
                </button>
              </li>
            ))}
          </ul>
        </Col>
      )}

      <Col n="12 md-6">
        <DateInput
          value={startDate}
          label="Date de prise de fonction"
          onDateChange={onStartDateChange}
        />
      </Col>
      <Col n="12 md-6">
        <DateInput
          value={endDate}
          label="Date de fin de fonction (optionnel)"
          onDateChange={onEndDateChange}
        />
      </Col>
    </Row>
  );
}

FonctionStep.propTypes = {
  relationTypeQuery: PropTypes.string.isRequired,
  setRelationTypeQuery: PropTypes.func.isRequired,
  relationTypeOptions: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })).isRequired,
  selectedRelationType: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
  onSelectRelationType: PropTypes.func.isRequired,
  onUnselectRelationType: PropTypes.func.isRequired,
  startDate: PropTypes.string.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  endDate: PropTypes.string.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({ relationTypeId: PropTypes.string }).isRequired,
  showErrors: PropTypes.bool.isRequired,
  idrefDescriptions: PropTypes.arrayOf(PropTypes.string),
};
FonctionStep.defaultProps = { selectedRelationType: null, idrefDescriptions: [] };
