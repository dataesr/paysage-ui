import React from 'react';
import { Row, Col, Alert, Accordion, AccordionItem, Link } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import FormFooter from '../forms/form-footer';
import { Spinner } from '../spinner';

function ReadyToImport({ readyToImport, handleUploadClick, isLoading }) {
  return (!!readyToImport.length && (
    <Row gutters>
      <Col n="12">
        <Col n="12">
          <Alert
            description={
              readyToImport.length > 1
                ? `Il y a ${readyToImport?.length} structures qui sont prêtes à être ajoutées`
                : 'Il y a une structure qui est prête à être ajoutée'
            }
            title="Validation"
            type="info"
          />
        </Col>
        <Accordion>
          <AccordionItem
            title={
              readyToImport.length === 1
                ? "Voir et valider l'import de cette structure"
                : `Voir et valider l'import des ${readyToImport.length} prêtes à être importées`
            }
          >
            <Col n="12">
              <Row gutters key="headers">
                <Col n="1">Ligne</Col>
                <Col n="2">Nom de la structure</Col>
                <Col n="1">Statut</Col>
                <Col n="2">Siret</Col>
                <Col n="2">Twitter</Col>
                <Col n="1">Parent</Col>
                <Col n="1">Catégorie</Col>
              </Row>
              {readyToImport
                ?.sort((a, b) => a.index - b.index)
                .map((response, index) => (
                  <Row gutters key={index}>
                    <Col n="1">{response.index + 2}</Col>
                    <Col n="2">{response?.structure.usualName}</Col>
                    <Col n="1">{response?.structure.structureStatus}</Col>
                    {response?.structure?.siret ? (
                      <Col n="2">{response?.structure?.siret}</Col>
                    ) : (
                      <Col n="2"> </Col>
                    )}
                    {response?.structure?.twitter ? (
                      <Col n="2">
                        {response?.structure?.twitter?.replace('https://', '')}
                      </Col>
                    ) : (
                      <Col n="2"> </Col>
                    )}
                    {response?.structure?.parent ? (
                      <Col n="1">
                        <Link
                          target="_blank"
                          href={`/structures/${response?.structure?.parent}`}
                        >
                          {response?.structure?.parent}
                        </Link>
                      </Col>
                    ) : (
                      <Col n="1"> </Col>
                    )}
                    {response?.structure?.categories[0] ? (
                      <Col n="1">
                        <Link
                          target="_blank"
                          href={`/categories/${response?.structure?.categories[0]}`}
                        >
                          {response?.structure?.categories[0]}
                        </Link>
                      </Col>
                    ) : (
                      <Col n="1"> </Col>
                    )}
                  </Row>
                ))}
              <FormFooter
                buttonLabel={
                  readyToImport.length === 1
                    ? 'Importer cette structure'
                    : `Importer ces ${readyToImport.length} structures`
                }
                onSaveHandler={handleUploadClick}
              >
                {isLoading ? (
                  <Row className="fr-my-2w flex--space-around">
                    <Spinner />
                  </Row>
                ) : null}
              </FormFooter>
            </Col>
          </AccordionItem>
        </Accordion>
      </Col>
    </Row>
  )
  );
}
export default ReadyToImport;
ReadyToImport.propTypes = {
  readyToImport: PropTypes.array,
  handleUploadClick: PropTypes.func,
  isLoading: PropTypes.func,

};
ReadyToImport.defaultProps = {
  readyToImport: PropTypes.array,
  handleUploadClick: PropTypes.func,
  isLoading: PropTypes.func,

};
