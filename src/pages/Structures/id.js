import { useParams } from 'react-router-dom';
import { Container, Title } from '@dataesr/react-dsfr';
import useFetch from '../../hooks/useFetch';

export default function StructuresByIdPage() {
  const { id } = useParams();
  const { data, error, isLoading } = useFetch('GET', `/structures/${id}`);
  if (isLoading || !data) return <h1>Loading</h1>;
  if (error) return <h1>Error</h1>;
  return (
    <Container spacing="mt-10w">
      <Title as="h1">Home</Title>
      <div>
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </Container>
  );
}
