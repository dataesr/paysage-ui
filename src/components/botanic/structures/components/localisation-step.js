import { useCallback, useEffect, useRef, useState } from 'react';
import { Col, Row, Radio, RadioGroup, TextInput } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import Map from '../../../map';
import SearchBar from '../../../search-bar';
import useDebounce from '../../../../hooks/useDebounce';
import getCountryISO3 from '../../../../utils/country-codes';

function sanitize(form) {
  const fields = [
    'address', 'city', 'cityId', 'coordinates', 'country', 'distributionStatement',
    'iso3', 'locality', 'phonenumber', 'place', 'postalCode', 'postOfficeBoxNumber',
  ];
  const body = {};
  Object.keys(form).forEach((key) => {
    if (fields.includes(key) && form[key] !== undefined && form[key] !== '') {
      body[key] = (key === 'phonenumber')
        ? form[key].replace(/\s/g, '').replace(/[-.]/g, '')
        : form[key];
    }
  });
  body.coordinates = {
    lat: parseFloat(body.coordinates?.lat || 0),
    lng: parseFloat(body.coordinates?.lng || 0),
  };
  return body;
}

export default function LocalisationStep({ onBodyChange, locationHint }) {
  const [form, setForm] = useState({ country: 'France', iso3: 'FRA' });
  const [isFrance, setIsFrance] = useState(true);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  const [scope, setScope] = useState(null);
  const [options, setOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const appliedHintRef = useRef(null);

  const updateForm = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!locationHint || locationHint === appliedHintRef.current) return;
    appliedHintRef.current = locationHint;
    if (locationHint.coordinates) {
      const isFR = !locationHint.countryCode || locationHint.countryCode.toUpperCase() === 'FR';
      setIsFrance(isFR);
      let iso3 = locationHint.iso3 || '';
      if (!iso3 && isFR) iso3 = 'FRA';
      else if (!iso3 && locationHint.countryCode) iso3 = getCountryISO3[locationHint.countryCode.toUpperCase()] || '';
      updateForm({
        ...(locationHint.streetAddress ? { address: locationHint.streetAddress } : {}),
        ...(locationHint.city ? { city: locationHint.city, locality: locationHint.city } : {}),
        country: locationHint.country || (isFR ? 'France' : ''),
        iso3,
        coordinates: locationHint.coordinates,
      });
      const hint = [locationHint.streetAddress, locationHint.city, locationHint.country].filter(Boolean).join(', ');
      if (hint) setQuery(hint);
    } else if (locationHint.searchQuery) {
      const isFR = !locationHint.countryCode || locationHint.countryCode.toUpperCase() === 'FR';
      setIsFrance(isFR);
      setQuery(locationHint.searchQuery);
    }
  }, [locationHint]);

  useEffect(() => {
    onBodyChange(sanitize(form));
  }, [form, onBodyChange]);

  useEffect(() => {
    if (debouncedQuery.length <= 3) { setOptions([]); return; }
    const getResults = async () => {
      setIsSearching(true);
      try {
        const url = isFrance
          ? `https://data.geopf.fr/geocodage/search/?q=${debouncedQuery}`
          : `https://nominatim.openstreetmap.org/search?q=${debouncedQuery}&format=jsonv2&addressdetails=1`;
        const res = await fetch(url);
        const json = await res.json();
        const opt = isFrance
          ? json.features.map((el) => ({ name: `${el.properties.label} (${el.properties.context})`, data: el }))
          : json.map((el) => ({ name: el.display_name, data: el }));
        setOptions(opt);
      } finally {
        setIsSearching(false);
      }
    };
    getResults();
  }, [debouncedQuery, isFrance]);

  const handleSelect = (element) => {
    if (!element.data?.osm_id) {
      updateForm({
        address: element.data.properties.name,
        cityId: element.data.properties.citycode,
        postalCode: element.data.properties.postcode,
        country: 'France',
        iso3: 'FRA',
        locality: element.data.properties.city,
        city: element.data.properties.city,
        coordinates: {
          lat: element.data.geometry.coordinates[1],
          lng: element.data.geometry.coordinates[0],
        },
      });
    } else {
      updateForm({
        iso3: getCountryISO3[element.data?.address?.country_code?.toUpperCase()],
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
    setScope(element.name);
    setQuery('');
    setOptions([]);
  };

  const handleUnselect = () => { setScope(null); setQuery(''); setOptions([]); };

  const onMarkerDragEnd = useCallback((e) => {
    const position = e.target.getLatLng();
    updateForm({ coordinates: { lat: position.lat, lng: position.lng } });
  }, []);

  const markers = form.coordinates?.lat && form.coordinates?.lng
    ? [{ address: form.address, latLng: [form.coordinates.lat, form.coordinates.lng] }]
    : [];

  const gpsLabel = form.coordinates?.lat && form.coordinates?.lng
    ? `${form.coordinates.lat}, ${form.coordinates.lng}` : '';

  const setGPS = (value) => {
    const parts = value?.split(',');
    if (parts?.length === 2) {
      updateForm({ coordinates: { lat: parts[0].trim(), lng: parts[1].trim() } });
    }
  };

  return (
    <Row gutters>
      <Col n="12">
        <RadioGroup isInline>
          <Radio
            label="France"
            onChange={() => { setIsFrance(true); updateForm({ country: 'France', iso3: 'FRA' }); }}
            checked={isFrance}
          />
          <Radio
            label="Hors France"
            onChange={() => { setIsFrance(false); updateForm({ country: '', iso3: '' }); }}
            checked={!isFrance}
          />
        </RadioGroup>
      </Col>
      <Col n="12">
        <SearchBar
          buttonLabel="Rechercher"
          hint="Rechercher et sélectionner une adresse"
          isSearching={isSearching}
          label="Adresse recherchée"
          onDeleteScope={handleUnselect}
          onChange={(e) => setQuery(e.target.value)}
          onSelect={handleSelect}
          options={options}
          scope={scope}
          size="lg"
          value={query}
        />
      </Col>
      <Col n="12">
        <TextInput
          label="Mention de distribution"
          value={form.distributionStatement || ''}
          onChange={(e) => updateForm({ distributionStatement: e.target.value })}
        />
      </Col>
      <Col n="12">
        <TextInput
          label="Adresse"
          value={form.address || ''}
          onChange={(e) => updateForm({ address: e.target.value })}
        />
      </Col>
      <Col n="8 md-8">
        <TextInput
          label="Lieu dit"
          value={form.place || ''}
          onChange={(e) => updateForm({ place: e.target.value })}
        />
      </Col>
      <Col n="4 md-4">
        <TextInput
          label="BP"
          value={form.postOfficeBoxNumber || ''}
          onChange={(e) => updateForm({ postOfficeBoxNumber: e.target.value })}
        />
      </Col>
      <Col n="4 md-4">
        <TextInput
          label="Code postal"
          value={form.postalCode || ''}
          onChange={(e) => updateForm({ postalCode: e.target.value })}
        />
      </Col>
      <Col n="8 md-8">
        <TextInput
          label="Localité"
          value={form.locality || ''}
          onChange={(e) => updateForm({ locality: e.target.value })}
        />
      </Col>
      <Col n="12 md-6">
        <TextInput
          label="Commune"
          value={form.city || ''}
          onChange={(e) => updateForm({ city: e.target.value })}
        />
      </Col>
      <Col n="12 md-6">
        <TextInput
          label="Pays"
          value={form.country || ''}
          onChange={(e) => updateForm({ country: e.target.value })}
        />
      </Col>
      <Col n="12 md-6">
        <TextInput
          label="ISO3 (FRA pour la France)"
          value={form.iso3 || ''}
          onChange={(e) => updateForm({ iso3: e.target.value })}
        />
      </Col>
      <Col n="12 md-6">
        <TextInput
          label="Téléphone"
          value={form.phonenumber || ''}
          onChange={(e) => updateForm({ phonenumber: e.target.value })}
        />
      </Col>
      <Col n="12">
        <TextInput
          label="Coordonnées GPS (ex : 48.8445, 2.2764)"
          hint="Vous pouvez modifier les coordonnées en déplaçant le marqueur sur la carte"
          value={gpsLabel}
          onChange={(e) => setGPS(e.target.value)}
        />
      </Col>
      <Col n="12">
        <div aria-hidden>
          <Map
            lat={form.coordinates?.lat || 48.853410}
            lng={form.coordinates?.lng || 2.348800}
            markers={markers}
            onMarkerDragEnd={onMarkerDragEnd}
          />
        </div>
      </Col>
    </Row>
  );
}

LocalisationStep.propTypes = {
  onBodyChange: PropTypes.func.isRequired,
  locationHint: PropTypes.shape({
    searchQuery: PropTypes.string,
    streetAddress: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    iso3: PropTypes.string,
    countryCode: PropTypes.string,
    coordinates: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
  }),
};
LocalisationStep.defaultProps = { locationHint: null };
