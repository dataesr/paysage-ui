import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';
import Dashboard from '../../components/blocs/dashboard';

export default function AdminDashboardPage() {
  return (
    <Container>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            {/* <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem> */}
            <BreadcrumbItem>Tableau de bord</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h1" look="h3">Tableau de bord</Title>
        </Col>
      </Row>
      <Dashboard />
    </Container>
  );
}
