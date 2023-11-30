import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import GoToCard from './go-to-card';
import useUrl from '../../hooks/useUrl';

function ExpandCard() {
  const { id } = useUrl();
  return (
    <GoToCard
      to={`/categories-geographiques/${id}/elements-lies`}
      title="Voir plus"
    />
  );
}

export default function GoToExpendableListCards({
  list,
  max,
  nCol,
  order,
  sortOn,
}) {
  const [showAll, setShowAll] = useState(false);

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

  displayedCards.sort(
    (a, b) => order.indexOf(getPath(sortOn, a)) - order.indexOf(getPath(sortOn, b)),
  );
  const cards = [...displayedCards, ...hiddenCards];

  if (cards.length <= max) {
    return (
      <Row gutters>
        {cards.map((el, i) => (
          <Col n={nCol} key={i}>
            {el}
          </Col>
        ))}
      </Row>
    );
  }
  return (
    <Row gutters>
      {!showAll && cards.slice(0, max - 1).map((el, i) => (
        <Col n={nCol} key={i}>
          {el}
        </Col>
      ))}
      {showAll && cards.map((el, i) => (
        <Col n={nCol} key={i}>
          {el}
        </Col>
      ))}
      <Col n={nCol}>
        <ExpandCard isExpanded={showAll} toggle={() => setShowAll(!showAll)} />
      </Col>
    </Row>
  );
}

GoToExpendableListCards.propTypes = {
  list: PropTypes.arrayOf(PropTypes.element).isRequired,
  max: PropTypes.number,
  nCol: PropTypes.string,
  order: PropTypes.arrayOf(PropTypes.string),
  sortOn: PropTypes.string,
};

GoToExpendableListCards.defaultProps = {
  max: 6,
  nCol: '12 md-4',
  order: [],
  sortOn: null,
};
