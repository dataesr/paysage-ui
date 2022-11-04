import { Tag, TagGroup, Icon, Col } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import { getComparableNow } from '../../../utils/dates';

export default function CurrentSupervisors() {
  const navigate = useNavigate();
  const { id } = useUrl();
  const { data } = useFetch(`/relations?filters[resourceId]=${id}&filters[relationTag]=structures-ministers&limit=500`);

  if (!data?.data) return null;
  const currents = data?.data
    .filter((relation) => (!relation.endDate || (relation.endDate >= getComparableNow())))
    .sort((a, b) => a.startDate < b.startDate);
  if (!currents.length) return null;
  return (
    <Col n="12 lg-4">
      <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-supervising-ministers">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div className="fr-card__end fr-mt-0">
              <TagGroup>
                {currents.map(
                  ({ relatedObject: related }) => <Tag size="md" iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>,
                )}
              </TagGroup>
            </div>
            <div className="fr-card__start">
              <p className="fr-card__detail fr-text--sm fr-mb-0">
                <Icon name="ri-spy-line" size="1x" />
                Ministres de tutelle
              </p>
            </div>
          </div>
        </div>
      </div>
    </Col>

  );
}
