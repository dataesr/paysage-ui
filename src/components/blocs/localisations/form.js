import {
  Container,
  Col,
  Row,
  TextInput,
  Title,
  RadioGroup,
  Radio,
  Text,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import DateInput from '../../date-input';
import validator from './validator';
import FormFooter from '../../forms/form-footer/form-footer';
import Map from '../../map';
import SearchBar from '../../search-bar';
import useForm from '../../../hooks/useForm';

export default function LocalisationForm({ data, onDeleteHandler, onSaveHandler }) {
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm(data, validator);
  const [isFrance, setIsFrance] = useState(true);
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const url = (isFrance)
        ? `https://api-adresse.data.gouv.fr/search/?q=${query}`
        : `https://nominatim.openstreetmap.org/ui/search.html?q=${query}&format=json&addressDetails=1`;
      const response = await fetch(url);
      const respJson = await response.json();
      const opt = respJson.features.map((element) => ({
        name: `${element.properties.label} (${element.properties.context}})`,
        data: element,
      }));

      setOptions(opt);
    };
    if (query.length > 0) {
      getAutocompleteResult();
    } else {
      setOptions([]);
    }
  }, [query, isFrance]);

  const onSave = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    return onSaveHandler(form);
  };

  const setGPS = (value) => {
    const valueArr = value.split(',');
    if (valueArr.length === 2) {
      updateForm({
        coordinates: {
          lat: valueArr[0],
          lng: valueArr[1],
        },
      });
    }
  };

  const getGPSLabel = () => {
    if (form.coordinates?.lat && form.coordinates?.lng) {
      return (`${form.coordinates.lat}, ${form.coordinates.lng}`);
    }
    return '';
  };

  const renderMap = () => {
    if (form.coordinates?.lat && form.coordinates?.lng) {
      return (
        <>
          <TextInput
            label="Coordonnées (latitude, longitude)"
            hint="exemple : 48.84450, 2.276411"
            value={getGPSLabel()}
            onChange={(e) => setGPS(e.target.value)}
          />
          <Map
            lat={form.coordinates.lat}
            lng={form.coordinates.lng}
            markers={[
              {
                address: 'currentLocalisation.address',
                latLng: [
                  form.coordinates.lat,
                  form.coordinates.lng,
                ],
              },
            ]}
          />
        </>
      );
    }
    return null;
  };

  const handleSelect = (element) => {
    console.log('handleSelect', element);
    updateForm({
      address: element.data.properties.name,
      cityId: element.data.properties.citycode,
      postalCode: element.data.properties.postcode,
      locality: element.data.properties.city,
      coordinates: {
        lat: element.data.geometry.coordinates[1],
        lng: element.data.geometry.coordinates[0],
      },
    });
    // setScope(name);
    setQuery('');
    setOptions([]);
  };

  const handleUnselect = () => {
    setScope(null);
    setQuery('');
    setOptions([]);
  };

  return (
    <form>
      <Container>
        <Row>
          <Col>
            <RadioGroup isInline>
              <Radio label="France" onChange={() => setIsFrance(true)} checked={isFrance} />
              <Radio label="Hors France" onChange={() => setIsFrance(false)} checked={!isFrance} />
            </RadioGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <SearchBar
              size="lg"
              buttonLabel="Rechercher"
              value={query}
              label="Adresse recherchée"
              hint="Recherchez et séléctionnez une adresse"
              scope={scope}
              placeholder={scope ? '' : 'Rechercher...'}
              onChange={(e) => { setQuery(e.target.value); }}
              options={options}
              onSelect={handleSelect}
              onDeleteScope={handleUnselect}
            />
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
              value={form.address}
              onChange={(e) => updateForm({ address: e.target.value })}
              // message={(showErrors && errors.address) ? errors.address : null}
              // messageType={(showErrors && errors.address) ? 'error' : ''}
            />
          </Col>
          <Col className="fr-pb-2w fr-pl-1w">
            <TextInput
              label="Lieu dit"
              value={form.place}
              onChange={(e) => updateForm({ place: e.target.value })}
            />
          </Col>
        </Row>
        <Row>
          <Col className="fr-pb-2w fr-pr-1w">
            <TextInput
              label="Mention de distribution"
              value={form.distributionStatement}
              onChange={(e) => updateForm({ distributionStatement: e.target.value })}
            />
          </Col>
          <Col className="fr-pb-2w fr-pl-1w">
            <TextInput
              label="Numéro de boite postale"
              value={form.postOfficeBoxNumber}
              onChange={(e) => updateForm({ postOfficeBoxNumber: e.target.value })}
            />
          </Col>
        </Row>
        <Row gutters alignItems="bottom">
          <Col n="md-3" className="fr-pb-2w fr-pr-1w">
            <TextInput
              label="Commune"
              value={form.locality}
              onChange={(e) => updateForm({ locality: e.target.value })}
            />
          </Col>
          <Col n="md-3" className="fr-pb-2w fr-pl-1w fr-pr-1w">
            <TextInput
              label="Code postal"
              value={form.postalCode}
              onChange={(e) => updateForm({ postalCode: e.target.value })}
            />
          </Col>
          <Col className="fr-pb-2w fr-pl-1w fr-pr-1w">
            <Text>{form.cityId || ''}</Text>
          </Col>
          <Col n="md-4" className="fr-pb-2w fr-pl-1w">
            <TextInput
              label="Pays"
              value={form.country}
              onChange={(e) => updateForm({ country: e.target.value })}
              required
              message={(showErrors && errors.country) ? errors.country : null}
              messageType={(showErrors && errors.country) ? 'error' : ''}
            />
          </Col>
        </Row>
        <Row>
          <Col n="md-6" className="fr-pr-1w">
            <TextInput
              label="Téléphone"
              value={form.telephone}
              onChange={(e) => updateForm({ telephone: e.target.value })}
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
              value={form.startDate}
              label="Date de début"
              onDateChange={(value) => updateForm({ startDate: value })}
              isRequired
            />
          </Col>
          <Col className="fr-pb-2w fr-pl-1w">
            <DateInput
              value={form.endDate}
              label="Date de fin"
              onDateChange={(value) => updateForm({ endDate: value })}
            />
          </Col>
        </Row>
        <FormFooter
          id={data?.id}
          onSaveHandler={onSave}
          onDeleteHandler={onDeleteHandler}
        />
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
  data: {},
  onDeleteHandler: null,
};
