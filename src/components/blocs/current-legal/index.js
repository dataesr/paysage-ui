import { Col } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import { getComparableNow } from '../../../utils/dates';
import KeyValueCard from '../../card/key-value-card';
import { STRUCTURE_CATEGORIE_JURIDIQUE as tag } from '../../../utils/relations-tags';

export default function CurrentLegals() {
  const { id } = useUrl();
  const { data } = useFetch(`/relations?filters[resourceId]=${id}&filters[relationTag]=${tag}&limit=500`);

  if (!data?.data) return null;
  const currentLegals = data?.data
    .filter((relation) => (!relation.endDate || (relation.endDate >= getComparableNow())))
    .sort((a, b) => a.startDate < b.startDate);
  const currentLegal = currentLegals?.[0] || {};
  return (
    <Col n="12 lg-4">
      <KeyValueCard
        titleAsText
        className="card-legal-categories"
        icon="ri-bookmark-line"
        cardKey="Catégorie juridique"
        cardValue={currentLegal?.relatedObject?.displayName}
      />
    </Col>
  );
}
