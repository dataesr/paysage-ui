import ExpendableListCards from '../../card/expendable-list-cards';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import RelationCard from '../../card/relation-card';

export default function RelationsParticipations() {
  const { id: resourceId } = useUrl();
  const url = `/relations?filters[relatedObjectId]=${resourceId}&filters[relationsGroupId][$exists]=true`;
  const { data, isLoading, error } = useFetch(url);

  const renderCards = () => {
    if (!data && !data?.data?.length) return null;
    const list = data.data.map((element) => (
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
