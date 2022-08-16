import { Col, Container, Row, Title } from '@dataesr/react-dsfr';
import StructureAddForm from '../../components/Forms/Structure';

export default function StructuresAddPage() {
  return (
    <Container as="main">
      <Row>
        <Col>
          <Title as="h2">Page d'ajout d'une structure</Title>
        </Col>
      </Row>
      <StructureAddForm />
    </Container>
  );
}
