import { Col } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '../button';
import Card from '.';
import EmptySection from '../sections/empty';

export default function ExpendableListCards({ apiObject, list, max, nCol, order, sortOn }) {
  const [showAll, setShowAll] = useState(false);

  if (list.length === 0) return <EmptySection apiObject={apiObject} />;

  function getPath(path, obj) {
    if (path) {
      return path.split('.').reduce((a, b) => a && a[b], obj);
    }
    return obj;
  }

  const displayedCards = [];
  const hiddenCards = [];
  list.forEach((card) => {
    if (order.includes(getPath(sortOn, card))) {
      displayedCards.unshift(card);
    } else {
      hiddenCards.push(card);
    }
  });
  displayedCards.sort((a, b) => order.indexOf(getPath(sortOn, a)) - order.indexOf(getPath(sortOn, b)));
  const cards = [...displayedCards, ...hiddenCards];

  if (cards.length <= max) {
    return cards.map((el) => (
      <Col n={nCol} key={uuidv4()} className="fr-p-1w">
        {el}
      </Col>
    ));
  }
  if (!showAll) {
    return (
      <>
        {cards.slice(0, max - 1).map((el) => (
          <Col n={nCol} key={uuidv4()} className="fr-p-1w">
            {el}
          </Col>
        ))}
        <Col n={nCol} className="fr-p-1w">
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
      </>
    );
  }
  return (
    <>
      {cards.map((el) => (
        <Col n={nCol} key={uuidv4()} className="fr-p-1w">
          {el}
        </Col>
      ))}
      <Col n={nCol} className="fr-p-1w">
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
    </>
  );
}

ExpendableListCards.propTypes = {
  apiObject: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.element).isRequired,
  max: PropTypes.number,
  nCol: PropTypes.string,
  order: PropTypes.arrayOf(PropTypes.string),
  sortOn: PropTypes.string,
};

ExpendableListCards.defaultProps = {
  apiObject: '',
  max: 6,
  nCol: '12 md-4',
  order: [],
  sortOn: null,
};
