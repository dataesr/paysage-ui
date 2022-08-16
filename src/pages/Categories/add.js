import { Col, Container, Row, Title } from '@dataesr/react-dsfr';
import CategoryAddForm from '../../components/Forms/Category';

export default function CategoryAddPage() {
  return (
    <Container as="main">
      <Row>
        <Col>
          <Title as="h2">Page d'ajout d'une catégorie</Title>
        </Col>
      </Row>

      <CategoryAddForm />
    </Container>
  );
}
