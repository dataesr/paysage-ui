import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import { getComparableNow } from '../../../utils/dates';
import KeyValueCard from '../../card/key-value-card';

export default function CurrentLegals() {
  const { id } = useUrl();
  const { data } = useFetch(`/relations?filters[resourceId]=${id}&filters[relationTag]=structures-legal-categories&limit=500`);

  if (!data?.data) return null;
  const currentLegals = data?.data
    .filter((relation) => (!relation.endDate || (relation.endDate >= getComparableNow())))
    .sort((a, b) => a.startDate < b.startDate);
  const currentLegal = currentLegals?.[0] || {};
  return (
    <KeyValueCard
      className="card-legal-categories"
      icon="ri-bookmark-line"
      cardKey="Catégorie juridique"
      cardValue={currentLegal?.relatedObject?.displayName}
    />
  );
}
