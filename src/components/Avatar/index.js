import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Text } from '@dataesr/react-dsfr';
import styles from './avatar.module.scss';

/**
 * Avatar component.
 */
export default function Avatar({ src, name, size, ...rest }) {
  const [error, setError] = useState(false);
  return (
    <div className={`${styles['avatar-box']} fr-m-2w`} style={{ width: size, height: size }} {...rest}>
      {
        (error)
          ? (<Text size="lead">{(name) ? name.slice(0, 2).toUpperCase() : ''}</Text>)
          : (<img alt="avatar" className={styles['avatar-img']} src={src} onError={() => setError(true)} />)
      }
    </div>
  );
}

Avatar.propTypes = {
  /**
   * The source url of the avatar image
   */
  src: PropTypes.string,
  /**
   * A string that is sliced to generage letters to show
   * if no image is provided or image failed loading
   */
  name: PropTypes.string,
  /**
   * Any color provided by the theme. Fallback to string if color is not found.
   */
  /**
   * size: width=height=props.size
   */
  size: PropTypes.number,
};

Avatar.defaultProps = {
  src: '',
  name: null,
  size: 32,
};
