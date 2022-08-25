import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Row, Title, Text, Container } from '@dataesr/react-dsfr';
import useAuth from '../../hooks/useAuth';

export default function Security() {
  const { viewer } = useAuth();

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem asLink={<RouterLink to="/" />}>Acceuil</BreadcrumbItem>
        <BreadcrumbItem asLink={<RouterLink to="/profile" />}>{`${viewer?.firstName} ${viewer?.lastName}`}</BreadcrumbItem>
        <BreadcrumbItem>Mes groupes</BreadcrumbItem>
      </Breadcrumb>
      <Container>
        <Row className="fr-pb-5w">
          <Col><Title as="h2">Mes groupes</Title></Col>
        </Row>
        <Row className="fr-pb-5w">
          <Col><Text>blah blah blah</Text></Col>
        </Row>
      </Container>
    </>
  );
}
