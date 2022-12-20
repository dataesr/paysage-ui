import { Row } from '@dataesr/react-dsfr';
import { useParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import Modification from './components/modification';

const LAST_DAYS = 7;
const DATE = new Date(Date.now() - LAST_DAYS * 24 * 60 * 60 * 1000).toISOString();

export default function ModificationJournal() {
  const { id: resourceId } = useParams();
  const url = resourceId
    ? `/journal?filters[resourceId]=${resourceId}&filters[createdAt][$gte]=${DATE}&sort=-createdAt&limit=100`
    : `/journal?filters[createdAt][$gte]=${DATE}&sort=-createdAt&limit=100`;
  const { data, error, isLoading } = useFetch(url);

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h2" look="h6">Journal des modifications</BlocTitle>
      <BlocContent>
        <Row gutters>
          {data?.data?.length && data.data.map((event) => <Modification data={event} />)}
        </Row>
      </BlocContent>
    </Bloc>
  );
}
