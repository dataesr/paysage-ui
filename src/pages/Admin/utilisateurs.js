import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

export default function UsersManagment() {
  const { data, isLoading, error } = useFetch('GET', '/admin/users');

  if (error) return <div>Erreur</div>;
  if (isLoading) return <div>Chargement</div>;
  return (
    <Container>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Acceuil</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
            <BreadcrumbItem>Utilisateurs</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2" look="h3">Utilisateurs Paysage</Title>
          <Row>
            <Col>
              {data.data?.map((item) => (
                <pre key={item.id}>
                  {JSON.stringify(item, null, 2)}
                </pre>
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
