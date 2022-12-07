import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';
import ModificationJournal from '../../components/blocs/modification-journal';

export default function AdminDashboardPage() {
  return (
    <Container>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
            <BreadcrumbItem>Tableau de bord</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2" look="h3">Tableau de bord</Title>
        </Col>
      </Row>
      <ModificationJournal />
    </Container>
  );
}
