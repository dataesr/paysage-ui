import { Badge, Col, Radio, Row, Text } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { formatMatchInfo } from './formatters';

function MatchSelection({ matches, rowIndex, selectedMatches, onMatchSelection }) {
  const getBackgroundColor = (match) => {
    if (match.hasMatchingId) return 'var(--green-emeraude-975)';
    if (match.isAlternative) return 'var(--blue-france-950-125)';
    return 'transparent';
  };

  return (
    <fieldset className="fr-fieldset">
      <Text bold className="fr-mb-1w">
        Sélectionnez la correspondance
      </Text>
      <div>
        {matches.map((match) => (
          <div
            key={match.id}
            style={{
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: getBackgroundColor(match),
            }}
          >
            <Radio
              label={(
                <Row gutters>
                  <Col n="12">
                    <strong>
                      {match.name}
                    </strong>
                    {match.isAlternative && (
                      <div>
                        <Badge
                          type="info"
                          text="RÉSULTAT DE RECHERCHE PERSONNALISÉE"
                        />
                      </div>
                    )}
                    {match.hasMatchingId && (
                      <div>
                        {match.matchingIdentifiers && match.matchingIdentifiers.length > 0 ? (
                          <>
                            <Text size="sm" bold className="fr-mb-1w">
                              {match.matchingIdentifiers.length > 1
                                ? `${match.matchingIdentifiers.length} correspondances d'identifiants trouvées:`
                                : "Correspondance d'identifiant trouvée:"}
                            </Text>
                            {match.matchingIdentifiers.map((identifier, idx) => (
                              <div key={idx} className="fr-mb-1w">
                                <Badge
                                  type="success"
                                  text={`${identifier.fieldName}: ${identifier.value}`}
                                />
                                {identifier.apiValue !== identifier.value && (
                                  <Text size="sm" className="fr-ml-1w" style={{ display: 'inline-block' }}>
                                    (correspond à:
                                    {' '}
                                    {identifier.apiValue}
                                    )
                                  </Text>
                                )}
                              </div>
                            ))}
                          </>
                        ) : (
                          <Badge
                            type="success"
                            text={`Correspondance d'identifiant: ${match.matchingIdentifier?.value || ''}`}
                          />
                        )}
                      </div>
                    )}
                  </Col>
                  <Col n="12">
                    <Text size="sm">
                      ID Paysage:
                      {' '}
                      {match.id}
                      {' '}
                      | Score:
                      {' '}
                      {Math.round(match.score) > 200 ? (
                        <span style={{ color: '#FFD700', fontWeight: 'bold' }}>
                          {Math.round(match.score)}
                        </span>
                      ) : (
                        Math.round(match.score)
                      )}
                      {match.hasMatchingId
    && ` (+100 pour ${match.matchingIdentifiers?.length || 1} correspondance(s) d'identifiant)`}
                    </Text>
                  </Col>
                  <Col n="12">
                    {formatMatchInfo(match)}
                    {match.identifiers && (
                      <div>
                        <Text size="sm">
                          <strong>Identifiants de l'objet dans paysage:</strong>
                          {' '}
                          {match.identifiers}
                          {!match.hasMatchingId && (
                            <span style={{ color: '#666', fontStyle: 'italic' }}> (aucun n'a matché)</span>
                          )}
                        </Text>
                      </div>
                    )}
                  </Col>
                </Row>
              )}
              value={match.id}
              checked={selectedMatches[rowIndex] === match.id}
              onChange={() => onMatchSelection(rowIndex, match.id)}
              name={`match-${rowIndex}`}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}

MatchSelection.propTypes = {
  matches: PropTypes.array.isRequired,
  rowIndex: PropTypes.number.isRequired,
  selectedMatches: PropTypes.object.isRequired,
  onMatchSelection: PropTypes.func.isRequired,
};

export default MatchSelection;
