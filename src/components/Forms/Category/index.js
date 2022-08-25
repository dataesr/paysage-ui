import {
  Alert,
  Button,
  Col,
  Container,
  Icon,
  Row,
  TextInput,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import validator from './validator';
import api from '../../../utils/api';

export default function CategoryAddForm() {
  const navigate = useNavigate();
  const [savingErrors, setSavingErrors] = useState(null);
  const [errors, setReturnedErrors] = useState([]);

  const [usualNameFr, setUsualNameFr] = useState(null);

  const setErrors = (err) => {
    setReturnedErrors(errors);
    setSavingErrors(
      <Row>
        <Col>
          <ul>
            {err.map((e) => (
              <li key={uuidv4()}>
                <Alert description={e.error} type="error" />
              </li>
            ))}
          </ul>
        </Col>
      </Row>,
    );
  };

  const onSaveHandler = async () => {
    const body = {
      usualNameFr,
    };

    const { ok, returnedErrors } = validator(body);
    if (ok) {
      const response = await api.post('/categories', body).catch((e) => {
        console.log(e);
      });
      if (response.status === 201) {
        // TODO : toast + redirection
        console.log('response', response);
        navigate(`../categories/${response.data.id}`);
      }
    } else {
      setErrors(returnedErrors);
    }
  };

  return (
    <form>
      <Container className="fr-pl-5w fr-pr-5w fr-pb-5w">
        <Row className="fr-pb-5w">
          <Col>
            <TextInput
              label="Nom"
              hint="Nom français de la catégorie"
              value={usualNameFr}
              onChange={(e) => setUsualNameFr(e.target.value)}
            />
          </Col>
        </Row>
        <hr />
        {savingErrors || null}
        <Row>
          <Col className="text-right">
            <Button onClick={onSaveHandler} size="sm">
              <Icon name="ri-save-line" size="lg" />
              Ajouter
            </Button>
          </Col>
        </Row>
      </Container>
    </form>
  );
}
