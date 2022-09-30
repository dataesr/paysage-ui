import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import useHashScroll from '../../../hooks/useHashScroll';
import Spinner from '../../../components/spinner';
import Relations from '../../../components/blocs/relations';

export default function StructureCategoriesPage() {
  useHashScroll();
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(`${url}/relations-groups?filters[name]=Catégories&limit=1`);

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  if (data && data.data) {
    const group = data.data.find((element) => (element.name === 'Catégories'));
    if (group.id) { return <Relations group={group} />; }
  }
  return null;
}
