import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import usePageTitle from '../../hooks/usePageTitle';
import State from './components/state';
import Results from './components/result';
import Filters from './components/filters';

export default function Annuaire() {
  usePageTitle('Annuaire · Recherche de contacts');

  return (
    <Container spacing="mb-6w">
      <Row alignItems="center">
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>
              Accueil
            </BreadcrumbItem>
            <BreadcrumbItem>
              Annuaire
            </BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2">Annuaire</Title>
        </Col>
      </Row>
      <Filters />
      <State />
      <Results />
    </Container>
  );
}
