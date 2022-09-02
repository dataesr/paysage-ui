import { Button, Col } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Card from '.';
import EmptySection from '../sections/empty';

export default function ExpendableListCards({ apiObject, list, max, nCol }) {
  const [showAll, setShowAll] = useState(false);

  if (list.length === 0) return <EmptySection apiObject={apiObject} />;
  if (list.length <= max) {
    return list.map((el) => (
      <Col n={nCol} key={uuidv4()} className="fr-p-1w">
        {el}
      </Col>
    ));
  }
  if (!showAll) {
    return (
      <>
        {list.slice(0, max - 1).map((el) => (
          <Col n={nCol} key={uuidv4()} className="fr-p-1w">
            {el}
          </Col>
        ))}
        <Col n={nCol} className="fr-p-1w">
          <Card
            descriptionElement={(
              <Button
                tertiary
                onClick={() => setShowAll(!showAll)}
                hasBorder={false}
                icon="ri-eye-line"
              >
                Afficher tout
              </Button>
            )}
          />
        </Col>
      </>
    );
  }
  return (
    <>
      {list.map((el) => (
        <Col n={nCol} key={uuidv4()} className="fr-p-1w">
          {el}
        </Col>
      ))}
      <Col n={nCol} className="fr-p-1w">
        <Card
          descriptionElement={(
            <Button
              tertiary
              onClick={() => setShowAll(!showAll)}
              hasBorder={false}
              icon="ri-eye-off-line"
            >
              Réduire la liste
            </Button>
          )}
        />
      </Col>
    </>
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
