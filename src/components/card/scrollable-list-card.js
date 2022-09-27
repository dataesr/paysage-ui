import { Col } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

export default function ScrallableListCards({ cards, nCol, height }) {
  if (!cards.length) return null;
  return (
    <div
      style={{ height, overflow: 'scroll' }}
      className="fr-grid-row fr-grid-row--gutters"
    >
      {cards.map((el) => (
        <Col n={nCol} key={uuidv4()}>
          {el}
        </Col>
      ))}
    </div>
  );
}

ScrallableListCards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.element).isRequired,
  nCol: PropTypes.string,
  height: PropTypes.string,
};

ScrallableListCards.defaultProps = {
  nCol: '12 md-4',
  height: '300px',
};
