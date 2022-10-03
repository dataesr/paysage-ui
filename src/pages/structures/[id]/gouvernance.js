import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import useHashScroll from '../../../hooks/useHashScroll';
import Spinner from '../../../components/spinner';
import Relations from '../../../components/blocs/relations';

export default function StructureGouvernancePage() {
  useHashScroll();
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(`${url}/relations-groups?filters[name][$in]=Gouvernance&filters[name][$in]=Référents MESR&limit=2`);

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  if (data && data.data) {
    const governanceGroup = data.data.find((element) => (element.name === 'Gouvernance'));
    const referentGroup = data.data.find((element) => (element.name === 'Référents MESR'));
    return (
      <>
        {governanceGroup?.id && <Relations group={governanceGroup} />}
        {referentGroup?.id && <Relations group={referentGroup} />}
      </>
    );
  }
  return null;
}
