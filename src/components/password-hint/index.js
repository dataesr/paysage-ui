import PropTypes from 'prop-types';
import { Text, Icon } from '@dataesr/react-dsfr';
import styles from './styles.module.scss';

export default function PasswordHint({ display, hint }) {
  const icon = {
    info: 'ri-information-fill',
    success: 'ri-checkbox-circle-fill',
    error: 'ri-close-circle-fill',
  };
  return (
    <Text
      className={styles[`fr-password-${display}`]}
      size="xs"
    >
      <Icon
        color={`var(--${display}-main-525)`}
        size="lg"
        name={icon[display]}
      >
        {hint}
      </Icon>
    </Text>
  );
}

PasswordHint.propTypes = {
  hint: PropTypes.string.isRequired,
  display: PropTypes.oneOf(['error', 'info', 'success']).isRequired,
};
