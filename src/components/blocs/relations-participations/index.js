import ExpendableListCards from '../../card/expendable-list-cards';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import RelationCard from '../../card/relation-card';
import { getComparableNow } from '../../../utils/dates';

export default function RelationsParticipations() {
  const { id: resourceId } = useUrl();
  const url = `/relations?filters[relatedObjectId]=${resourceId}&filters[relationsGroupId][$exists]=true&limit=100`;
  const { data, isLoading, error } = useFetch(url);

  const renderCards = () => {
    if (!data && !data?.data?.length) return null;
    const inactives = data.data.filter((element) => (element.relatedObject?.collection === 'structures'
    && element.relatedObject?.currentLocalisation?.geometry?.coordinates
    && (element?.endDate < getComparableNow() || !element.endDate)));

    const actives = data.data.filter((element) => (inactives && (element?.endDate > getComparableNow())));

    const orderedList = [...actives, ...inactives];

    const list = orderedList.map((element) => (
      <RelationCard
        relation={element}
        onEdit={null}
        inverse
      />
    ));
    return (
      <ExpendableListCards list={list} nCol="12 md-6" />
    );
  };
  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Participations</BlocTitle>
      <BlocContent>{renderCards()}</BlocContent>
    </Bloc>
  );
}
