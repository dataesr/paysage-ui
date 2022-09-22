import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useBlocUrl';
import useHashScroll from '../../../hooks/useHashScroll';
import Spinner from '../../../components/spinner';
import Governance from '../../../components/blocs/gouvernance';

export default function StructureGouvernancePage() {
  useHashScroll();
  const url = useUrl();
  const { data, isLoading, error } = useFetch(`${url}/relations-groups`);

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  if (data && data.data) {
    console.log(data.data);
    const governanceGroupId = data.data.filter((element) => (element.name === 'Gouvernance'))?.[0].id;
    const referentGroupId = data.data.filter((element) => (element.name === 'Référents MESR'))?.[0].id;
    return (
      <>
        {governanceGroupId && <Governance governanceGroupId={governanceGroupId} />}
        {referentGroupId && <Governance governanceGroupId={referentGroupId} />}
      </>
    );
  }
  return null;
}
