import { useNavigate } from 'react-router-dom';
import { Col, Icon, Tag } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import { STRUCTURE_CATEGORIE_JURIDIQUE as tag } from '../../../utils/relations-tags';
import KeyValueCard from '../../card/key-value-card';

export default function CurrentLegals() {
  const { id } = useUrl();
  const navigate = useNavigate();
  const { data } = useFetch(`/relations?filters[resourceId]=${id}&filters[relationTag]=${tag}&limit=500`);

  if (!data?.data) return null;
  const currentLegals = data?.data
    .sort((a, b) => a.startDate < b.startDate);
  const currentLegal = currentLegals?.[0] || {};
  if (!currentLegal.relatedObject) {
    return (
      <Col n="12 lg-4">
        <KeyValueCard className="card-legal-categories" cardKey="Catégorie juridique" icon="ri-spy-line" />
      </Col>
    );
  }
  return (
    <Col n="12 lg-4">
      <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-legal-categories">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div className="fr-card__end fr-mt-0">
              <Tag
                size="md"
                iconPosition="right"
                icon="ri-arrow-right-line"
                onClick={() => navigate(currentLegal?.relatedObject?.href)}
                key={currentLegal?.relatedObject?.id}
              >
                {currentLegal?.relatedObject?.displayName}
              </Tag>
            </div>
            <div className="fr-card__start">
              <p className="fr-card__detail fr-text--sm fr-mb-0">
                <Icon name="ri-spy-line" size="1x" />
                Catégorie juridique
              </p>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
}
