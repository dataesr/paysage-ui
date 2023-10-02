import PropTypes from 'prop-types';
import { Icon } from '@dataesr/react-dsfr';

import { Link as RouterLink } from 'react-router-dom';
import styles from './styles.module.scss';

export default function GeoRelationCard({ element }) {
  return (
    <div className="fr-card fr-card--xs fr-card--grey fr-card--no-border">
      <div className={`fr-card__body ${styles['card-body']} ${styles['geographical-categories-border']}`}>
        <div className="fr-card__content">
          <p className={`fr-card__title ${styles[`${'geographical-categories'}-title`]}`}>
            <RouterLink to={`/geographical-categories/${element?.id}`} className="fr-text--xl">
              {element?.nameFr}
              <Icon iconPosition="right" name="ri-arrow-right-line" />
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
}

GeoRelationCard.propTypes = {
  element: PropTypes.array,
};

GeoRelationCard.defaultProps = {
  element: PropTypes.array,
};
