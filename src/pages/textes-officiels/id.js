import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Container, Row, Title } from '@dataesr/react-dsfr';
import api from '../../utils/api';
import OfficiaTextForm from '../../components/Forms/OfficialText';

export default function OfficialTextByIdPage() {
  const { id, route, idFrom } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    const getData = async () => {
      const response = await api.get(`/official-texts/${id}`).catch((e) => {
        console.log(e);
      });
      if (response.ok) setData(response.data);
    };
    getData();
    return () => {};
  }, [id]);

  let from = null;
  if (route && idFrom) {
    from = `/${route}/${idFrom}`;
  }

  if (!data) return <h1>Loading</h1>;
  return (
    <Container as="main">
      <Row>
        <Col>
          <Title as="h2">Page de modification d'un texte officiel</Title>
        </Col>
      </Row>

      <OfficiaTextForm data={data} from={from} />
    </Container>
  );
}
