import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import ProjectAddForm from '../../components/forms/project';

export default function ProjectAddPage() {
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
            <BreadcrumbItem>Ajouter un projet</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2">Ajouter un projet</Title>
        </Col>
      </Row>

      <ProjectAddForm />
    </Container>
  );
}
