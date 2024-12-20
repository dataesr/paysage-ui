import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';
import SireneUpdates from '../../components/blocs/sirene-updates';

export default function AdminJournalPage() {
  return (
    <Container>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            {/* <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem> */}
            <BreadcrumbItem>Mises à jour Sirene</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <SireneUpdates />
    </Container>
  );
}
