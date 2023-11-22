import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';
import ModificationJournal from '../../components/blocs/modification-journal';

export default function AdminJournalPage() {
  return (
    <Container>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            {/* <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem> */}
            <BreadcrumbItem>Journal des modifications</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <ModificationJournal />
    </Container>
  );
}
