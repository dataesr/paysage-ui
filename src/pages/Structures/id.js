import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title } from '@dataesr/react-dsfr';
import fetch from '../../utils/fetch';

export default function StructuresByIdPage() {
  const { id } = useParams();
  const [data, setData] = useState();
  useEffect(() => {
    const getData = async () => {
      const response = await fetch.get(`/structures/${id}`).catch((e) => { console.log(e); });
      if (response.ok) setData(response.data);
    };
    getData();
    return () => {};
  }, [id]);
  if (!data) return <h1>Loading</h1>;
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
