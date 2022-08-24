import {
  Alert,
  Button,
  Col,
  Container,
  Icon,
  Row,
  Select,
  TextInput,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import validator from './validator';
import api from '../../../utils/fetch';
import useToast from '../../../hooks/useToast';

export default function StructureAddForm() {
  const navigate = useNavigate();
  const [savingErrors, setSavingErrors] = useState(null);
  const [errors, setReturnedErrors] = useState([]);
  const { toast } = useToast();

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [gender, setGender] = useState(null);
  // const [idref, setIdref] = useState(null);
  // const [orcid, setOrcid] = useState(null);
  // const [wikidata, setWikidata] = useState(null);
  // TODO Ajouter les ids au modele persons

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
      firstName,
      lastName,
      gender,
    };

    const { ok, returnedErrors } = validator(body);
    if (ok) {
      const response = await api.post('/persons', body).catch((e) => {
        console.log(e);
      });
      if (response.status === 201) {
        toast({
          toastType: 'success',
          title: 'Ajout',
          description: `Personne ${firstName} ${lastName} ajoutée avec succès`,
        });
        navigate(`../personnes/${response.data.id}`);
      }
    } else {
      setErrors(returnedErrors);
    }
  };

  const genderOptions = [
    { value: 'null', label: 'Selectionner' },
    { value: 'Homme', label: 'Homme' },
    { value: 'Femme', label: 'Femme' },
    { value: 'Autre', label: 'Autre' },
  ];

  return (
    <form>
      <Container className="fr-pl-5w fr-pr-5w fr-pb-5w">
        <Row className="fr-pb-5w">
          <Col>
            <Select
              label="Genre"
              options={genderOptions}
              selected={gender}
              onChange={(e) => setGender(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="fr-pb-5w">
          <Col>
            <TextInput
              label="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="fr-pb-5w">
          <Col>
            <TextInput
              label="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
