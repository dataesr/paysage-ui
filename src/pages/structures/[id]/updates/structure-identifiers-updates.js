import PropTypes from 'prop-types';
import { Col, Row, Text } from '@dataesr/react-dsfr';
import { IdentifierSuggestionUpdate } from './components/IdentifiersSuggestions';

const IDENTIFIER_DISPLAY_NAMES = {
  isni: 'ISNI',
  bnf: 'BNF',
  grid: 'GRID',
  ror: 'ROR',
  rnsr: 'RNSR',
  wikidata: 'Wikidata',
  idref: 'IdRef',
};

const SOURCE_DISPLAY_NAMES = {
  wikidata: 'Wikidata',
  idref: 'IdRef',
  sirene: 'Sirene',
};

const DATE_DISPLAY_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

function getCurrentIdentifier(paysageData, type) {
  const currentIdentifiers = Array.isArray(paysageData?.currentIdentifiers) ? paysageData.currentIdentifiers : [];
  return currentIdentifiers.find((identifier) => identifier.type === type);
}

const normalizeValue = (value) => (value || '').replace(/\s+/g, '').toLowerCase();

function SuggestionCard({ suggestion, reload, paysageData }) {
  const isPending = suggestion.status === 'pending';

  const currentIdentifier = getCurrentIdentifier(paysageData, suggestion.type);
  const hasExistingValueOfSameType = !!currentIdentifier;
  const isValueChange = hasExistingValueOfSameType && normalizeValue(currentIdentifier.value) !== normalizeValue(suggestion.value);

  let badgeLabel = 'Nouveau';
  let badgeColor = 'fr-badge--success';

  if (!isPending) {
    badgeLabel = 'Traité';
    badgeColor = 'fr-badge--success';
  } else if (isValueChange) {
    badgeLabel = 'Mise à jour';
    badgeColor = 'fr-badge--warning';
  }

  return (
    <div
      className="fr-card fr-card--no-arrow fr-p-2w"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="fr-text--bold fr-text--lg fr-mb-0" style={{ display: 'block' }}>
            {IDENTIFIER_DISPLAY_NAMES?.[suggestion.type] ?? suggestion.type}
          </span>
          <i className="fr-card__detail fr-text--sm">
            proposé via
            {' '}
            {SOURCE_DISPLAY_NAMES?.[suggestion.sourceType] ?? suggestion.sourceType}
          </i>
        </div>
        <span
          className={`fr-badge fr-badge--sm fr-m-0 ${badgeColor}`}
        >
          {badgeLabel}
        </span>
      </div>

      {suggestion.createdAt && (
        <p className="fr-card__detail fr-text--xs fr-mb-2w fr-mt-1w">
          {new Date(suggestion.createdAt).toLocaleDateString('fr', DATE_DISPLAY_OPTIONS)}
        </p>
      )}

      <div style={{ marginTop: 'auto' }}>
        <IdentifierSuggestionUpdate
          suggestion={suggestion}
          reload={reload}
          paysageData={paysageData}
        />
      </div>
    </div>
  );
}

SuggestionCard.propTypes = {
  suggestion: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired,
  paysageData: PropTypes.object,
};

SuggestionCard.defaultProps = {
  paysageData: null,
};

export default function StructureIdentifiersUpdates({ structure, reload }) {
  const allSuggestions = Array.isArray(structure?.suggestions) ? structure.suggestions : [];

  const suggestions = allSuggestions.filter((suggestion) => {
    const currentIdentifier = getCurrentIdentifier(structure?.paysageData, suggestion.type);
    const isSameValue = currentIdentifier && normalizeValue(currentIdentifier.value) === normalizeValue(suggestion.value);
    return !isSameValue;
  });

  const lastUpdate = suggestions.map((s) => s.createdAt).sort().reverse()[0];

  const newSuggestions = suggestions
    .filter((suggestion) => suggestion.status === 'pending')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const treatedSuggestions = suggestions
    .filter((suggestion) => suggestion.status !== 'pending')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div key={structure.id}>
      {lastUpdate && (
        <p style={{ marginTop: '-1.25rem' }} className="fr-card__detail fr-mb-2w">
          Dernière suggestion repérée le
          {' '}
          {new Date(lastUpdate)?.toLocaleDateString('fr', DATE_DISPLAY_OPTIONS)}
        </p>
      )}

      {newSuggestions.length > 0 && (
        <>
          <Text bold className="fr-mb-1w">
            Nouvelles suggestions (
            {newSuggestions.length}
            )
          </Text>
          <Row gutters>
            {newSuggestions.map((suggestion) => (
              <Col key={suggestion._id ?? `${suggestion.type}-${suggestion.value}`} n="4">
                <SuggestionCard
                  suggestion={suggestion}
                  reload={reload}
                  paysageData={structure.paysageData}
                />
              </Col>
            ))}
          </Row>
        </>
      )}

      {treatedSuggestions.length > 0 && (
        <>
          <Text bold className="fr-mb-1w fr-mt-3w">
            Suggestions traitées (
            {treatedSuggestions.length}
            )
          </Text>
          <Row gutters>
            {treatedSuggestions.map((suggestion) => (
              <Col key={suggestion._id ?? `${suggestion.type}-${suggestion.value}`} n="4">
                <SuggestionCard
                  suggestion={suggestion}
                  reload={reload}
                  paysageData={structure.paysageData}
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
}

StructureIdentifiersUpdates.propTypes = {
  structure: PropTypes.object,
  reload: PropTypes.func.isRequired,
};

StructureIdentifiersUpdates.defaultProps = {
  structure: {},
};
