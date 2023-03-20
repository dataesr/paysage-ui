import { Row, Col, Alert, Accordion, AccordionItem, Link, Button } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Spinner } from '../spinner';

export default function WarningsDisplay({ warnings, handleForceImport, isLoading }) {
  return (
    <Row gutters>
      <Col n="12">
        <Col n="12">
          <Alert
            description={
              warnings.length > 1
                ? `Il y a ${warnings?.length} warnings`
                : 'Il y a un warning'
            }
            title="Warning"
            type="warning"
          />
        </Col>
        <Accordion>
          <AccordionItem
            title={
              warnings.length === 1
                ? 'Voir le warning'
                : `Voir les ${warnings.length} warnings`
            }
          >
            <Col n="12">
              <Row gutters key="headers">
                <Col n="1">Ligne</Col>
                <Col n="3">Nom de la structure</Col>
                <Col n="6">Warnings</Col>
              </Row>
              {warnings?.map(
                (response, index) => response?.newWarnings?.length > 0 && (
                  <Row gutters key={index}>
                    <Col n="1">{response.index + 2}</Col>
                    <Col n="3">
                      <span>{response?.structure?.usualName}</span>
                      {response?.duplicatedStructureId && (
                        <Col>
                          <Link
                            target="_blank"
                            href={`/structures/${response?.duplicatedStructureId}`}
                          >
                            Vérifiez
                          </Link>
                        </Col>
                      )}
                    </Col>
                    <Col n="6">
                      <span>
                        {response?.newWarnings?.map((warning, i) => {
                          const isLast = i === response.newWarnings.length - 1;
                          const hasMultipleWarnings = response.newWarnings.length > 1;
                          const separator = !isLast && (hasMultipleWarnings ? ', ' : ' ');
                          const conjunction = i === response.newWarnings.length - 2
                                  && hasMultipleWarnings
                            ? ' et '
                            : '';
                          return (
                            <>
                              {warning?.message}
                              {separator}
                              {conjunction}
                            </>
                          );
                        })}
                      </span>
                    </Col>
                    <Col>
                      <Button
                        colors={['#f55', '#fff']}
                        onClick={() => handleForceImport(response.structure, index)}
                        size="sm"
                      >
                        Forcer l'ajout de cet élément
                        {isLoading && (
                          <Row className="fr-my-2w flex--space-around">
                            <Spinner />
                          </Row>
                        )}
                      </Button>
                    </Col>
                  </Row>
                ),
              )}
            </Col>
          </AccordionItem>
        </Accordion>
      </Col>
    </Row>
  );
}

WarningsDisplay.propTypes = {
  warnings: PropTypes.array,
  handleForceImport: PropTypes.func,
  isLoading: PropTypes.func,
};

WarningsDisplay.defaultProps = {
  warnings: [],
  handleForceImport: PropTypes.func,
  isLoading: PropTypes.func,
};
