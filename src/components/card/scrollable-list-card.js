import { Col } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

export default function ScrollableListCards({ cards, nCol, height }) {
  if (!cards.length) return null;
  return (
    <div
      style={{ height, overflow: 'scroll' }}
      className="fr-grid-row fr-grid-row--gutters"
    >
      {cards.map((el, i) => (
        <Col n={nCol} key={i}>
          {el}
        </Col>
      ))}
    </div>
  );
}

ScrollableListCards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.element).isRequired,
  nCol: PropTypes.string,
  height: PropTypes.string,
};

ScrollableListCards.defaultProps = {
  nCol: '12 md-4',
  height: '300px',
};
