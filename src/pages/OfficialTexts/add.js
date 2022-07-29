import { Col, Container, Row, Title } from '@dataesr/react-dsfr';
import OfficiaTextAddForm from '../../components/Forms/OfficialText/add';

export default function OfficialTextsAddPage() {
  return (
    <Container as="main">
      <Row>
        <Col>
          <Title as="h2">Page d'ajout d'un texte officiel</Title>
        </Col>
      </Row>

      <OfficiaTextAddForm />
    </Container>
  );
}
