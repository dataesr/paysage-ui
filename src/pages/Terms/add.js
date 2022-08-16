import { Col, Container, Row, Title } from '@dataesr/react-dsfr';
import TermAddForm from '../../components/Forms/Term';

export default function TermsAddPage() {
  return (
    <Container as="main">
      <Row>
        <Col>
          <Title as="h2">Page d'ajout d'un terme</Title>
        </Col>
      </Row>

      <TermAddForm />
    </Container>
  );
}
