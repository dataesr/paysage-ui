import { Badge, Icon, Link, Tag, TagGroup, Text } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { formatDescriptionDatesForMandateAndPrizes, getComparableNow, toString } from '../../utils/dates';
import getRelationTypeLabelKey from '../../utils/get-relation-type-key';
import { capitalize } from '../../utils/strings';
import CopyButton from '../copy/copy-button';
import styles from './styles.module.scss';

export default function RelationCardTwoSided({ relation }) {
  const navigate = useNavigate();
  const isComming = relation.startDate > getComparableNow();
  const interimMandate = relation.mandateTemporary ? ' par intérim ' : '';
  const isFinished = ((relation.current !== undefined)
  && !relation.current) || (relation.active === false) || (relation.endDate < getComparableNow());

  const renderPriceDate = relation.startDate ? ` obtenu en ${relation.startDate?.split('-')?.[0]}` : ' Date inconnue';

  return (
    <div className="fr-card fr-card--xs fr-card--grey fr-card--no-border">
      <div className={`fr-card__body ${styles['card-body']}`}>
        <div className="fr-card__content">
          <p className="fr-card__desc">
            {relation.mandatePrecision ? (
              <Text as="span" bold>
                {relation?.mandatePrecision }
              </Text>
            ) : (
              <Text as="span" bold>
                {relation.relationType?.[getRelationTypeLabelKey(relation?.relatedObject?.gender)] || relation.relationType?.name}
                {interimMandate}
              </Text>
            ) }
            {relation?.laureatePrecision && ` ${relation?.laureatePrecision}`}
            {(relation?.resource.collection === 'prizes')
              ? renderPriceDate
              : formatDescriptionDatesForMandateAndPrizes(relation) }
          </p>
          {(relation.otherAssociatedObjects?.length > 0) && (
            <div className="fr-card__desc">
              {' '}
              <Text as="span" size="sm" bold>Structures associées:</Text>
              <TagGroup>
                {relation.otherAssociatedObjects.map(
                  (related) => <Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>,
                )}
              </TagGroup>
            </div>
          )}
          {(relation.relationTag) && (
            <div className="fr-card__start">
              <p className="fr-card__detail fr-text--sm fr-mb-0">
                {relation.relationTag.split('-').map((s) => capitalize(s)).join(' ')}
              </p>
            </div>
          )}
          <p className="fr-card__title">
            <RouterLink className="fr-text--lg" to={relation?.resource?.href}>
              {relation?.resource?.displayName}
            </RouterLink>
            <Icon iconPosition="right" name="ri-arrow-left-line" />
            <Icon iconPosition="left" name="ri-arrow-right-line" />
            <RouterLink className="fr-text--lg" to={relation.relatedObject?.href}>
              {relation.relatedObject?.displayName}
            </RouterLink>
            {isFinished && (
              <div className="fr-card__start">
                <Badge text="terminé" />
              </div>
            )}
            {isComming && (
              <div className="fr-card__start ">
                <Badge type="info" text="A venir" />
              </div>
            )}
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
          {!isFinished && (
            <>
              {' '}
              {(relation.mandateEmail || relation.personalEmail || relation.mandatePhonenumber) && (
                <div className={`fr-card__end ${styles['card-end']}`}>
                  {(relation.mandateEmail) && (
                    <p className="fr-card__detail flex flex--center">
                      <Icon name="ri-mail-line" size="1x" />
                      {relation.mandateEmail}
                      <CopyButton copyText={relation.mandateEmail} size="sm" />
                    </p>
                  )}
                  {(relation.personalEmail) && (
                    <p className="fr-card__detail flex flex--center">
                      <Icon name="ri-mail-line" size="1x" />
                      {relation.personalEmail}
                      <CopyButton copyText={relation.personalEmail} size="sm" />
                    </p>
                  )}
                  {(relation.mandatePhonenumber) && (
                    <p className="fr-card__detail flex flex--center">
                      <Icon name="ri-phone-line" size="1x" />
                      {relation.mandatePhonenumber}
                      <CopyButton copyText={relation.mandatePhonenumber} size="sm" />
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

RelationCardTwoSided.propTypes = {
  relation: PropTypes.shape.isRequired,
};
