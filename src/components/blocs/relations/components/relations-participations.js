import { useEffect, useState } from 'react';
import ExpendableListCards from '../../../card/expendable-list-cards';
import { Bloc, BlocContent, BlocFilter, BlocTitle } from '../../../bloc';

import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';
import RelationCard from '../../../card/relation-card';
import { spreadByStatus } from '../utils/status';

export default function RelationsParticipations() {
  const { id: resourceId } = useUrl();
  const url = `/relations?filters[relatedObjectId]=${resourceId}&filters[relationsGroupId][$exists]&sort=relatedObject.collection=true&limit=1000`;
  const { data, isLoading, error } = useFetch(url);
  const { data: spreadedByStatusRelations, counts, defaultFilter } = spreadByStatus(data?.data);
  const [statusFilter, setStatusFilter] = useState(defaultFilter);
  useEffect(() => setStatusFilter(defaultFilter), [defaultFilter]);

  const renderCards = () => {
    const relations = spreadedByStatusRelations[statusFilter] || [];

    const list = relations.map((element) => (
      <RelationCard
        relation={element}
        onEdit={null}
        inverse
      />
    ));
    return <ExpendableListCards list={list} nCol="12 md-6" />;
  };
  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Participations</BlocTitle>
      <BlocFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} counts={counts} />
      <BlocContent>{renderCards()}</BlocContent>
    </Bloc>
  );
}
