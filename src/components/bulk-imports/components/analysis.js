import { Col, Container, Icon, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from '../../button';

export default function Analysis({ type, rows, handleForceImport }) {
  const [displayList, setDisplayList] = useState(true);
  if (!rows.length) return null;
  return (
    <Container fluid className="fr-my-3w">
      <Row>
        <Col n="12">
          <div className={`fr-notice notice-${type}`}>
            <div className="fr-container">
              <div className="fr-notice__body">
                <p className="fr-notice__title">
                  {type === 'warning' && `${rows?.length} ${type}${(rows.length > 1) ? 's' : ''}`}
                  {type === 'error' && `${rows?.length} erreur${(rows.length > 1) ? 's' : ''}`}
                  {type === 'success' && `${rows?.length} object${(rows.length > 1) ? 's' : ''} prêt${(rows.length > 1) ? 's' : ''} à l'importation`}
                </p>
                <Button
                  size="sm"
                  type="button"
                  tertiary
                  borderless
                  style={{ position: 'absolute', right: 0, top: '-3px' }}
                  icon={displayList ? 'ri-subtract-line' : 'ri-add-line'}
                  className="notice-btn--close fr-ml-auto"
                  title={displayList ? 'Réduire' : 'Afficher'}
                  onClick={() => setDisplayList(!displayList)}
                >
                  {displayList ? 'Réduire' : 'Afficher'}
                </Button>
              </div>
            </div>
          </div>
        </Col>
        {displayList && (
          <Col n="12">
            <div className="fr-table fr-table--bordered">
              <table style={{ display: 'table', width: '100%' }}>
                <thead>
                  <tr>
                    <th scope="col">Index</th>
                    <th scope="col">Nom</th>
                    <th scope="col" className="fr-mr-auto">Description</th>
                    {(type === 'warning') && (<th scope="col">Action</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows?.map(
                    (row) => (
                      <tr key={row.index}>
                        <td>{row.index}</td>
                        <td>{row.displayName}</td>
                        <td>
                          <ul style={{ listStyle: 'armenian' }}>
                            {(row?.warning && row.warning.length) && row.warning.map((item) => (
                              <li>
                                <Icon size="1x" name="ri-error-warning-line" />
                                {item?.message}
                              </li>
                            ))}
                            {(row?.error && row.error.length) && row.error.map((item) => (
                              <li>
                                <Icon size="1x" name="ri-error-warning-line" />
                                {item?.message}
                              </li>
                            ))}
                            {(!row?.error?.length && !row?.warning?.length) && (<li>L'objet est prêt à l'importation</li>)}
                          </ul>
                        </td>
                        {(type === 'warning') && (
                          <td>
                            <Button
                              secondary
                              color="error"
                              onClick={() => handleForceImport(row.index)}
                              size="sm"
                            >
                              Forcer l'ajout
                            </Button>
                          </td>
                        )}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

          </Col>
        )}
      </Row>
    </Container>
  );
}

Analysis.propTypes = {
  type: PropTypes.oneOf(['error', 'warning', 'success']).isRequired,
  rows: PropTypes.array,
  handleForceImport: PropTypes.func,
};

Analysis.defaultProps = {
  rows: [],
  handleForceImport: PropTypes.func,
};
