import PropTypes from 'prop-types';
import { Col, Highlight, Row, Tag, TagGroup, Text } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import { formatDescriptionDates, toString, getComparableNow } from '../../../utils/dates';
import { STRUCTURE_PREDECESSEUR } from '../../../utils/relations-tags';
import styles from './styles.module.scss';

function HistoryCard({ creationDate, creationReason, closureDate, closureReason, creationOfficialText, closureOfficialText, predecessors, successors }) {
  const displayStatusIfCompactDate = closureDate?.length === 10 && closureDate > getComparableNow()
    ? `L'établissement fermera le ${formatDescriptionDates(closureDate)?.replace('depuis le', '')}`
    : `L'établissement fermera en ${formatDescriptionDates(closureDate)?.replace('depuis le', '').replace('depuis', ' ')}`;
  const displayStatus = ((closureDate && closureDate > getComparableNow())
    ? displayStatusIfCompactDate
    : `L'établissement est fermé ${closureDate?.length <= 10 ? '' : 'depuis le'} ${formatDescriptionDates(closureDate)}`);

  const createReason = (creationReason && !['Non renseigné', 'autre', 'Création'].includes(creationReason)) && ` par ${creationReason.toLowerCase() }`;
  const closeReason = (closureReason && !['Non renseigné', 'autre', 'Création'].includes(closureReason)) && ` par ${closureReason.toLowerCase() }`;
  const navigate = useNavigate();
  if (!closureDate && !creationDate) return <Highlight>Aucune donnée historique</Highlight>;
  return (
    <div className="fr-card fr-card--xs fr-card--grey fr-card--no-border card-structures">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <div className="fr-card__title">
            {creationDate && (
              <p className="fr-mb-1w">
                Créé
                {(creationDate.split('-').length !== 3) ? ` en ${toString(creationDate)}` : ` le ${toString(creationDate)}`}
                {createReason}
                <br />
                {creationOfficialText?.id && (
                  <span className="fr-card__detail">
                    <a className={`fr-mb-0 fr-text--xs fr-text--regular ${styles['align-after']}`} href={creationOfficialText?.pageUrl} target="_blank" rel="noreferrer">
                      {creationOfficialText?.nature}
                      {' '}
                      {creationOfficialText?.publicationDate && `du ${toString(creationOfficialText.publicationDate)}`}
                    </a>
                  </span>
                )}
              </p>
            )}
            <div>
              {(predecessors?.totalCount > 0) && (
                <div className="fr-card__desc">
                  <Text as="span" size="sm" bold>Prédécesseurs:</Text>
                  <TagGroup>
                    {predecessors.data.map(
                      ({ relatedObject: related }) => <Tag key={related.id} iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)}>{related.displayName}</Tag>,
                    )}
                  </TagGroup>
                </div>
              )}
            </div>
            {(closureDate || (successors?.totalCount > 0)) && <hr />}
          </div>
          <div className="fr-card__title">
            <p className="fr-text fr-mb-1v">
              {closureDate ? displayStatus : null}
              {closeReason}
              <br />
              {closureOfficialText?.id && (
                <span className="fr-card__detail">
                  <a className={`fr-mb-0 fr-text--xs fr-text--regular ${styles['align-after']}`} href={closureOfficialText?.pageUrl} target="_blank" rel="noreferrer">
                    {closureOfficialText?.nature}
                    {' '}
                    {closureOfficialText?.publicationDate && `du ${toString(closureOfficialText.publicationDate)}`}
                  </a>
                </span>
              )}
            </p>
            <div>
              {(successors?.totalCount > 0) && (
                <div className="fr-card__desc">
                  <Text as="span" size="sm" bold>Successeurs:</Text>
                  <TagGroup>
                    {successors.data.map(
                      ({ resource: related }) => <Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>,
                    )}
                  </TagGroup>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

HistoryCard.propTypes = {
  creationDate: PropTypes.string,
  creationReason: PropTypes.string,
  closureDate: PropTypes.string,
  closureReason: PropTypes.string,
  creationOfficialText: PropTypes.object,
  closureOfficialText: PropTypes.object,
  predecessors: PropTypes.object,
  successors: PropTypes.object,
};

HistoryCard.defaultProps = {
  creationDate: null,
  creationReason: null,
  closureDate: null,
  closureReason: null,
  creationOfficialText: {},
  closureOfficialText: {},
  predecessors: {},
  successors: {},
};

export default function HistoriqueEtDates() {
  const { url, id } = useUrl('');
  const { data } = useFetch(url);

  const { data: predecessors } = useFetch(`/relations?filters[relationTag]=${STRUCTURE_PREDECESSEUR}&filters[resourceId]=${id}&limit=500`);
  const { data: successors } = useFetch(`/relations?filters[relationTag]=${STRUCTURE_PREDECESSEUR}&filters[relatedObjectId]=${id}&limit=500`);
  if (!data?.id) return null;
  return <Row><Col n="12"><HistoryCard {...data} predecessors={predecessors} successors={successors} /></Col></Row>;
}
