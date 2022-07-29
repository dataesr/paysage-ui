import {
  Alert,
  Button,
  Col,
  Container,
  Icon,
  Row,
  Select,
  Tag,
  TextInput,
  Title,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import validator from './validator';
import DateOneField from '../../DateOneField';

export default function OfficiaTextAddForm() {
  const [savingErrors, setSavingErrors] = useState(null);
  const [errors, setReturnedErrors] = useState([]);

  const [otNature, setNature] = useState('Publication au JO');
  const [otType, setOtType] = useState('Loi');
  const [otJorftext, setJorftext] = useState(null);
  const [otNor, setNor] = useState(null);
  const [otTitle, setTitle] = useState(null);
  const [otPageUrl, setPageUrl] = useState(null);
  const [otBoesrId, setBoesrId] = useState(null);
  const [otJoId, setJoId] = useState(null);
  const [otStartDate, setStartDate] = useState(null);
  const [otEndDate, setEndDate] = useState(null);
  const [otPublicationDate, setPublicationDate] = useState(null);
  const [otSignatureDate, setSignatureDate] = useState(null);
  const [otPrevisionalEndDate, setPrevisionalEndDate] = useState(null);
  const [otTextExtract, setTextExtract] = useState(null);
  const [otComment, setComment] = useState(null);

  const [otRelatesTo, setRelatesTo] = useState([]);

  const [relatesToSearch, setRelatesToSearch] = useState(null);
  const [relatesToSearchResult, setRelatesToSearchResult] = useState([]);

  const onDateChangeHandler = (key, value) => {
    if (key === 'startDate') setStartDate(value);
    if (key === 'endDate') setEndDate(value);
    if (key === 'publicationDate') setPublicationDate(value);
    if (key === 'signatureDate') setSignatureDate(value);
    if (key === 'previsionalEndDate') setPrevisionalEndDate(value);
  };

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

  const onRelatesToSearch = (e) => {
    const needle = e.target.value;
    setRelatesToSearch(needle);

    let result = [];

    if (needle) {
      // TODO : requete API
      result = [
        { id: 'G1r6y', label: 'Normandie Université' },
        {
          id: 'QYw7j',
          label:
            'Institut national des sciences appliquées Centre Val de Loire',
        },
        { id: 'p25Q3', label: 'Université de Caen' },
      ];
    }

    setRelatesToSearchResult(result);
  };

  const onSaveHandler = () => {
    const body = {
      nature: otNature,
      type: otType,
      jorftext: otJorftext,
      nor: otNor,
      title: otTitle,
      pageUrl: otPageUrl,
      boesrId: otBoesrId,
      joId: otJoId,
      publicationDate: otPublicationDate,
      signatureDate: otSignatureDate,
      startDate: otStartDate,
      previsionalEndDate: otPrevisionalEndDate,
      endDate: otEndDate,
      textExtract: otTextExtract,
      comment: otComment,
      relatesTo: otRelatesTo.map((item) => item.id),
    };

    const { ok, returnedErrors } = validator(body);
    if (ok) {
      // onSave(body);
      console.log('save');
    } else {
      setErrors(returnedErrors);
    }
  };

  const onAddRelatesTo = (item) => {
    const newOtRelatesTo = [...otRelatesTo];
    if (!newOtRelatesTo.find((el) => el.id === item.id)) {
      newOtRelatesTo.push(item);
      setRelatesTo(newOtRelatesTo);
    }
    setRelatesToSearchResult([]);
    setRelatesToSearch('');
  };

  const deleteRelation = (item) => {
    setRelatesTo(otRelatesTo.filter((ele) => ele.id !== item.id));
  };

  const natureOptions = [
    { value: 'Publication au JO', label: 'Publication au JO' },
    { value: 'Publication au BOESR', label: 'Publication au BOESR' },
  ];

  const typeOptions = [
    { value: 'Loi', label: 'Loi' },
    { value: 'Décret', label: 'Décret' },
    { value: 'Ordonnance', label: 'Ordonnance' },
    { value: "Avis de vacance d'emploi", label: "Avis de vacance d'emploi" },
    { value: 'Arrêté', label: 'Arrêté' },
    { value: 'Circulaire', label: 'Circulaire' },
  ];

  return (
    <Container>
      <Row>
        <Col className="fr-pr-5w fr-pb-5w">
          <Select
            label="Nature"
            options={natureOptions}
            selected={otNature}
            onChange={(e) => setNature(e.target.value)}
            required
          />
        </Col>
        <Col className="fr-pl-5w fr-pb-5w">
          <Select
            label="Type"
            options={typeOptions}
            selected={otType}
            onChange={(e) => setOtType(e.target.value)}
            required
          />
        </Col>
      </Row>
      <Row>
        <Col className="fr-pr-5w fr-pb-5w">
          <TextInput
            label="Numéro jorftext pour les publications au JO"
            hint="Uniquement si Publication au JO"
            value={otJorftext}
            onChange={(e) => setJorftext(e.target.value)}
          />
        </Col>
        <Col className="fr-pl-5w fr-pb-5w">
          <TextInput
            label="Numéro NOR du texte officiel"
            hint="(système normalisé de numérotation des textes officiels publiés en France)"
            value={otNor}
            onChange={(e) => setNor(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col className="fr-pb-5w">
          <TextInput
            label="Titre du texte officiel"
            value={otTitle}
            onChange={(e) => setTitle(e.target.value)}
            required
            messageType={
              errors.find((el) => el.field === 'title') ? 'error' : ''
            }
          />
        </Col>
      </Row>
      <Row>
        <Col className="fr-pb-5w">
          <TextInput
            label="URL"
            value={otPageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            required
            messageType={
              errors.find((el) => el.field === 'pageUrl') ? 'error' : ''
            }
          />
        </Col>
      </Row>
      <Row>
        <Col className="fr-pr-5w fr-pb-5w">
          <TextInput
            label="Numéro du BOESR où a été publié le texte"
            value={otBoesrId}
            onChange={(e) => setBoesrId(e.target.value)}
          />
        </Col>
        <Col className="fr-pl-5w fr-pb-5w">
          <TextInput
            label="Numéro du décret ou de l’arrêté"
            value={otJoId}
            onChange={(e) => setJoId(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col n="12" className="fr-pb-5w">
          <TextInput
            textarea
            label="textExtract"
            value={otTextExtract}
            onChange={(e) => setTextExtract(e.target.value)}
          />
          <TextInput
            textarea
            label="Commentaires"
            value={otComment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col n="12" className="fr-pb-5w">
          <Row>
            <Col>
              <Title as="h3">Dates</Title>
            </Col>
          </Row>
          <Row>
            <Col n="6" className="fr-pr-5w">
              <DateOneField
                value={otStartDate}
                name="startDate"
                label="Date de début"
                onValueChangeHandler={onDateChangeHandler}
              />
            </Col>
            <Col n="6" className="fr-pl-5w">
              <DateOneField
                value={otEndDate}
                name="endDate"
                label="Date de fin"
                onValueChangeHandler={onDateChangeHandler}
              />
            </Col>
            <Col n="6" className="fr-pr-5w">
              <DateOneField
                value={otPublicationDate}
                name="publicationDate"
                label="Date de publication"
                onValueChangeHandler={onDateChangeHandler}
              />
            </Col>
            <Col n="6" className="fr-pl-5w">
              <DateOneField
                value={otSignatureDate}
                name="signatureDate"
                label="Date de signature"
                onValueChangeHandler={onDateChangeHandler}
              />
            </Col>
            <Col n="6" className="fr-pr-5w">
              <DateOneField
                value={otPrevisionalEndDate}
                name="previsionalEndDate"
                label="Date de fin prévisionnelle"
                onValueChangeHandler={onDateChangeHandler}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <Title as="h3">Eléments liés</Title>
        </Col>
      </Row>
      <Row>
        <Col>
          <TextInput
            label="Rechercher une structure ou une personne pour l'ajouter"
            value={relatesToSearch}
            onChange={onRelatesToSearch}
          />
        </Col>
      </Row>
      {relatesToSearchResult ? (
        <Row>
          <Col>
            <ul>
              {relatesToSearchResult.map((item) => (
                <li key={uuidv4()}>
                  <Row>
                    <Col n="8">{item.label}</Col>
                    <Col>
                      <Button onClick={() => onAddRelatesTo(item)} size="sm">
                        <Icon name="ri-links-fill" size="lg" />
                        Ajouter la liaison
                      </Button>
                    </Col>
                  </Row>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      ) : null}
      {otRelatesTo ? (
        <Row>
          <Col className="fr-mb-5v">
            {otRelatesTo.map((item) => (
              <Tag as="a" key={uuidv4()} onClick={() => deleteRelation(item)}>
                {item.label}
              </Tag>
            ))}
          </Col>
        </Row>
      ) : null}
      <hr />
      {savingErrors || null}
      <Row>
        <Col className="txt-right">
          <Button onClick={onSaveHandler} size="sm">
            <Icon name="ri-save-line" size="lg" />
            Ajouter
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
