import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from '@dataesr/react-dsfr';
import Domains from '../../components/blocs/domains';

export default function AdminDomainsPage() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
            <BreadcrumbItem>Noms de domaine</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Domains />
    </Container>
  );
}
