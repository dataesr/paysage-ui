import { Text, Link, TagGroup, Tag, Icon, Badge } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useEditMode from '../../hooks/useEditMode';
import { formatDescriptionDates, toString } from '../../utils/dates';
import Button from '../button';
import styles from './styles.module.scss';

function getRelationTypeLabel(gender = null) {
  switch (gender) {
  case 'Femme':
    return 'feminineName';
  case 'Homme':
    return 'maleName';
  default:
    return 'name';
  }
}

export default function RelationCard({ relation, inverse, onEdit }) {
  const navigate = useNavigate();
  const { editMode } = useEditMode();
  const toPrintRelation = inverse ? relation.resource : relation.relatedObject;
  return (
    <div className="fr-card fr-card--xs fr-card--grey fr-card--no-border">
      <div className={`fr-card__body ${styles['card-body']} ${styles[`${toPrintRelation.collection}-border`]} ${((relation.current !== undefined) && !relation.current) && 'turngrey'}`}>
        <div className="fr-card__content">
          <p className="fr-card__desc">
            {relation.relationType && (
              <Text as="span" bold>
                {relation.relationType?.[getRelationTypeLabel(relation?.relatedObject?.gender)] || relation.relationType?.name}
              </Text>
            )}
            {' '}
            {formatDescriptionDates(relation.startDate || null, relation.endDate || null)}
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
          <p className={`fr-card__title ${styles[`${toPrintRelation.collection}-title`]}`}>
            <RouterLink className="fr-text--lg" to={toPrintRelation?.href}>{toPrintRelation?.displayName}</RouterLink>
          </p>
          {((relation.current !== undefined) && !relation.current) && (
            <div className={`fr-card__start ${styles['card-end']}`}>
              <Badge text="terminé" />
            </div>
          )}
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
          {relation.mandateEmail && (
            <div className={`fr-card__end ${styles['card-end']}`}>
              <p className="fr-card__detail">
                <Icon name="ri-mail-line" size="1x" />
                {relation.mandateEmail}
              </p>
            </div>
          )}
          {(editMode && onEdit) && <Button size="md" onClick={onEdit} tertiary borderless rounded icon="ri-edit-line" className={styles['edit-button']} />}
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
