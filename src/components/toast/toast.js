import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, Row, Icon, Container } from '@dataesr/react-dsfr';
import usePausableTimer from '../../hooks/usePausableTimer';

import './toast.scss';

function Toast({
  id,
  title,
  description,
  toastType,
  autoDismissAfter,
  remove,
}) {
  const removeSelf = useCallback(() => {
    document.getElementById(id).style.setProperty('animation', 'toast-unmount 300ms');
    setTimeout(() => {
      remove(id);
    }, 300);
  }, [id, remove]);
  const { pause, resume } = usePausableTimer(removeSelf, autoDismissAfter);

  useEffect(() => {
    const progressBar = document.getElementById(`progress-${id}`);
    if (progressBar) {
      progressBar.style.setProperty('animation-duration', `${autoDismissAfter}ms`);
    }
  }, [id, autoDismissAfter]);

  const icon = {
    info: 'ri-information-fill',
    warning: 'ri-error-warning-fill',
    success: 'ri-checkbox-circle-fill',
    error: 'ri-close-circle-fill',
  };

  return (
    <div
      id={id}
      role="alert"
      className={`toast toast-${toastType}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="toast-colored-box">
        <Icon color="#ffffff" name={icon[toastType]} />
        {
          (autoDismissAfter !== 0)
            ? (<div id={`progress-${id}`} className="toast-progress-bar" />)
            : null
        }
      </div>
      <button
        type="button"
        onClick={() => remove(id)}
        className="toast-btn-close"
      >
        <Icon color="var(--grey-50-1000)" size="lg" name="ri-close-line" />
      </button>
      <Container fluid className="toast-content">
        <Row>
          {title && <Text bold spacing="mb-1w">{title}</Text>}
        </Row>
        <Row>
          {description && (<Text spacing="mb-2w" size="sm">{description}</Text>)}
        </Row>
      </Container>
    </div>
  );
}

Toast.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  autoDismissAfter: PropTypes.number,
  remove: PropTypes.func,
  toastType: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
};

Toast.defaultProps = {
  title: null,
  description: null,
  autoDismissAfter: 3000,
  remove: () => { },
  toastType: 'success',
};

export default Toast;
