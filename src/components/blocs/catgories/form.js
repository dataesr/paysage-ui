import {
  ButtonGroup,
  Container,
  Col,
  Row,
  Alert,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '../../button';
import DateInput from '../../date-input';
import SearchBar from '../../search-bar';
import validator from './validator';
import api from '../../../utils/api';

export default function EmailForm({ onSaveHandler }) {
  const [savingErrors, setSavingErrors] = useState(null);
  const [errors, setReturnedErrors] = useState([]);

  const [categoryId, setCategoryId] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);

  const [query, setQuery] = useState('');
  const [scope, setScope] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/autocomplete?query=${query}&types=categories`);
      setOptions(response.data?.data);
    };
    if (query) { getAutocompleteResult(); } else { setOptions([]); }
  }, [query]);

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
      categoryId,
      endDate,
      startDate,
    };

    const { ok, returnedErrors } = validator(body);
    if (ok) {
      onSaveHandler(body);
    } else {
      setErrors(returnedErrors);
    }
  };

  const handleSelect = ({ id, name }) => {
    setCategoryId(id);
    setScope(name);
    setQuery('');
    setOptions([]);
  };
  const handleUnselect = () => {
    setCategoryId(null);
    setScope(null);
    setQuery('');
    setOptions([]);
  };

  return (
    <form>
      <Container>
        <Row>
          <Col n="12" className="fr-pb-5w">
            <SearchBar
              size="lg"
              buttonLabel="Rechercher"
              value={query}
              label="Catégorie"
              hint="Recherchez et séléctionnez une catégorie paysage"
              required
              scope={scope}
              placeholder={scope ? '' : 'Rechercher...'}
              onChange={(e) => { setCategoryId(null); setQuery(e.target.value); }}
              options={options}
              onSelect={handleSelect}
              onDeleteScope={handleUnselect}
            />
          </Col>
          <Col n="12" className="fr-pb-5w">
            <DateInput
              value={startDate}
              label="Date de début"
              onDateChange={(v) => setStartDate(v)}
              required
            />
          </Col>
          <Col n="12" className="fr-pb-5w">
            <DateInput
              value={endDate}
              label="Date de fin"
              onDateChange={(v) => setEndDate(v)}
            />
          </Col>
        </Row>
        <hr />
        {savingErrors || null}
        <Row>
          <Col>
            <ButtonGroup isEquisized align="right" isInlineFrom="md">
              <Button icon="ri-save-line" onClick={onSave}>Sauvegarder</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </form>
  );
}

EmailForm.propTypes = {
  onSaveHandler: PropTypes.func.isRequired,
};
