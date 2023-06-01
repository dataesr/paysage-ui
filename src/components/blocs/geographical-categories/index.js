import { useNavigate } from 'react-router-dom';
import { Col, Icon, Tag, TagGroup } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import KeyValueCard from '../../card/key-value-card';

export default function CurrentLegals() {
  const { id } = useUrl();
  const navigate = useNavigate();
  const { data } = useFetch(`/structures/${id}/geographical-categories`);

  if (!data?.data) return null;
  const currentGeoCategories = data?.data;

  if (currentGeoCategories.length === 0) {
    return (
      <Col n="12">
        <KeyValueCard className="card-geographical-categories" cardKey="Catégorie géographique" icon="ri-global-line" size="1x" />
      </Col>
    );
  }

  return (
    <Col n="12">
      <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-geographical-categories">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div className="fr-card__end fr-mt-0">
              <TagGroup>
                {currentGeoCategories.map((category) => (
                  <Tag
                    size="md"
                    iconPosition="right"
                    icon="ri-arrow-right-line"
                    onClick={() => navigate(`/geographical-categories/${category.id}`)}
                    key={category.id}
                  >
                    {category.nameFr}
                  </Tag>
                ))}
              </TagGroup>
            </div>
            <div className="fr-card__start">
              <p className="fr-card__detail fr-text--sm fr-mb-0">
                <Icon name="ri-global-line" size="1x" />
                Catégorie géographique
              </p>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
}
