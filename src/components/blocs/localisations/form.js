import {
  ButtonGroup,
  Container,
  Col,
  Row,
  TextInput,
  Alert,
  Title,
  RadioGroup,
  Radio,
  Text,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '../../button';
import DateInput from '../../date-input';
import validator from './validator';
import Map from '../../map';

export default function LocalisationForm({ data, onDeleteHandler, onSaveHandler }) {
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

  // const lat = '48.84450';
  // const lng = '2.276411';

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
      // coordinates,
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

  const setGPS = (value) => {
    const valueArr = value.split(',');
    if (valueArr.length === 2) {
      setCoordinates({ lat: valueArr[0], lng: valueArr[1] });
    }
  };

  const getGPSLabel = () => {
    if (coordinates?.lat && coordinates?.lng) {
      return (`${coordinates.lat}, ${coordinates.lng}`);
    }
    return '';
  };

  const renderMap = () => {
    if (coordinates?.lat && coordinates?.lng) {
      return (
        <Map
          lat={coordinates.lat}
          lng={coordinates.lng}
          markers={[
            {
              address: 'currentLocalisation.address',
              latLng: [
                coordinates.lat,
                coordinates.lng,
              ],
            },
          ]}
        />
      );
    }
    return null;
  };

  return (
    <form>
      <Container>
        <Row>
          <Col>
            <RadioGroup isInline>
              <Radio label="France" defaultChecked />
              <Radio label="Hors France" />
            </RadioGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <TextInput label="Adresse recherchée" />
          </Col>
        </Row>

        <Row className="fr-pt-5w">
          <Col>
            <Title as="h2" look="h3">
              Coordonnées
            </Title>
          </Col>
        </Row>
        <Row>
          <Col n="md-8" className="fr-pb-2w fr-pr-1w">
            <TextInput
              label="Adresse"
              value={address || ''}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Col>
          <Col className="fr-pb-2w fr-pl-1w">
            <TextInput
              label="Lieu dit"
              value={place || ''}
              onChange={(e) => setPlace(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col className="fr-pb-2w fr-pr-1w">
            <TextInput
              label="Mention de distribution"
              value={distributionStatement || ''}
              onChange={(e) => setDistributionStatement(e.target.value)}
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
        <Row gutters alignItems="bottom">
          <Col n="md-3" className="fr-pb-2w fr-pr-1w">
            <TextInput
              label="Commune"
              value={locality || ''}
              onChange={(e) => setLocality(e.target.value)}
            />
          </Col>
          <Col n="md-3" className="fr-pb-2w fr-pl-1w fr-pr-1w">
            <TextInput
              label="Code postal"
              value={postalCode || ''}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </Col>
          <Col className="fr-pb-2w fr-pl-1w fr-pr-1w">
            <Text>{cityId || ''}</Text>
            {/* <TextInput
              label="Code commune"
              value={cityId || ''}
              onChange={(e) => setCityId(e.target.value)}
            /> */}
          </Col>
          <Col n="md-4" className="fr-pb-2w fr-pl-1w">
            <TextInput
              label="Pays"
              value={country || ''}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col n="md-6" className="fr-pr-1w">
            <TextInput
              label="Téléphone"
              value={telephone || ''}
              onChange={(e) => setTelephone(e.target.value)}
            />
          </Col>
        </Row>

        <Row className="fr-pt-5w">
          <Col>
            <Title as="h2" look="h3">
              Coordonnées GPS
            </Title>
          </Col>
        </Row>
        <Row>
          <Col n="md-4" className="fr-pr-2w">
            <TextInput
              label="Coordonnées (latitude, longitude)"
              hint="exemple : 48.84450, 2.276411"
              value={getGPSLabel()}
              onChange={(e) => setGPS(e.target.value)}
            />
          </Col>
          <Col>
            {renderMap()}
          </Col>
        </Row>
        <Row className="fr-pt-5w">
          <Col>
            <Title as="h2" look="h3">
              Dates
            </Title>
          </Col>
        </Row>
        <Row>
          <Col className="fr-pb-2w fr-pl-1w fr-pr-1w">
            <DateInput
              value={startDate}
              label="Date de début"
              onDateChange={(v) => setStartDate(v)}
              isRequired
            />
          </Col>
          <Col className="fr-pb-2w fr-pl-1w">
            <DateInput
              value={endDate}
              label="Date de fin"
              onDateChange={(v) => setEndDate(v)}
            />
          </Col>
        </Row>
        <hr />
        {savingErrors || null}

        <ButtonGroup align="right" isInlineFrom="md" className="fr-btns--space-between">
          {(data?.id) && (
            <Button
              onClick={() => onDeleteHandler(data.id)}
              color="error"
              secondary
              icon="ri-chat-delete-line"
            >
              Supprimer
            </Button>
          )}
          <Button icon="ri-save-line" onClick={onSave}>Sauvegarder</Button>
        </ButtonGroup>

      </Container>
    </form>
  );
}

LocalisationForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
};

LocalisationForm.defaultProps = {
  data: null,
  onDeleteHandler: null,
};
