import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useBlocUrl';
import useHashScroll from '../../../hooks/useHashScroll';
import Spinner from '../../../components/spinner';
import RelationGroup from '../../../components/blocs/relation-group';

export default function StructureCategoriesPage() {
  useHashScroll();
  const url = useUrl();
  const { data, isLoading, error } = useFetch(`${url}/relations-groups?filters[name]=Catégories&limit=1`);

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  if (data && data.data) {
    const group = data.data.find((element) => (element.name === 'Catégories'));
    if (group.id) { return <RelationGroup groupId={group.id} groupName={group.name} groupAccepts={group.accepts} />; }
  }
  return null;
}
