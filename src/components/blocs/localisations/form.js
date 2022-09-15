import {
  ButtonGroup,
  Button,
  Icon,
  Container,
  Col,
  Row,
  TextInput,
  Alert,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DateOneField from '../../date-one-field';
import validator from './validator';

export default function EmailForm({ data, onDeleteHandler, onSaveHandler }) {
  const [savingErrors, setSavingErrors] = useState(null);
  const [errors, setReturnedErrors] = useState([]);

  const [cityId, setCityId] = useState(null);
  const [distributionStatement, setDistributionStatement] = useState(null);
  const [address, setAddress] = useState(null);
  const [postOfficeBoxNumber, setPostOfficeBoxNumber] = useState(null);
  const [postalCode, setPostalCode] = useState(null);
  const [locality, setLocality] = useState(null);
  const [place, setPlace] = useState(null);
  const [country, setCountry] = useState(null); // required
  const [telephone, setTelephone] = useState(null);
  const [coordinates, setCoordinates] = useState(null); // {lat: null, lon: null}
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (data) {
      setCityId(data.cityId || null);
      setDistributionStatement(data.distributionStatement || null);
      setAddress(data.address || null);
      setPostOfficeBoxNumber(data.postOfficeBoxNumber || null);
      setPostalCode(data.postalCode || null);
      setLocality(data.locality || null);
      setPlace(data.place || null);
      setCountry(data.country || null);
      setTelephone(data.telephone || null);
      setCoordinates(data.coordinates || null);
      setStartDate(data.startDate || null);
      setEndDate(data.endDate || null);
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
      cityId,
      distributionStatement,
      address,
      postOfficeBoxNumber,
      postalCode,
      locality,
      place,
      country,
      telephone,
      coordinates,
      startDate,
      endDate,
    };

    const { ok, returnedErrors } = validator(body);
    if (ok) {
      onSaveHandler(data?.id || null, body);
    } else {
      setErrors(returnedErrors);
    }
  };

  return (
    <form>
      <Container>
        <Row>
          <Col className="fr-pb-2w fr-pr-1w">
            <TextInput
              label="Commune"
              value={locality || ''}
              onChange={(e) => setLocality(e.target.value)}
            />
          </Col>
          <Col className="fr-pb-2w fr-pl-1w">
            <TextInput
              label="Code commune"
              value={cityId || ''}
              onChange={(e) => setCityId(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col className="fr-pb-2w">
            <TextInput
              label="Mention de distribution"
              value={distributionStatement || ''}
              onChange={(e) => setDistributionStatement(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col className="fr-pb-2w">
            <TextInput
              label="Adresse"
              value={address || ''}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col className="fr-pb-2w fr-pr-1w">
            <TextInput
              label="Lieu dit"
              value={place || ''}
              onChange={(e) => setPlace(e.target.value)}
            />
          </Col>
          <Col className="fr-pb-2w fr-pl-1w">
            <TextInput
              label="Numéro de boite postale"
              value={postOfficeBoxNumber || ''}
              onChange={(e) => setPostOfficeBoxNumber(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col className="fr-pb-2w fr-pr-1w">
            <TextInput
              label="Code postal"
              value={postalCode || ''}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </Col>
          <Col className="fr-pb-2w fr-pl-1w">
            <TextInput
              label="Pays"
              value={country || ''}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col className="fr-pb-2w fr-pr-1w">
            <TextInput
              label="Téléphone"
              value={telephone || ''}
              onChange={(e) => setTelephone(e.target.value)}
            />
          </Col>
          <Col className="fr-pb-2w fr-pl-1w">
            <TextInput
              label="Coordonnées"
              value={coordinates || ''}
              onChange={(e) => setCoordinates(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col className="fr-pb-2w fr-pr-1w">
            <DateOneField
              value={startDate}
              name="startDate"
              label="Date de début"
              onValueChangeHandler={setStartDate}
              isRequired
            />
          </Col>
          <Col className="fr-pb-2w fr-pl-1w">
            <DateOneField
              value={endDate}
              name="endDate"
              label="Date de fin"
              onValueChangeHandler={setEndDate}
            />
          </Col>
        </Row>
        <hr />
        {savingErrors || null}
        <Row>
          <Col>
            <ButtonGroup size="sm" isEquisized align="right" isInlineFrom="md">
              <Button
                onClick={() => onDeleteHandler(data?.id || null)}
                className="bt-delete"
                disabled={!data}
              >
                <Icon name="ri-chat-delete-line" size="lg" />
                Supprimer
              </Button>
              <Button onClick={onSave}>
                <Icon name="ri-save-line" size="lg" />
                Sauvegarder
              </Button>
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
