import {
  Alert,
  Col,
  Container,
  Icon,
  Row,
  TextInput,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Button from '../../button';
import validator from './validator';
import api from '../../../utils/api';

export default function TermAddForm() {
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
      const response = await api.post('/terms', body).catch((e) => {
        console.log(e);
      });
      if (response.status === 201) {
        // TODO : toast + redirection
        navigate(`../termes/${response.data.id}`);
      }
    } else {
      setErrors(returnedErrors);
    }
  };

  return (
    <form>
      <Container fluid className="fr-pb-6w">
        <Row className="fr-pb-5w">
          <Col>
            <TextInput
              label="Nom"
              hint="Nom français du terme"
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
