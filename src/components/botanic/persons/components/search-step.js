import { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Tag, Tile, TileBody } from '@dataesr/react-dsfr';
import SearchBar from '../../../search-bar';
import Button from '../../../button';

export default function PersonSearchStep({
  query, setQuery, options, isSearching,
  selectedPerson, onSelect, onUnselect,
  onChooseCreate,
}) {
  const [searchMode, setSearchMode] = useState(false);
  const showChoices = !selectedPerson && !searchMode;

  const handleChooseSearch = () => setSearchMode(true);
  const handleBackToChoices = () => { setSearchMode(false); onUnselect(); };

  return (
    <div>
      {showChoices && (
        <Row gutters className="fr-grid-row--equal-height">
          <Col n="6">
            <Tile onClick={handleChooseSearch}>
              <TileBody
                title="Modifier une personne existante"
                description="Rechercher dans la base Paysage"
                asLink={<span />}
              />
              <div className="fr-tile__img">
                <i className="ri-search-line ri-3x" aria-hidden="true" />
              </div>
            </Tile>
          </Col>
          <Col n="6">
            <Tile onClick={onChooseCreate}>
              <TileBody
                title="Créer une nouvelle personne"
                description="Renseigner les informations de la personne"
                asLink={<span />}
              />
              <div className="fr-tile__img">
                <i className="ri-add-circle-line ri-3x" aria-hidden="true" />
              </div>
            </Tile>
          </Col>
        </Row>
      )}

      {searchMode && !selectedPerson && (
        <>
          <SearchBar
            buttonLabel="Rechercher"
            label="Nom de la personne"
            placeholder="ex. Marie Curie…"
            value={query}
            options={options}
            onChange={(e) => setQuery(e.target.value)}
            onSelect={onSelect}
            isSearching={isSearching}
            size="lg"
          />
          <Button tertiary size="sm" icon="ri-arrow-left-line" iconPosition="left" onClick={handleBackToChoices} className="fr-mt-2w">
            Retour
          </Button>
        </>
      )}

      {selectedPerson && (
        <Row gutters alignItems="middle" spacing="mb-2w">
          <Col>
            <Tag icon="ri-user-3-line" isSmall={false} className="fr-mr-1w">
              {selectedPerson.name}
            </Tag>
          </Col>
          <Col n="auto">
            <Button secondary size="sm" icon="ri-close-line" iconPosition="left" onClick={handleBackToChoices}>
              Changer
            </Button>
          </Col>
        </Row>
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
