import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import SearchBar from '../../../search-bar';
import DateInput from '../../../date-input';

export default function LaureatStep({
  laureateQuery,
  setLaureateQuery,
  laureateOptions,
  isSearchingLaureate,
  selectedLaureate,
  onSelectLaureate,
  onUnselectLaureate,
  relationTypeQuery,
  setRelationTypeQuery,
  relationTypeOptions,
  selectedRelationType,
  onSelectRelationType,
  onUnselectRelationType,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  errors,
  showErrors,
}) {
  return (
    <div>
      <p className="fr-text--sm fr-hint-text fr-mb-3w">
        Ajoutez un lauréat (personne ou structure) à ce prix.
      </p>

      <Row gutters>
        <Col n="12">
          <SearchBar
            label="Lauréat"
            hint="Rechercher une personne ou une structure"
            placeholder="Nom du lauréat..."
            value={selectedLaureate ? '' : laureateQuery}
            scope={selectedLaureate ? selectedLaureate.name : null}
            onChange={(e) => { onUnselectLaureate(); setLaureateQuery(e.target.value); }}
            onDeleteScope={onUnselectLaureate}
            options={laureateOptions}
            onSelect={onSelectLaureate}
            isSearching={isSearchingLaureate}
            size="lg"
          />
          {showErrors && errors.laureateId && <p className="fr-error-text">{errors.laureateId}</p>}
        </Col>

        <Col n="12">
          <SearchBar
            label="Type de relation"
            hint="ex. Lauréat, Mention spéciale..."
            placeholder="Rechercher un type de relation..."
            value={selectedRelationType ? '' : relationTypeQuery}
            scope={selectedRelationType ? selectedRelationType.name : null}
            onChange={(e) => { onUnselectRelationType(); setRelationTypeQuery(e.target.value); }}
            onDeleteScope={onUnselectRelationType}
            options={relationTypeOptions}
            onSelect={onSelectRelationType}
            isSearching={false}
            size="lg"
          />
          {showErrors && errors.relationTypeId && <p className="fr-error-text">{errors.relationTypeId}</p>}
        </Col>

        <Col n="12 md-6">
          <DateInput
            label="Date de début"
            value={startDate}
            onDateChange={onStartDateChange}
          />
        </Col>
        <Col n="12 md-6">
          <DateInput
            label="Date de fin"
            value={endDate}
            onDateChange={onEndDateChange}
          />
        </Col>
      </Row>
    </div>
  );
}

LaureatStep.propTypes = {
  laureateQuery: PropTypes.string.isRequired,
  setLaureateQuery: PropTypes.func.isRequired,
  laureateOptions: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })).isRequired,
  isSearchingLaureate: PropTypes.bool.isRequired,
  selectedLaureate: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
  onSelectLaureate: PropTypes.func.isRequired,
  onUnselectLaureate: PropTypes.func.isRequired,
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
  errors: PropTypes.shape({ laureateId: PropTypes.string, relationTypeId: PropTypes.string }),
  showErrors: PropTypes.bool.isRequired,
};

LaureatStep.defaultProps = {
  selectedLaureate: null,
  selectedRelationType: null,
  errors: {},
};
