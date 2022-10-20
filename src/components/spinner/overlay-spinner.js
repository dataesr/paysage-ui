import PropTypes from 'prop-types';
import { Row, Text } from '@dataesr/react-dsfr';
import Spinner from '.';

export default function OverlaySpinner({ text }) {
  return (
    <Row alignItems="center" justifyContent="middle" className="overlay">
      <Spinner />
      {text && <Text size="lead" bold>{text}</Text>}
    </Row>
  );
}
OverlaySpinner.defaultProps = {
  text: null,
};
OverlaySpinner.propTypes = {
  text: PropTypes.string,
};
