import {
  Container,
  Col,
  Row,
  TextInput,
  Title,
  RadioGroup,
  Radio,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import DateInput from '../../date-input';
import FormFooter from '../form-footer';
import Map from '../../map/auto-bound-map';
import SearchBar from '../../search-bar';
import useForm from '../../../hooks/useForm';
import useAuth from '../../../hooks/useAuth';
import useDebounce from '../../../hooks/useDebounce';
import PaysageBlame from '../../paysage-blame';

function validate(body) {
  const errors = {};
  if (!body?.country) errors.country = 'Le pays est obligatoire';
  return errors;
}

function sanitize(form) {
  const fields = [
    'cityId', 'distributionStatement', 'address', 'postOfficeBoxNumber', 'postalCode',
    'locality', 'place', 'country', 'telephone', 'coordinates', 'startDate', 'endDate',
  ];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  body.coordinates = {
    lat: parseFloat(body.coordinates.lat),
    lng: parseFloat(body.coordinates.lng),
  };
  return body;
}

export default function LocalisationForm({ id, data, onDelete, onSave }) {
  const { viewer } = useAuth();
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm(data, validate);
  const [isFrance, setIsFrance] = useState(true);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  const [scope, setScope] = useState(null);
  const [options, setOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const url = (isFrance)
        ? `https://api-adresse.data.gouv.fr/search/?q=${debouncedQuery}`
        : `https://nominatim.openstreetmap.org/search?q=${debouncedQuery}&format=jsonv2&addressdetails=1`;
      const response = await fetch(url);
      const respJson = await response.json();
      const opt = (isFrance)
        ? respJson.features.map((element) => ({
          name: `${element.properties.label} (${element.properties.context}})`,
          data: element,
        }))
        : respJson.map((element) => ({
          name: element?.display_name,
          data: element,
        }));

      setOptions(opt);
    };
    if (debouncedQuery.length > 3) {
      setIsSearching(true);
      getAutocompleteResult();
      setIsSearching(false);
    } else {
      setOptions([]);
    }
  }, [debouncedQuery, isFrance]);

  const handleSubmit = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body, id);
  };

  const setGPS = (value) => {
    const valueArr = value?.split(',');
    if (valueArr?.length === 2) {
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

  const handleSelect = (element) => {
    if (!element.data?.osm_id) {
      updateForm({
        address: element.data.properties.name,
        cityId: element.data.properties.citycode,
        postalCode: element.data.properties.postcode,
        country: 'France',
        locality: element.data.properties.city,
        city: element.data.properties.city,
        coordinates: {
          lat: element.data.geometry.coordinates[1],
          lng: element.data.geometry.coordinates[0],
        },
      });
    } else {
      updateForm({
        address: element.data?.display_name,
        cityId: null,
        postalCode: element.data?.address.postcode,
        locality: element.data?.address.city,
        city: element.data?.address.city,
        country: element.data?.address.country,
        coordinates: {
          lat: parseFloat(element.data?.lat),
          lng: parseFloat(element.data?.lon),
        },
      });
    }
    setQuery('');
    setOptions([]);
  };

  const handleUnselect = () => {
    setScope(null);
    setQuery('');
    setOptions([]);
  };

  const onMarkerDragEnd = useCallback((e) => {
    const marker = e.target;
    const position = marker.getLatLng();
    updateForm({ coordinates: { lat: position.lat, lng: position.lng } });
  }, [updateForm]);

  const markers = (form.coordinates?.lat && form.coordinates?.lng)
    ? [{ address: form.address, latLng: [form.coordinates?.lat, form.coordinates?.lng] }]
    : [];

  return (
    <form>
      <Container fluid>
        <PaysageBlame
          createdBy={data.createdBy}
          updatedBy={data.updatedBy}
          updatedAt={data.updatedAt}
          createdAt={data.createdAt}
        />
        <Row gutters>
          <Col n="12">
            <RadioGroup isInline>
              <Radio label="France" onChange={() => setIsFrance(true)} checked={isFrance} />
              <Radio label="Hors France" onChange={() => setIsFrance(false)} checked={!isFrance} />
            </RadioGroup>
          </Col>
          <Col n="12">
            <SearchBar
              size="lg"
              buttonLabel="Rechercher"
              value={query}
              label="Adresse recherchée"
              hint="Rechercher et sélectionner une adresse"
              scope={scope}
              placeholder={scope ? '' : 'Rechercher...'}
              onChange={(e) => { setQuery(e.target.value); }}
              options={options}
              onSelect={handleSelect}
              onDeleteScope={handleUnselect}
              isSearching={isSearching}
            />
          </Col>
          <Col n="12"><Title as="h2" look="h3" spacing="mb-0">Coordonnées</Title></Col>
          <Col n="12 md-8">
            <TextInput
              label="Adresse"
              value={form.address}
              onChange={(e) => updateForm({ address: e.target.value })}

            />
          </Col>
          <Col n="12 md-4">
            <TextInput
              label="Lieu dit"
              value={form.place}
              onChange={(e) => updateForm({ place: e.target.value })}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Mention de distribution"
              value={form.distributionStatement}
              onChange={(e) => updateForm({ distributionStatement: e.target.value })}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Numéro de boite postale"
              value={form.postOfficeBoxNumber}
              onChange={(e) => updateForm({ postOfficeBoxNumber: e.target.value })}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Localité"
              value={form.locality}
              onChange={(e) => updateForm({ locality: e.target.value })}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Code postal"
              value={form.postalCode}
              onChange={(e) => updateForm({ postalCode: e.target.value })}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              disabled={viewer.role !== 'admin'}
              label="Code ville"
              value={form.cityId}
              onChange={(e) => updateForm({ cityId: e.target.value })}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Commune"
              value={form.city}
              onChange={(e) => updateForm({ city: e.target.value })}
            />
          </Col>
          <Col n="md-6">
            <TextInput
              label="Pays"
              value={form.country}
              onChange={(e) => updateForm({ country: e.target.value })}
              required
              message={(showErrors && errors.country) ? errors.country : null}
              messageType={(showErrors && errors.country) ? 'error' : ''}
            />
          </Col>
          <Col n="md-6" className="fr-pr-1w">
            <TextInput
              label="Téléphone"
              value={form.telephone}
              onChange={(e) => updateForm({ telephone: e.target.value })}
            />
          </Col>

          <Col n="12"><Title as="h2" look="h3" spacing="mb-0">Coordonnées GPS</Title></Col>
          <Col n="12">
            <TextInput
              label="Coordonnées (exemple : 48.84450, 2.276411)"
              hint="Vous pouvez modifier les coordonnées en déplaçant le marqueur sur la carte"
              value={getGPSLabel()}
              onChange={(e) => setGPS(e.target.value)}
            />
          </Col>
          <Col n="12">
            <Map
              lat={form.coordinates?.lat || 48.8534100}
              lng={form.coordinates?.lng || 2.3488000}
              markers={markers}
              onMarkerDragEnd={onMarkerDragEnd}
            />
          </Col>
          <Col n="12"><Title as="h2" look="h3" spacing="mb-0">Dates</Title></Col>
          <Col n="12">
            <DateInput
              value={form.startDate}
              label="Date de début"
              onDateChange={(value) => updateForm({ startDate: value })}
              isRequired
            />
          </Col>
          <Col n="12">
            <DateInput
              value={form.endDate}
              label="Date de fin"
              onDateChange={(value) => updateForm({ endDate: value })}
            />
          </Col>
        </Row>
        <FormFooter
          id={data?.id}
          onSaveHandler={handleSubmit}
          onDeleteHandler={onDelete}
        />
      </Container>
    </form>
  );
}

LocalisationForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

LocalisationForm.defaultProps = {
  id: null,
  data: {},
  onDelete: null,
};
