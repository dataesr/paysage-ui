import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Title, Text } from '@dataesr/react-dsfr';
import useAuth from '../../hooks/useAuth';

export default function Preferences() {
  const { viewer } = useAuth();

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
        <BreadcrumbItem asLink={<RouterLink to="/profile" />}>{`${viewer?.firstName} ${viewer?.lastName}`}</BreadcrumbItem>
        <BreadcrumbItem>Préférences</BreadcrumbItem>
      </Breadcrumb>
      <Container fluid>
        <Row className="fr-pb-5w">
          <Col><Title as="h2">Préférences</Title></Col>
        </Row>
        <Row className="fr-pb-5w">
          <Col><Text>blah blah blah</Text></Col>
        </Row>
      </Container>
    </>
  );
}
