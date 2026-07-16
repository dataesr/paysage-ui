import { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Tag, Tile, TileBody } from '@dataesr/react-dsfr';
import SearchBar from '../../../search-bar';
import Button from '../../../button';
import { capitalizeName } from '../../utils';

export default function StructureSearchStep({
  query, setQuery, options, isSearching,
  selectedStructure, onSelect, onUnselect,
  isCreatingNew, usualName, onUsualNameChange, onToggleCreateNew,
  paysageMatches, onSelectExisting,
}) {
  const [searchMode, setSearchMode] = useState(false);

  const showChoices = !selectedStructure && !isCreatingNew && !searchMode;

  const handleChooseSearch = () => setSearchMode(true);
  const handleChooseCreate = () => { setSearchMode(false); if (!isCreatingNew) onToggleCreateNew(); };
  const handleBackToChoices = () => { setSearchMode(false); if (isCreatingNew) onToggleCreateNew(); onUnselect(); };

  return (
    <div>
      {showChoices && (
        <Row gutters className="fr-grid-row--equal-height">
          <Col n="6">
            <Tile onClick={handleChooseSearch}>
              <TileBody title="Modifier une structure existante" description="Rechercher dans la base Paysage" asLink={<span />} />
              <div className="fr-tile__img">
                <i className="ri-search-line ri-3x" aria-hidden="true" />
              </div>
            </Tile>
          </Col>
          <Col n="6">
            <Tile onClick={handleChooseCreate}>
              <TileBody title="Créer une nouvelle structure" description="Renseigner le nom usuel" asLink={<span />} />
              <div className="fr-tile__img">
                <i className="ri-add-circle-line ri-3x" aria-hidden="true" />
              </div>
            </Tile>
          </Col>
        </Row>
      )}

      {searchMode && !selectedStructure && (
        <>
          <SearchBar
            label="Nom ou acronyme de la structure"
            placeholder="ex. Université Paris..."
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

      {selectedStructure && (
        <Row gutters alignItems="middle" spacing="mb-2w">
          <Col>
            <Tag icon="ri-building-2-line" isSmall={false} className="fr-mr-1w">
              {selectedStructure.acronym
                ? `${selectedStructure.name} (${selectedStructure.acronym})`
                : selectedStructure.name}
            </Tag>
          </Col>
          <Col n="auto">
            <Button secondary size="sm" icon="ri-close-line" iconPosition="left" onClick={handleBackToChoices}>
              Changer
            </Button>
          </Col>
        </Row>
      )}

      {isCreatingNew && (
        <div className="fr-input-group">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="fr-label" htmlFor="structure-usualName">
            Nom usuel de la structure à créer
            <span className="fr-hint-text">Champ obligatoire</span>
          </label>
          <input
            className="fr-input"
            id="structure-usualName"
            type="text"
            value={usualName}
            onChange={(e) => onUsualNameChange(capitalizeName(e.target.value))}
            placeholder="ex. Université de Montpellier"
          />
          <Button tertiary size="sm" icon="ri-arrow-left-line" iconPosition="left" onClick={handleBackToChoices} className="fr-mt-2w">
            Retour
          </Button>
        </div>
      )}

      {isCreatingNew && paysageMatches.length > 0 && (
        <div className="fr-alert fr-alert--warning fr-mt-2w">
          <p className="fr-alert__title">
            {`${paysageMatches.length > 1 ? 'Des structures existent' : 'Une structure existe'} peut-être déjà dans Paysage`}
          </p>
          <p className="fr-text--sm fr-mb-2w">
            {`${paysageMatches.length} fiche${paysageMatches.length > 1 ? 's' : ''} trouvée${paysageMatches.length > 1 ? 's' : ''} avec ce nom. Vérifiez avant de créer une nouvelle fiche.`}
          </p>
          {paysageMatches.map((match) => (
            <div key={match.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="fr-text--sm" style={{ fontWeight: 600, flex: 1, minWidth: '150px' }}>
                {match.acronym ? `${match.name} (${match.acronym})` : match.name}
              </span>
              <Button size="sm" icon="ri-links-line" iconPosition="left" onClick={() => onSelectExisting(match)}>
                Modifier cette fiche
              </Button>
              <Button size="sm" secondary icon="ri-external-link-line" iconPosition="left" onClick={() => window.open(`/structures/${match.id}`, '_blank')}>
                Voir la fiche
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

StructureSearchStep.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    acronym: PropTypes.string,
  })).isRequired,
  isSearching: PropTypes.bool.isRequired,
  selectedStructure: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string, acronym: PropTypes.string }),
  onSelect: PropTypes.func.isRequired,
  onUnselect: PropTypes.func.isRequired,
  isCreatingNew: PropTypes.bool.isRequired,
  usualName: PropTypes.string.isRequired,
  onUsualNameChange: PropTypes.func.isRequired,
  onToggleCreateNew: PropTypes.func.isRequired,
  paysageMatches: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string, acronym: PropTypes.string })),
  onSelectExisting: PropTypes.func,
};

StructureSearchStep.defaultProps = {
  selectedStructure: null,
  paysageMatches: [],
  onSelectExisting: null,
};
