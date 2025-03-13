import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Accordion, AccordionItem, Breadcrumb, BreadcrumbItem, Col, Container, Row } from '@dataesr/react-dsfr';
import useFetch from '../../hooks/useFetch';

function Utility({ collection }) {
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

Utility.propTypes = {
  collection: PropTypes.string.isRequired,
};

const COLLECTIONS = {
  'dedup-legal-category-sirene': 'Déduplication des catégories juridiques SIRENE',
};

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
      <Accordion>
        {Object.entries(COLLECTIONS).map(([name, title]) => (
          <AccordionItem title={title} key={name}>
            <Utility collection={name} />
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  );
}
