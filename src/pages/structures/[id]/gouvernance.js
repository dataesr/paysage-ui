/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useBlocUrl';
import useHashScroll from '../../../hooks/useHashScroll';
import Spinner from '../../../components/spinner';
import Governance from '../../../components/blocs/gouvernance';
import api from '../../../utils/api';

export default function StructureGouvernancePage() {
  useHashScroll();
  const url = useUrl();
  const { data, isLoading, error } = useFetch(`${url}/relations-groups`);
  const [governanceGroupId, setGovernanceGroupId] = useState();

  useEffect(() => {
    const getGovernanceId = async () => {
      if (data?.data) {
        const hasGovernance = data?.data?.filter((element) => (element.name === 'Gouvernance'));
        if (!hasGovernance.length) {
          const response = await api.post(`${url}/relations-groups`, { name: 'Gouvernance', accepts: ['persons'] });
          if (response.ok) {
            setGovernanceGroupId(response.data.id);
          }
        } else {
          setGovernanceGroupId(hasGovernance[0].id);
        }
      }
    };
    getGovernanceId();
  }, [data]);

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  return (governanceGroupId && <Governance governanceGroupId={governanceGroupId} />);
}
