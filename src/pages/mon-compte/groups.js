import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Row, Title, Text, Container } from '@dataesr/react-dsfr';
import Button from '../../components/button';
import useAuth from '../../hooks/useAuth';

export default function GroupsPage() {
  const { viewer } = useAuth();

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
        <BreadcrumbItem asLink={<RouterLink to="/profile" />}>{`${viewer?.firstName} ${viewer?.lastName}`}</BreadcrumbItem>
        <BreadcrumbItem>Mes groupes</BreadcrumbItem>
      </Breadcrumb>
      <Container>
        <Row justifyContent="middle" className="fr-pb-5w fr-row--space-between fr-row--baseline">
          <Title as="h2" className="fr-m-0">Mes groupes</Title>
          <Button size="sm" secondary icon="ri-add-line">Créer un nouveau groupe</Button>
        </Row>
        <Row className="fr-pb-5w">
          <Col><Text>blah blah blah</Text></Col>
        </Row>
      </Container>
    </>
  );
}
