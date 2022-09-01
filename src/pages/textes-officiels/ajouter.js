import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import OfficiaTextAddForm from '../../components/Forms/OfficialText';

export default function OfficialTextAddPage() {
  const [search] = useSearchParams();

  return (
    <Container spacing="mb-6w">
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>
              Accueil
            </BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/contribuer" />}>
              Ajouter un nouvel objet
            </BreadcrumbItem>
            <BreadcrumbItem>Ajouter un texte officiel</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2">Ajouter un texte officiel</Title>
        </Col>
      </Row>
      <OfficiaTextAddForm from={search.get('redirect')} />
    </Container>
  );
}
