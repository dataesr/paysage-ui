import PropTypes from 'prop-types';
import { Icon } from '@dataesr/react-dsfr';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

export default function GoToCard({ title, to }) {
  return (
    <div className={`fr-card fr-enlarge-link fr-card--xs ${styles['blue-border']}`}>
      <div className="fr-card__body">
        <div className="fr-card__content flex-row flex--center flex--space-around">

          <Link to={to} type="button" className="fr-link fr-text--lg">
            <Icon name="ri-eye-line" size="2x" color="inherit" />
            {title}
          </Link>
        </div>
      </div>
    </div>
  );
}
GoToCard.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};
