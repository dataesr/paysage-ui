import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import CategoryTermsForm from '../../components/forms/category-term';
import api from '../../utils/api';
import useNotice from '../../hooks/useNotice';
import { saveError, saveSuccess } from '../../utils/notice-contents';
import usePageTitle from '../../hooks/usePageTitle';

export default function TermsAddPage() {
  usePageTitle('Contribution · Ajouter un terme');
  const navigate = useNavigate();
  const { notice } = useNotice();
  const onSave = async (body) => api.post('/terms', body)
    .then((response) => { notice(saveSuccess); navigate(`/termes/${response.data.id}`); })
    .catch(() => { notice(saveError); });

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
            <BreadcrumbItem>Ajouter un terme</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2">Ajouter un terme</Title>
        </Col>
      </Row>

      <CategoryTermsForm onSave={onSave} />
    </Container>
  );
}
