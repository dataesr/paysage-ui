import { Col, Container, Row, Title } from '@dataesr/react-dsfr';
import PersonAddForm from '../../components/Forms/Person';

export default function PersonsAddPage() {
  return (
    <Container as="main">
      <Row>
        <Col>
          <Title as="h2">Page d'ajout d'une personne</Title>
        </Col>
      </Row>

      <PersonAddForm />
    </Container>
  );
}
