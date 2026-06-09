/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import { Col, Row } from '@dataesr/react-dsfr';
import SearchBar from '../../../search-bar';
import Button from '../../../button';
import DateInput from '../../../date-input';

export default function PrizeSearchStep({
  query,
  setQuery,
  options,
  isSearching,
  selectedPrize,
  onSelect,
  onUnselect,
  isCreatingNew,
  nameFr,
  onNameFrChange,
  nameEn,
  onNameEnChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onToggleCreateNew,
  errors,
}) {
  return (
    <div>
      <p className="fr-text--bold fr-mb-2w">Rechercher un prix existant</p>

      {!selectedPrize && !isCreatingNew && (
        <SearchBar
          label="Nom du prix"
          placeholder="ex. Prix Nobel de..."
          value={query}
          options={options}
          onChange={(e) => setQuery(e.target.value)}
          onSelect={onSelect}
          isSearching={isSearching}
          size="lg"
        />
      )}

      {selectedPrize && (
        <Row gutters alignItems="middle" spacing="mb-2w">
          <Col>
            <span className="fr-tag">{selectedPrize.name}</span>
          </Col>
          <Col n="auto">
            <Button secondary size="sm" icon="ri-close-line" iconPosition="left" onClick={onUnselect}>
              Changer
            </Button>
          </Col>
        </Row>
      )}

      {!selectedPrize && !isCreatingNew && (
        <Row spacing="mt-2w">
          <Col>
            <Button tertiary size="sm" icon="ri-add-line" iconPosition="left" onClick={onToggleCreateNew}>
              Je ne trouve pas le prix, en créer un nouveau
            </Button>
          </Col>
        </Row>
      )}

      {isCreatingNew && (
        <>
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="nameFr">
              Nom (français)
              <span className="fr-hint-text">Champ obligatoire</span>
            </label>
            <input
              className={`fr-input${errors?.nameFr ? ' fr-input--error' : ''}`}
              id="nameFr"
              type="text"
              value={nameFr}
              onChange={(e) => onNameFrChange(e.target.value)}
              placeholder="Nom du prix en français"
            />
            {errors?.nameFr && <p className="fr-error-text">{errors.nameFr}</p>}
          </div>

          <div className="fr-input-group fr-mt-2w">
            <label className="fr-label" htmlFor="nameEn">
              Nom (anglais)
              <span className="fr-hint-text">Optionnel</span>
            </label>
            <input
              className="fr-input"
              id="nameEn"
              type="text"
              value={nameEn}
              onChange={(e) => onNameEnChange(e.target.value)}
              placeholder="Nom du prix en anglais"
            />
          </div>

          <Row gutters spacing="mt-2w">
            <Col n="12 md-6">
              <DateInput
                label="Année de création"
                value={startDate}
                onDateChange={onStartDateChange}
              />
            </Col>
            <Col n="12 md-6">
              <DateInput
                label="Année de clôture"
                value={endDate}
                onDateChange={onEndDateChange}
              />
            </Col>
          </Row>

          <Row spacing="mt-1w">
            <Col>
              <Button tertiary size="sm" icon="ri-search-line" iconPosition="left" onClick={onToggleCreateNew}>
                Revenir à la recherche
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

PrizeSearchStep.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })).isRequired,
  isSearching: PropTypes.bool.isRequired,
  selectedPrize: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
  onSelect: PropTypes.func.isRequired,
  onUnselect: PropTypes.func.isRequired,
  isCreatingNew: PropTypes.bool.isRequired,
  nameFr: PropTypes.string.isRequired,
  onNameFrChange: PropTypes.func.isRequired,
  nameEn: PropTypes.string.isRequired,
  onNameEnChange: PropTypes.func.isRequired,
  startDate: PropTypes.string.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  endDate: PropTypes.string.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onToggleCreateNew: PropTypes.func.isRequired,
  errors: PropTypes.shape({ nameFr: PropTypes.string }),
};

PrizeSearchStep.defaultProps = {
  selectedPrize: null,
  errors: {},
};
