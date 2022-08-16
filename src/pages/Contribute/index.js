import {
  Button,
  Col,
  Container,
  Row,
  Select,
  Title,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <Container as="main">
      <Row>
        <Col>
          <Title as="h2">Ajouter un nouvel objet Paysage</Title>
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
