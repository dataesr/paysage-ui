import { Text, TagGroup, Tag, Icon, Badge } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';

export default function RelationAssociatedCard({ relation }) {
  const navigate = useNavigate();
  return (
    <div className="fr-card fr-card--xs fr-card--grey fr-card--no-border">
      <div className={`fr-card__body ${styles['card-body']} ${styles[`${relation?.relatedObject?.collection}-border`]}`}>
        <div className="fr-card__content">
          <p className="fr-card__desc">
            {(relation.startDate) && <Badge text={relation.startDate?.split('-')?.[0] || 'Date inconnue'} />}
            <br />
            <RouterLink className="fr-text" to={relation?.resource?.href}>
              {relation?.resource?.displayName}
              <Icon iconPosition="right" name="ri-arrow-right-line" />
            </RouterLink>
            <br />
            {relation?.laureatePrecision && ` ${relation?.laureatePrecision}`}
            {' '}
          </p>
          {(relation.otherAssociatedObjects?.length > 0) && (
            <div className="fr-card__desc">
              <Text as="span" size="sm" bold>Structures associées:</Text>
              <TagGroup>
                {relation.otherAssociatedObjects.map(
                  (related) => <Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>,
                )}
              </TagGroup>
            </div>
          )}
          <p className={`fr-card__title ${styles[`${relation?.relatedObject.collection}-title`]}`}>
            <RouterLink className="fr-text--lg" to={relation?.relatedObject?.href}>
              {relation?.relatedObject?.displayName}
              <Icon iconPosition="right" name="ri-arrow-right-line" />
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
}

RelationAssociatedCard.propTypes = {
  relation: PropTypes.shape.isRequired,
};
