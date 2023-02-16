import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from '@dataesr/react-dsfr';

import ApiKeys from '../../components/blocs/apikeys';

export default function ApiKeysPage() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
            <BreadcrumbItem>Clés API</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <ApiKeys />
    </Container>
  );
}
