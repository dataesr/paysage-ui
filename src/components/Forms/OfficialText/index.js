/* eslint-disable no-console */
import PropTypes from 'prop-types';
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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import validator from './validator';
import DateOneField from '../../DateOneField';
import fetch from '../../../utils/fetch';
import useToast from '../../../hooks/useToast';

export default function OfficiaTextForm({ data, from }) {
  const navigate = useNavigate();
  const [savingErrors, setSavingErrors] = useState(null);
  const [errors, setReturnedErrors] = useState([]);
  const { toast } = useToast();

  const [otNature, setNature] = useState('Publication au JO');
  const [otType, setType] = useState('Loi');
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

  useEffect(() => {
    // init si data (modif)
    if (data) {
      setNature(data.nature || null);
      setType(data.type || null);
      setJorftext(data.jorftext || null);
      setNor(data.nor || null);
      setTitle(data.title || null);
      setPageUrl(data.pageUrl || null);
      setBoesrId(data.boesrId || null);
      setJoId(data.joId || null);
      setStartDate(data.startDate || null);
      setEndDate(data.endDate || null);
      setPublicationDate(data.publicationDate || null);
      setSignatureDate(data.signatureDate || null);
      setPrevisionalEndDate(data.previsionalEndDate || null);
      setTextExtract(data.textExtract || null);
      setComment(data.comment || null);

      const relatedCategories = data.relatedCategories.map((el) => ({
        id: el.id,
        label: 'cat',
        apiObject: 'categories',
      }));
      const relatedPersons = data.relatedPersons.map((el) => ({
        id: el.id,
        label: `${el.lastName} ${el.firstName}`,
        apiObject: 'persons',
      }));
      const relatedStructures = data.relatedStructures.map((el) => ({
        id: el.id,
        label: el.currentName.usualName,
        apiObject: 'structures',
      }));
      setRelatesTo(
        relatedCategories.concat(relatedPersons).concat(relatedStructures),
      );
    }
  }, [data]);

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
        { id: 'G1r6y', label: 'Normandie Université', apiObject: 'structures' },
        {
          id: 'QYw7j',
          label:
            'Institut national des sciences appliquées Centre Val de Loire',
          apiObject: 'structures',
        },
        { id: 'p25Q3', label: 'Université de Caen', apiObject: 'structures' },
        { id: 'EWw2c', label: 'Péglion Jérémy', apiObject: 'persons' },
        { id: 'McQOf', label: 'Ma nouvelle catégorie', apiObject: 'categories' },
      ];
    }

    setRelatesToSearchResult(result);
  };

  const onSaveHandler = async () => {
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
      let response = null;
      if (data?.id) {
        response = await fetch.patch(`/official-texts/${data.id}`, body).catch((e) => {
          console.log(e);
        });
      } else {
        response = await fetch.post('/official-texts', body).catch((e) => {
          console.log(e);
        });
      }
      switch (response.status) {
      case 200:
        toast({
          toastType: 'success',
          title: 'Le texte officiel à été mise à jour',
        });
        break;
      case 201:
        toast({
          toastType: 'success',
          title: 'Le texte officiel été ajouté',
        });
        break;
      default:
        toast({
          toastType: 'error',
          title: "Erreur lors de l'enregistrement",
        });
        break;
      }

      navigate(from || '/textes-officiels');
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
            onChange={(e) => setType(e.target.value)}
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
                value={otPublicationDate}
                name="publicationDate"
                label="Date de publication"
                onValueChangeHandler={setPublicationDate}
                isRequired
              />
            </Col>
            <Col n="6" className="fr-pl-5w">
              <DateOneField
                value={otSignatureDate}
                name="signatureDate"
                label="Date de signature"
                onValueChangeHandler={setSignatureDate}
              />
            </Col>
            <Col n="6" className="fr-pr-5w">
              <DateOneField
                value={otStartDate}
                name="startDate"
                label="Date de début"
                onValueChangeHandler={setStartDate}
              />
            </Col>
            <Col n="6" className="fr-pl-5w">
              <DateOneField
                value={otEndDate}
                name="endDate"
                label="Date de fin"
                onValueChangeHandler={setEndDate}
              />
            </Col>
            <Col n="6" className="fr-pr-5w">
              <DateOneField
                value={otPrevisionalEndDate}
                name="previsionalEndDate"
                label="Date de fin prévisionnelle"
                onValueChangeHandler={setPrevisionalEndDate}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <Title as="h3">Eléments liés à ce texte officiel</Title>
        </Col>
      </Row>
      <Row>
        <Col>
          <TextInput
            label="Rechercher un objet pour l'ajouter"
            value={relatesToSearch}
            onChange={onRelatesToSearch}
            // TODO : search
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
        <>
          <Row>
            <Col className="fr-mb-5v">
              {otRelatesTo.map((item) => (
                <Tag
                  as="a"
                  key={uuidv4()}
                  onClick={() => deleteRelation(item)}
                  className={`bg-${item.apiObject} mx-1`}
                  closable
                >
                  {item.label}
                </Tag>
              ))}
            </Col>
          </Row>
          <Row>
            <Col>
              <span className="bullet bg-structures" />
              Structures
              <span className="bullet bg-persons" />
              Personnes
              <span className="bullet bg-categories" />
              Catégories
            </Col>
          </Row>
        </>
      ) : null}
      <hr />
      {savingErrors || null}
      <Row>
        <Col className="text-right">
          <Button onClick={onSaveHandler} size="sm">
            <Icon name="ri-save-line" size="lg" />
            {data?.id ? 'Modifier' : 'Ajouter'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

OfficiaTextForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  from: PropTypes.string.isRequired,
};

OfficiaTextForm.defaultProps = {
  data: null,
};
