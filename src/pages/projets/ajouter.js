import { useEffect } from 'react';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import ProjectForm from '../../components/forms/project';
import useNotice from '../../hooks/useNotice';
import api from '../../utils/api';
import { saveError, saveSuccess } from '../../utils/notice-contents';

export default function ProjectAddPage() {
  const navigate = useNavigate();
  const { notice } = useNotice();
  const onSave = async (body) => api.post('/projects', body)
    .then((response) => { notice(saveSuccess); navigate(`/projets/${response.data.id}`); })
    .catch(() => { notice(saveError); });
  useEffect(() => { document.title = 'Contribution · Ajouter un projet'; }, []);
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
            <BreadcrumbItem>
              Ajouter un projet
            </BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2">
            Ajouter un projet
          </Title>
        </Col>
      </Row>

      <ProjectForm onSave={onSave} />
    </Container>
  );
}
