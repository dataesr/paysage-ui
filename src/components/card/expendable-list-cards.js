import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '../button';
import Card from '.';
import EmptySection from '../sections/empty';

export default function ExpendableListCards({ apiObject, list, max, nCol }) {
  const [showAll, setShowAll] = useState(false);

  if (list.length === 0) return <EmptySection apiObject={apiObject} />;
  if (list.length <= max) {
    return (
      <Row gutters>
        {list.map((el) => (
          <Col n={nCol} key={uuidv4()}>
            {el}
          </Col>
        ))}
      </Row>
    );
  }
  if (!showAll) {
    return (
      <Row gutters>
        {list.slice(0, max - 1).map((el) => (
          <Col n={nCol} key={uuidv4()}>
            {el}
          </Col>
        ))}
        <Col n={nCol}>
          <Card
            descriptionElement={(
              <Button
                tertiary
                borderless
                onClick={() => setShowAll(!showAll)}
                icon="ri-eye-line"
              >
                Afficher tout
              </Button>
            )}
          />
        </Col>
      </Row>
    );
  }
  return (
    <Row gutters>
      {list.map((el) => (
        <Col n={nCol} key={uuidv4()}>
          {el}
        </Col>
      ))}
      <Col n={nCol}>
        <Card
          descriptionElement={(
            <Button
              tertiary
              borderless
              onClick={() => setShowAll(!showAll)}
              icon="ri-eye-off-line"
            >
              Réduire la liste
            </Button>
          )}
        />
      </Col>
    </Row>
  );
}

ExpendableListCards.propTypes = {
  apiObject: PropTypes.string,
  list: PropTypes.element.isRequired,
  max: PropTypes.number,
  nCol: PropTypes.string,
};

ExpendableListCards.defaultProps = {
  apiObject: '',
  max: 6,
  nCol: '12 md-4',
};
