import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Text, Row, Icon, Container } from '@dataesr/react-dsfr';
import usePausableTimer from '../../hooks/usePausableTimer';

// Toast component
// ==============================
function Toast({
  id,
  title,
  description,
  toastType,
  autoDismiss,
  remove,
}) {
  const removeSelf = useCallback(() => remove(id), [id, remove]);
  const autoDismissAfter = autoDismiss ? 4000 : 0;
  const { paused, pause, resume } = usePausableTimer(removeSelf, autoDismissAfter);

  const icon = {
    info: 'ri-information-fill',
    warning: 'ri-error-warning-fill',
    success: 'ri-checkbox-circle-fill',
    error: 'ri-close-circle-fill',
  };

  return (
    <div
      role="alert"
      className="toast"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className={`toast-colored-box toast-bg-${toastType}`}>
        <Icon color="#ffffff" name={icon[toastType]} />
        {
          (autoDismissAfter !== 0)
            ? (<div className="toast-progress-bar" paused={paused} />)
            : null
        }
      </div>
      <button
        type="button"
        hasBorder={false}
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
  autoDismiss: PropTypes.bool,
  remove: PropTypes.func,
  toastType: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
};

Toast.defaultProps = {
  title: null,
  description: null,
  autoDismiss: true,
  remove: () => { },
  toastType: 'success',
};

export default Toast;
