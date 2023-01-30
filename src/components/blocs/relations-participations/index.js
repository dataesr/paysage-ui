import ExpendableListCards from '../../card/expendable-list-cards';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import RelationCard from '../../card/relation-card';
import { getComparableNow } from '../../../utils/dates';

export default function RelationsParticipations() {
  const { id: resourceId } = useUrl();
  const url = `/relations?filters[relatedObjectId]=${resourceId}&filters[relationsGroupId][$exists]&sort=relatedObject.collection=true&limit=100`;
  const { data, isLoading, error } = useFetch(url);

  const renderCards = () => {
    if (!data && !data?.data?.length) return null;
    const actives = data.data
      .filter((element) => (
        (element.active === true)
      || (element.endDate > getComparableNow())
      || (element.startDate > getComparableNow())
      || (element.startDate < getComparableNow() && element.endDate > getComparableNow())
      || (element.startDate < getComparableNow() && !element.endDate && element.active !== false)
      || (element.startDate === null && element.endDate === null && element.active !== false)
      ));

    const activesIds = actives.map((element) => element.id);

    const inactives = data.data.filter((element) => (!activesIds.includes(element.id)));

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
