import { Text, Link } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import useEditMode from '../../hooks/useEditMode';
import { formatDescriptionDates, toString } from '../../utils/dates';
import Button from '../button';
import styles from './styles.module.scss';

export default function RelationCard({ relation, inverse, onEdit }) {
  const { editMode } = useEditMode();
  const color = inverse ? relation.resource.collection : relation.relatedObject.collection;
  return (
    <div className="fr-card fr-card--sm fr-card--shadow">
      <div className={`fr-card__body ${styles['card-body']} ${styles[`${color}-border`]}`}>
        <div className="fr-card__content">
          <div className="fr-card__desc">
            <Text as="span" bold>{relation.relationType?.name || 'Appartient à la liste'}</Text>
            {' '}
            {formatDescriptionDates(relation.startDate || null, relation.endDate || null)}
          </div>
          <p className={`fr-card__title ${styles[`${color}-title`]}`}>
            {inverse
              ? <RouterLink to={relation.resource.href}>{relation.resource?.displayName}</RouterLink>
              : <RouterLink to={relation.relatedObject.href}>{relation.relatedObject?.displayName}</RouterLink>}
          </p>
          {(relation.startDateOfficialText?.id || relation.endDateOfficialText?.id) && (
            <div className={`fr-card__end ${styles['card-end']}`}>
              {relation.startDateOfficialText?.id && (
                <Link className="fr-card__detail" href={relation.startDateOfficialText?.pageUrl} target="_blank">
                  {relation.startDateOfficialText?.nature}
                  {' '}
                  {relation.startDateOfficialText?.publicationDate && `du ${toString(relation.startDateOfficialText.publicationDate)}` }
                </Link>
              )}
              {relation.endDateOfficialText?.id && (
                <Link className="fr-card__detail" href={relation.endDateOfficialText?.pageUrl} target="_blank">
                  {relation.endDateOfficialText?.nature}
                  {' '}
                  {relation.endDateOfficialText?.publicationDate && `du ${toString(relation.endDateOfficialText.publicationDate)}` }
                </Link>
              )}
            </div>
          )}
          {editMode && <Button size="md" onClick={onEdit} tertiary borderless rounded icon="ri-edit-line" className={styles['edit-button']} />}
        </div>
      </div>
    </div>
  );
}

RelationCard.propTypes = {
  relation: PropTypes.shape.isRequired,
  onEdit: PropTypes.func,
  inverse: PropTypes.bool,
};

RelationCard.defaultProps = {
  inverse: false,
  onEdit: null,
};
