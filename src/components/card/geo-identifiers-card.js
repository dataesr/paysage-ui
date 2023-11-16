import React from 'react';
import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import KeyValueCard from './key-value-card';

export default function IdentifierCard({ wikidata, originalId }) {
  const data = [];
  if (wikidata) {
    data.push({ cardKey: 'Wikidata', cardValue: wikidata });
  }
  if (originalId) {
    data.push({ cardKey: 'Code géographique', cardValue: originalId });
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <Row gutters>
      {data.map(({ cardKey, cardValue }, index) => (
        <Col key={index} n="12 md-3">
          <KeyValueCard
            cardKey={cardKey}
            cardValue={cardValue}
            copy
            className="card-geographical-categories"
            icon="ri-fingerprint-2-line"
          />
        </Col>
      ))}
    </Row>
  );
}

IdentifierCard.propTypes = {
  wikidata: PropTypes.string.isRequired,
  originalId: PropTypes.string.isRequired,
};
