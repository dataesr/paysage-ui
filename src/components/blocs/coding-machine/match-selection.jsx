import { Badge, Col, Radio, Row, Text } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { formatMatchInfo } from './formatters';

function MatchSelection({
  matches,
  rowIndex,
  selectedMatches,
  onMatchSelection,
}) {
  const getBackgroundColor = (match) => {
    if (match.hasMatchingId) return 'var(--green-emeraude-925)';
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
              backgroundColor: getBackgroundColor(match),
            }}
          >
            <Radio
              label={(
                <Row>
                  <div>
                    {match.isAlternative && (
                      <div>
                        <Badge
                          type="info"
                          text={match.name}
                        />
                      </div>
                    )}
                    {match.hasMatchingId && (
                      <Col>
                        {match.matchingIdentifiers
                          && match.matchingIdentifiers.length > 0 ? (
                            <Row>
                              <Text size="sm" bold>

                                {match.matchingIdentifiers.length > 1
                                  ? `${match.matchingIdentifiers.length} correspondances d'identifiants trouvées:`
                                  : "Correspondance d'identifiant trouvée:"}
                              </Text>
                              {match.matchingIdentifiers.map(
                                (identifier, idx) => (
                                  <div key={idx}>
                                    <Badge
                                      type="success"
                                      text={`${identifier.fieldName}: ${identifier.value}`}
                                    />
                                    {identifier.apiValue !== identifier.value && (
                                      <Text size="sm">
                                        (correspond à:
                                        {' '}
                                        {identifier.apiValue}
                                        )
                                      </Text>
                                    )}
                                  </div>
                                ),
                              )}
                            </Row>
                          ) : (
                            <Badge
                              type="success"
                              text={`Correspondance d'identifiant: ${
                                match.matchingIdentifier?.value || ''
                              }`}
                            />
                          )}
                      </Col>
                    )}
                    <strong>{match.name}</strong>

                    <Text size="sm">
                      ID Paysage:
                      {' '}
                      {match.id}
                      {' '}
                      | Score:
                      {' '}
                      {' '}
                      {Math.round(match.score) > 200 ? (
                        <span style={{ color: '#FFD700', fontWeight: 'bold' }}>
                          {Math.round(match.score)}
                        </span>
                      ) : (
                      `${Math.round(match.score)} | `
                      )}
                      {match.hasMatchingId}
                      {formatMatchInfo(match)}
                    </Text>
                  </div>
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
