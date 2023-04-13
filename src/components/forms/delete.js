import {
  ButtonGroup,
  Col,
  Container,
  Row,
  Text,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from '../button';

export default function DeleteForm({ onDelete }) {
  const [id, setId] = useState('');

  return (
    <form>
      <Container fluid>
        <Row gutters>
          <Col n="12">
            <Text>Vous êtes sur le point de supprimer un objet, et toutes les matadonnées associées: identifiant, media sociaux, liens web, relations, documents, suivi etc. </Text>
            <Text>Vous pouvez ajouter un lien symbolique avec un autre objet du même type, afin de notifier que cette structure est un doublon avec une autre.  </Text>
          </Col>
          <Col n="12">
            <TextInput
              label="Identifiant de l'objet a lier:"
              onChange={(e) => setId(e.target.value)}
              value={id}
            />
          </Col>
          <Col n="12">
            <ButtonGroup>
              <Button color="error" onClick={() => onDelete(id)}>Supprimer</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </form>
  );
}

DeleteForm.propTypes = {
  onDelete: PropTypes.func.isRequired,
};
