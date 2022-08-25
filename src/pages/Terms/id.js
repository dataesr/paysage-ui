import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title } from '@dataesr/react-dsfr';
import api from '../../utils/api';

export default function TermByIdPage() {
  const { id } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    const getData = async () => {
      const response = await api.get(`/terms/${id}`).catch((e) => {
        console.log(e);
      });
      if (response.ok) setData(response.data);
    };
    getData();
    return () => {};
  }, [id]);

  if (!data) return <h1>Loading</h1>;

  return (
    <Container as="main" spacing="mt-10w">
      <Title as="h2">{`Modification du terme ${id}`}</Title>
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </Container>
  );
}
