import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import './spinner.scss';
import { Row, Text } from '@dataesr/react-dsfr';

function Spinner({ size }) {
  const id = useMemo(() => uuidv4(), []);
  useEffect(() => {
    document.getElementById(id).style.setProperty('width', `${size}px`);
    document.getElementById(id).style.setProperty('height', `${size}px`);
  }, [size, id]);

  return (
    <svg id={id} className="spinner" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle className="internal-circle" cx="60" cy="60" r="30" />
      <circle className="external-circle" cx="60" cy="60" r="50" />
    </svg>
  );
}
Spinner.propTypes = {
  size: PropTypes.number,
};
Spinner.defaultProps = {
  size: 48,
};

function OverlaySpinner({ text, size }) {
  return (
    <Row alignItems="center" justifyContent="middle" className="spinner-overlay">
      <Spinner size={size} />
      {text && <Text size="lead" bold>{text}</Text>}
    </Row>
  );
}
OverlaySpinner.propTypes = {
  size: PropTypes.number,
  text: PropTypes.string,
};
OverlaySpinner.defaultProps = {
  text: null,
  size: 48,
};

function PageSpinner({ size }) {
  return <Row className="fr-my-2w flex--space-around"><Spinner size={size} /></Row>;
}
PageSpinner.propTypes = {
  size: PropTypes.number,
};

PageSpinner.defaultProps = {
  size: 48,
};

export { Spinner, OverlaySpinner, PageSpinner };
