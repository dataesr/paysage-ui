import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import TermAddForm from '../../components/Forms/Term';

export default function TermsAddPage() {
  return (
    <Container spacing="mb-6w">
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>
              Accueil
            </BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/contribuer" />}>
              Ajouter un nouvel objet
            </BreadcrumbItem>
            <BreadcrumbItem>Ajouter un terme</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2">Ajouter un terme</Title>
        </Col>
      </Row>

      <TermAddForm />
    </Container>
  );
}
