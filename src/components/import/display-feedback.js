import React from 'react';
import { Row, Col, Alert, Accordion, AccordionItem, Link } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

function FeedbackDisplay({ feedBack }) {
  return (!!feedBack.length && (
    <Row gutters>
      <Col n="12">
        <Col n="12">
          <Alert
            description={
              feedBack?.length > 1
                ? `Il y a ${feedBack?.length} structures qui ont été importées`
                : 'Il y a une structure qui a été importée'
            }
            title="Feedback"
            type="success"
          />
        </Col>
        <Accordion>
          <AccordionItem title="Voir les structures qui ont été importées">
            <Row gutters>
              <Col n="1">Ligne</Col>
              <Col n="2">Acronyme - Nom</Col>
              <Col n="2">Id Paysage</Col>
              <Col n="1">Parent</Col>
              <Col n="3">Catégorie</Col>
              <Col n="3">Catégorie Juri</Col>
            </Row>
            {feedBack
              .sort((a, b) => a.index - b.index)
              .map((response, index) => (
                <Row gutters key={index}>
                  <Col n="1">{response.index + 2}</Col>
                  <Col n="2">
                    <span>
                      {response?.data?.acronymFr}
                      {response?.data?.acronymFr && ' - '}
                      {response?.data?.shortName}
                      {response?.data?.shortName && ' - '}
                      {response?.data?.currentName?.usualName}
                    </span>
                  </Col>
                  <Col n="2">
                    <Link
                      target="_blank"
                      href={`/structures/${response?.data?.id}`}
                    >
                      {response?.data?.id}
                    </Link>
                  </Col>
                  {response['structure-interne'] ? (
                    <Col n="1">
                      <Link
                        target="_blank"
                        href={`/structures/${response['structure-interne']?.resourceId}`}
                      >
                        {response['structure-interne']?.resourceId}
                      </Link>
                    </Col>
                  ) : (
                    <Col n="1"> </Col>
                  )}
                  {response['structure-categorie'] ? (
                    <Col n="3">
                      <Link
                        target="_blank"
                        href={`/categories/${response['structure-categorie']?.relatedObject?.id}`}
                      >
                        {
                          response['structure-categorie']?.relatedObject
                            ?.usualNameFr
                        }
                        (
                        {response['structure-categorie']?.relatedObject?.id}
                        )
                      </Link>
                    </Col>
                  ) : (
                    <Col n="3"> </Col>
                  )}
                  {response['structure-categorie-juridique'] ? (
                    <Col n="3">
                      <Link
                        target="_blank"
                        href={`/legal-categories/${response['structure-categorie-juridique']?.relatedObject?.id}`}
                      >
                        {
                          response['structure-categorie-juridique']?.relatedObject
                            ?.longNameFr
                        }
                      </Link>
                    </Col>
                  ) : (
                    <Col n="3"> </Col>
                  )}
                </Row>
              ))}
          </AccordionItem>
        </Accordion>
      </Col>
    </Row>
  )
  );
}
export default FeedbackDisplay;
FeedbackDisplay.propTypes = {
  feedBack: PropTypes.array,
};
FeedbackDisplay.defaultProps = {
  feedBack: PropTypes.array,
};
