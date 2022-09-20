import {
  ButtonGroup,
  Container,
  Col,
  Row,
  Select,
  TextInput,
  Title,
  Alert,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '../../button';
import DateInput from '../../date-input';
import TagInput from '../../tag-input';
import validator from './validator';

export default function EmailForm({ data, onDeleteHandler, onSaveHandler }) {
  const [savingErrors, setSavingErrors] = useState(null);
  const [errors, setReturnedErrors] = useState([]);

  const [acronymEn, setAcronymEn] = useState(null);
  const [acronymFr, setAcronymFr] = useState(null);
  const [acronymLocal, setAcronymLocal] = useState(null);
  const [article, setArticle] = useState(null);
  const [brandName, setBrandName] = useState(null);
  const [comment, setComment] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [nameEn, setNameEn] = useState(null);
  const [officialName, setOfficialName] = useState(null);
  const [otherNames, setOtherNames] = useState(null);
  const [shortName, setShortName] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [usualName, setUsualName] = useState(null);

  const options = [
    { label: "à l'", value: "à l'" },
    { label: 'à', value: 'à' },
    { label: 'à la', value: 'à la' },
    { label: 'dans le', value: 'dans le' },
    { label: 'dans les', value: 'dans les' },
    { label: 'aux', value: 'aux' },
    { label: 'au', value: 'au' },
    { label: 'sans article', value: null },
  ];

  useEffect(() => {
    if (data) {
      setAcronymEn(data.acronymEn || null);
      setAcronymFr(data.acronymFr || null);
      setAcronymLocal(data.acronymLocal || null);
      setArticle(data.article || null);
      setBrandName(data.brandName || null);
      setComment(data.comment || null);
      setEndDate(data.endDate || null);
      setNameEn(data.nameEn || null);
      setOfficialName(data.officialName || null);
      setOtherNames(data.otherNames || null);
      setShortName(data.shortName || null);
      setStartDate(data.startDate || null);
      setUsualName(data.usualName || null);
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

  const onSave = () => {
    const body = {
      acronymEn,
      acronymFr,
      acronymLocal,
      article,
      brandName,
      comment,
      endDate,
      nameEn,
      officialName,
      otherNames,
      shortName,
      startDate,
      usualName,
    };

    const { ok, returnedErrors } = validator(body);
    if (ok) {
      onSaveHandler(body, data?.id || null);
    } else {
      setErrors(returnedErrors);
    }
  };

  return (
    <form>
      <Container>
        <Row>
          <Col className="fr-pb-2w">
            <TextInput
              label="Nom officiel"
              value={officialName || ''}
              onChange={(e) => setOfficialName(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col className="fr-pb-2w">
            <TextInput
              label="Nom usuel"
              value={usualName || ''}
              onChange={(e) => setUsualName(e.target.value)}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col className="fr-pb-2w">
            <TextInput
              label="Nom de marque"
              value={brandName || ''}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col className="fr-pb-2w">
            <TextInput
              label="Nom court"
              value={shortName || ''}
              onChange={(e) => setShortName(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col className="fr-pb-2w">
            <TextInput
              label="Nom anglais"
              value={nameEn || ''}
              onChange={(e) => setNameEn(e.target.value)}
            />
          </Col>
        </Row>

        <Row>
          <Col className="fr-pb-5w">
            <TagInput
              label="Autres noms"
              hint='Validez votre ajout avec la touche "Entrée" afin de valider votre ajout'
              tags={otherNames || []}
              onTagsChange={setOtherNames}
            />
          </Col>
        </Row>
        <Row>
          <Col n="12" className="fr-pb-5w">
            <Row>
              <Col>
                <Title as="h3" look="h6">
                  Acronymes
                </Title>
              </Col>
            </Row>
            <Row>
              <Col n="4" className="fr-pr-2w">
                <TextInput
                  label="FR"
                  value={acronymFr || ''}
                  onChange={(e) => setAcronymFr(e.target.value)}
                />
              </Col>
              <Col className="fr-pl-2w fr-pr-2w">
                <TextInput
                  label="EN"
                  value={acronymEn || ''}
                  onChange={(e) => setAcronymEn(e.target.value)}
                />
              </Col>
              <Col className="fr-pl-2w">
                <TextInput
                  label="Local"
                  value={acronymLocal || ''}
                  onChange={(e) => setAcronymLocal(e.target.value)}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col n="12" className="fr-pb-5w">
            <Row>
              <Col>
                <Title as="h3" look="h6">
                  Dates
                </Title>
              </Col>
            </Row>
            <Row>
              <Col className="fr-pb-2w">
                <DateInput
                  value={startDate}
                  label="Date de début"
                  onDateChange={(v) => setStartDate(v)}
                  isRequired
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <DateInput
                  value={endDate}
                  label="Date de fin"
                  onDateChange={(v) => setEndDate(v)}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col n="4" className="fr-pr-2w">
            <Select
              label="Article"
              options={options}
              selected={article}
              onChange={(e) => setArticle(e.target.value)}
              tanindex="0"
            />
          </Col>
          <Col className="fr-pl-2w">
            <TextInput
              textarea
              label="Commentaire"
              value={comment || ''}
              onChange={(e) => setComment(e.target.value)}
            />
          </Col>
        </Row>
        <hr />
        {savingErrors || null}
        <Row>
          <Col>
            <ButtonGroup isEquisized align="right" isInlineFrom="md">
              {(data?.id) && (
                <Button
                  onClick={() => onDeleteHandler(data.id)}
                  color="error"
                  secondary
                  disabled={!data}
                  icon="ri-chat-delete-line"
                >
                  Supprimer
                </Button>
              )}
              <Button icon="ri-save-line" onClick={onSave}>Sauvegarder</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </form>
  );
}

EmailForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
};

EmailForm.defaultProps = {
  data: null,
  onDeleteHandler: null,
};
