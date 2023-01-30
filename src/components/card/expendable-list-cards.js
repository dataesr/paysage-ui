import { Col, Icon, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './styles.module.scss';

function ExpandCard({ isExpanded, toggle }) {
  return (
    <div
      className={`fr-card fr-enlarge-link fr-card--xs ${styles['blue-border']}`}
    >
      <div className="fr-card__body">
        <div className="fr-card__content flex-row flex--center flex--space-around">
          <button
            onClick={toggle}
            type="button"
            className={`fr-link fr-text--lg  ${styles['button-full']}`}
          >
            {isExpanded ? (
              <Icon name="ri-eye-off-line" size="2x" color="inherit" />
            ) : (
              <Icon name="ri-eye-line" size="2x" color="inherit" />
            )}
            {isExpanded ? 'Réduire la liste' : 'Afficher tout'}
          </button>
        </div>
      </div>
    </div>
  );
}

ExpandCard.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default function ExpendableListCards({
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

ExpendableListCards.propTypes = {
  list: PropTypes.arrayOf(PropTypes.element).isRequired,
  max: PropTypes.number,
  nCol: PropTypes.string,
  order: PropTypes.arrayOf(PropTypes.string),
  sortOn: PropTypes.string,
};

ExpendableListCards.defaultProps = {
  max: 6,
  nCol: '12 md-4',
  order: [],
  sortOn: null,
};
