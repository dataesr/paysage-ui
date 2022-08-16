import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Text, Row, Icon, Container } from '@dataesr/react-dsfr';
import usePausableTimer from '../../hooks/usePausableTimer';

import styles from './styles.module.scss';

// Toast component
// ==============================
function Toast({
  id,
  content,
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
      className={styles.toast}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className={`${styles['colored-box']} ${styles[toastType]}`}>
        <Icon color="#fff" name={icon[toastType]} />
        {
          (autoDismissAfter !== 0)
            ? (<div className={styles['progress-bar']} paused={paused} />)
            : null
        }
      </div>
      <Container fluid className={styles['toast-content']} role="alert">
        <Row>
          <Text bold spacing="mb-1w">
            {content}
          </Text>
          <Button
            hasBorder={false}
            onClick={() => remove(id)}
            className={styles.close}
          >
            <Icon color="var(--grey-50-1000)" size="md" name="ri-close-line" />
          </Button>
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
  content: PropTypes.string,
  description: PropTypes.string,
  autoDismiss: PropTypes.bool,
  remove: PropTypes.func,
  toastType: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
};

Toast.defaultProps = {
  content: '',
  description: null,
  autoDismiss: true,
  remove: () => { },
  toastType: 'success',
};

export default Toast;
