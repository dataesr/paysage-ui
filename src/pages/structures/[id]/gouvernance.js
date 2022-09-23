import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useBlocUrl';
import useHashScroll from '../../../hooks/useHashScroll';
import Spinner from '../../../components/spinner';
import RelationGroup from '../../../components/blocs/relation-group';

export default function StructureGouvernancePage() {
  useHashScroll();
  const url = useUrl();
  const { data, isLoading, error } = useFetch(`${url}/relations-groups?filters[name][$in]=Gouvernance&filters[name][$in]=Référents MESR&limit=2`);

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  if (data && data.data) {
    const governanceGroup = data.data.find((element) => (element.name === 'Gouvernance'));
    const referentGroup = data.data.find((element) => (element.name === 'Référents MESR'));
    return (
      <>
        {governanceGroup?.id && <RelationGroup groupId={governanceGroup.id} groupName={governanceGroup.name} groupAccepts={governanceGroup.accepts} />}
        {referentGroup?.id && <RelationGroup groupId={referentGroup.id} groupName={referentGroup.name} groupAccepts={referentGroup.accepts} />}
      </>
    );
  }
  return null;
}
