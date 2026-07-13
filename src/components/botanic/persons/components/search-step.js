import PropTypes from 'prop-types';
import { Col, Row, Tag } from '@dataesr/react-dsfr';
import SearchBar from '../../../search-bar';
import Button from '../../../button';

export default function PersonSearchStep({
  query, setQuery, options, isSearching,
  selectedPerson, onSelect, onUnselect,
  onChooseCreate,
}) {
  const trimmedQuery = query.trim();
  const showCreate = !selectedPerson && trimmedQuery.length >= 2 && !isSearching;

  if (selectedPerson) {
    return (
      <Row gutters alignItems="middle" spacing="mb-2w">
        <Col>
          <Tag icon="ri-user-3-line" isSmall={false} className="fr-mr-1w">
            {selectedPerson.name}
          </Tag>
        </Col>
        <Col n="auto">
          <Button secondary size="sm" icon="ri-close-line" iconPosition="left" onClick={onUnselect}>
            Changer
          </Button>
        </Col>
      </Row>
    );
  }

  return (
    <div>
      <SearchBar
        buttonLabel="Rechercher"
        label="Rechercher ou créer une personne"
        hint="Saisissez un nom. Sélectionnez une fiche existante pour la modifier, ou créez-en une nouvelle."
        placeholder="ex. Marie Curie…"
        value={query}
        options={options}
        onChange={(e) => setQuery(e.target.value)}
        onSelect={onSelect}
        isSearching={isSearching}
        size="lg"
      />
      {showCreate && (
        <div className="fr-mt-2w">
          <p className="fr-text--sm fr-hint-text fr-mb-1w">
            Aucune fiche ne correspond&nbsp;?
          </p>
          <Button
            icon="ri-add-circle-line"
            iconPosition="left"
            onClick={() => onChooseCreate(trimmedQuery)}
          >
            {`Créer une nouvelle personne « ${trimmedQuery} »`}
          </Button>
        </div>
      )}
    </div>
  );
}

PersonSearchStep.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })).isRequired,
  isSearching: PropTypes.bool.isRequired,
  selectedPerson: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
  onSelect: PropTypes.func.isRequired,
  onUnselect: PropTypes.func.isRequired,
  onChooseCreate: PropTypes.func.isRequired,
};
PersonSearchStep.defaultProps = { selectedPerson: null };
