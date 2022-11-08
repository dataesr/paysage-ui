import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import './spinner.scss';

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
  /**
   * Styled-system size generated width=height=props.size
   */
  size: PropTypes.number,
};

Spinner.defaultProps = {
  size: 48,
};

export default Spinner;
