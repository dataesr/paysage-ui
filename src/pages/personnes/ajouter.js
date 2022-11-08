import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import PersonForm from '../../components/forms/person';
import api from '../../utils/api';
import useNotice from '../../hooks/useNotice';
import { saveError, saveSuccess } from '../../utils/notice-contents';

export default function PersonAddPage() {
  const navigate = useNavigate();
  const { notice } = useNotice();
  const onSave = async (body) => api.post('/persons', body)
    .then((response) => { notice(saveSuccess); navigate(`/personnes/${response.data.id}`); })
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
            <BreadcrumbItem>Ajouter une personne</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2">Ajouter une personne</Title>
        </Col>
      </Row>

      <PersonForm onSave={onSave} />
    </Container>
  );
}
