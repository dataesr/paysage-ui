import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from '@dataesr/react-dsfr';
import useFetch from '../../hooks/useFetch';

function Utility(collection) {
  const { data, isLoading } = useFetch(`/utilities/${collection}`);
  return (
    <Container fluid>
      <pre>
        <code>
          {isLoading ? 'Chargement...' : JSON.stringify(data)}
        </code>
      </pre>
    </Container>
  );
}

const COLLECTIONS = { 'dedup-legal-category-sirene': 'Déduplication des catégories juridiques SIRENE' };

export default function UtilitiesPage() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
            <BreadcrumbItem>Utilitaires</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <h3>Collections utilitaires</h3>
      {Object.entries(COLLECTIONS).map(([name, title]) => (
        <div key={name}>
          <h6>{title}</h6>
          <Utility collection={COLLECTIONS[name]} />
        </div>
      ))}
    </Container>
  );
}
