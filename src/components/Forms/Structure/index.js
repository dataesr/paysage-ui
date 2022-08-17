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
import fetch from '../../../utils/fetch';

export default function StructureAddForm() {
  const navigate = useNavigate();
  const [savingErrors, setSavingErrors] = useState(null);
  const [errors, setReturnedErrors] = useState([]);

  const [usualName, setUsualName] = useState(null);
  const [wikidata, setWikidata] = useState(null);
  const [idref, setIdref] = useState(null);
  const [siret, setSiret] = useState(null);
  const [ror, setRor] = useState(null);
  const [uai, setUai] = useState(null);
  const [rnsr, setRnsr] = useState(null);

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
      usualName,
      wikidata,
      idref,
      siret,
      ror,
      uai,
      rnsr,
    };

    const { ok, returnedErrors } = validator(body);
    if (ok) {
      const response = await fetch.post('/structures', body).catch((e) => {
        console.log(e);
      });
      if (response.status === 201) {
        // TODO : toast + redirection
        console.log('response', response);
        navigate(`../structures/${response.data.id}`);
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
              label="Nom usuel"
              value={usualName}
              onChange={(e) => setUsualName(e.target.value)}
              required
            />
          </Col>
        </Row>
        <Row className="fr-pb-5w">
          <Col className="fr-pr-5w">
            <TextInput
              label="Wikidata"
              value={wikidata}
              hint="Base de connaissances libre hébergée par la Wikimedia Foundation"
              onChange={(e) => setWikidata(e.target.value)}
            />
          </Col>
          <Col className="fr-pl-5w">
            <TextInput
              label="idref"
              value={idref}
              hint="Identifiants et Référentiels pour l'Enseignement supérieur et la Recherche"
              onChange={(e) => setIdref(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="fr-pb-5w">
          <Col className="fr-pr-5w">
            <TextInput
              label="Siret"
              value={siret}
              hint="Système Informatique pour le Répertoire des Entreprises sur le Territoire"
              onChange={(e) => setSiret(e.target.value)}
            />
          </Col>
          <Col className="fr-pl-5w">
            <TextInput
              label="Ror"
              value={ror}
              hint="Registre des organismes de recherche https://ror.org"
              onChange={(e) => setRor(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="fr-pb-5w">
          <Col className="fr-pr-5w">
            <TextInput
              label="UAI"
              value={uai}
              hint="Unité Administrative Immatriculée"
              onChange={(e) => setUai(e.target.value)}
            />
          </Col>
          <Col className="fr-pl-5w">
            <TextInput
              label="RNSR"
              value={rnsr}
              hint="Répertoire National des Structures de Recherche"
              onChange={(e) => setRnsr(e.target.value)}
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
