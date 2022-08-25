import { useParams } from 'react-router-dom';
import { Col, Container, Row, Title } from '@dataesr/react-dsfr';
import OfficiaTextAddForm from '../../components/Forms/OfficialText';

export default function OfficialTextsAddPage() {
  const { route, idFrom } = useParams();

  let from = null;
  if (route && idFrom) {
    from = `/${route}/${idFrom}`;
  }

  return (
    <Container as="main">
      <Row>
        <Col>
          <Title as="h2">Page d'ajout d'un texte officiel</Title>
        </Col>
      </Row>

      <OfficiaTextAddForm from={from} />
    </Container>
  );
}
