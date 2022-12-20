import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import PrizeForm from '../../components/forms/prize';
import api from '../../utils/api';
import useNotice from '../../hooks/useNotice';
import { saveError, saveSuccess } from '../../utils/notice-contents';
import usePageTitle from '../../hooks/usePageTitle';

export default function PrizeAddPage() {
  usePageTitle('Contribution · Ajouter un prix');
  const navigate = useNavigate();
  const { notice } = useNotice();
  const onSave = async (body) => api.post('/prizes', body)
    .then((response) => { notice(saveSuccess); navigate(`/prix/${response.data.id}`); })
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
            <BreadcrumbItem>Ajouter un prix</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2">Ajouter un prix</Title>
        </Col>
      </Row>

      <PrizeForm onSave={onSave} />
    </Container>
  );
}
