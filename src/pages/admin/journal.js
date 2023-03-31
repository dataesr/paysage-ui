import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Title } from '@dataesr/react-dsfr';
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
      <Row>
        <Col>
          <Title as="h2" look="h3">Journal des modifications</Title>
        </Col>
      </Row>
      <ModificationJournal />
    </Container>
  );
}
