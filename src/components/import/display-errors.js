import { Accordion, AccordionItem, Alert, Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

function ErrorsDisplay({ responsesErrors }) {
  return (!!responsesErrors.length && (
    <Row gutters>
      <Col n="12">
        <Col n="12">
          <Alert
            description={
              responsesErrors?.length > 1
                ? `Il y a ${responsesErrors?.length} imports qui ont été échoués`
                : 'Il y a un import qui a échoué'
            }
            title="Erreur(s)"
            type="error"
          />
        </Col>
        <Accordion>
          <AccordionItem
            title={
              responsesErrors.length === 1
                ? "Voir l'import qui a echoué"
                : `Voir les ${responsesErrors.length} qui ont échoués`
            }
          >
            <Row gutters>
              <Col n="1">Ligne</Col>
              <Col n="3">Acronyme - Nom</Col>
              <Col n="5">Message</Col>
              <Col n="3">Statut</Col>
            </Row>
            {responsesErrors.sort((a, b) => a.index - b.index)
              .map((response, index) => (
                <Row gutters key={index}>
                  <Col n="1">{response.index + 2}</Col>
                  <Col n="3">{response?.usualName}</Col>
                  <Col n="5">
                    {response?.statusText?.includes('usualName')
                      ? "La structure que vous souhaitez ajouter n'a pas de nom"
                      : null}
                    {response?.statusText?.includes('should match pattern')
                      ? "Un des champs renseignés n'est pas valide, vérifiez vos informations"
                      : null}
                    {response?.statusText?.includes('does not exist')
                      ? "L'objet à lier n'existe pas"
                      : null}
                  </Col>
                  <Col n="3">{response.status}</Col>
                </Row>
              ))}
          </AccordionItem>
        </Accordion>
      </Col>
    </Row>
  )
  );
}
export default ErrorsDisplay;
ErrorsDisplay.propTypes = {
  responsesErrors: PropTypes.array,
};
ErrorsDisplay.defaultProps = {
  responsesErrors: PropTypes.array,
};
