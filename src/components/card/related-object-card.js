import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import styles from './styles.module.scss';

export default function RelatedObjectCard({ relatedObject }) {
  return (
    <div className="fr-card fr-card--sm fr-card--shadow">
      <div className={`fr-card__body ${styles['card-body']} ${styles[`${relatedObject.collection}-border`]}`}>
        <div className="fr-card__content">
          <p className={`fr-card__title ${styles[`${relatedObject.collection}-title`]}`}>
            <RouterLink to={relatedObject.href}>{relatedObject.displayName}</RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
}

RelatedObjectCard.propTypes = {
  relatedObject: PropTypes.shape.isRequired,
};
