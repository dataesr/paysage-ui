import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Col,
  Container,
  Row,
  Select,
  Title,
} from '@dataesr/react-dsfr';
import { useState } from 'react';

import CategoryAddPage from './categories/ajouter';
import StructureAddPage from './structures/ajouter';
import TermAddPage from './termes/ajouter';
import OfficialTextAddPage from './textes-officiels/ajouter';
import PersonAddPage from './personnes/ajouter';
import ProjectAddPage from './projets/ajouter';

export default function ContributePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const options = [
    { value: null, label: "Selectionner un type d'objet" },
    { value: 'structures', label: 'Structures' },
    { value: 'personnes', label: 'Personne' },
    { value: 'categories', label: 'Catégorie' },
    { value: 'textes-officiels', label: 'Texte officiel' },
    { value: 'termes', label: 'Terme' },
  ];

  return (
    <Container className="fr-mb-6w">
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>
              Accueil
            </BreadcrumbItem>
            <BreadcrumbItem>Ajouter un nouvel objet</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2" look="h3">Ajouter un nouvel objet Paysage</Title>
        </Col>
      </Row>
      <Row gutters spacing="px-2w" alignItems="bottom">
        <Col>
          <Select
            onChange={(e) => setSelected(e.target.value)}
            options={options}
            selected={selected}
            label="Type d'objet"
          />
        </Col>
        <Col>
          <Button
            disabled={!selected}
            onClick={() => navigate(`/${selected}/ajouter`)}
          >
            Ajouter
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export {
  ContributePage,
  CategoryAddPage,
  StructureAddPage,
  TermAddPage,
  OfficialTextAddPage,
  PersonAddPage,
  ProjectAddPage,
};
