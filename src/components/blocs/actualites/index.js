import { Row } from '@dataesr/react-dsfr';
import { useParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import ActualityCard from './components/actuality-card';

export default function ActualitesOutlet() {
  const { id: resourceId } = useParams();
  const url = `/press?filters[relatesTo]=${resourceId}&sort=-publicationDate&limit=500`;
  const { data, isLoading, error } = useFetch(url);

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h2" look="h6">Actualités</BlocTitle>
      <BlocContent>
        <Row gutters>
          {data?.data?.length && data.data.map((actu) => <ActualityCard data={actu} key={actu.id} resourceId={resourceId} />)}
        </Row>
      </BlocContent>
    </Bloc>
  );
}
