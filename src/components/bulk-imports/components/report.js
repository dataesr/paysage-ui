import { Col, Container, Icon, Link, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from '../../button';

export default function Report({ type, rows }) {
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
                  {type === 'error' && `${rows?.length} erreur${(rows.length > 1) ? 's' : ''}`}
                  {type === 'success' && `${rows?.length} objet${(rows.length > 1) ? 's' : ''} importé${(rows.length > 1) ? 's' : ''}`}
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
                  {displayList ? 'Masquer les détails' : 'Afficher les détails'}
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
                  </tr>
                </thead>
                <tbody>
                  {rows?.map(
                    (row) => (
                      <tr key={row.index}>
                        <td>{row.index}</td>
                        <td>{row.displayName}</td>
                        <td>
                          <ul>
                            {((row?.imports?.status === 'error') && row.imports.error?.length > 0) && row.imports.error.map((item, i) => (
                              <li key={i}>
                                <Icon size="1x" name="ri-error-warning-line" color="var(--background-action-high-error)" />
                                {item?.message}
                              </li>
                            ))}
                            {(row?.imports?.status === 'imported') && (
                              <li>
                                L'objet à été importé avec succes
                                {row.imports?.href && ' '}
                                {row.imports?.href && <Link target="_blank" href={row.imports.href}>Voir</Link>}
                              </li>
                            )}
                          </ul>
                        </td>
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

Report.propTypes = {
  type: PropTypes.oneOf(['error', 'success']).isRequired,
  rows: PropTypes.array,
};

Report.defaultProps = {
  rows: [],
};
