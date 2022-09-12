import {
  ButtonGroup,
  Button,
  Icon,
  Container,
  Col,
  Row,
  Title,
  Alert,
  Tag,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DateOneField from '../../date-one-field';
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
  const [categoryName, setCategoryName] = useState(null);
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
    setCategoryName(name);
    setQuery('');
    setOptions([]);
  };

  return (
    <form>
      <Container>
        <Row>
          <Col className="fr-pb-2w">
            <SearchBar
              size="lg"
              buttonLabel="Rechercher"
              value={query}
              label="Rechercher dans paysage"
              placeholder="Rechercher..."
              onChange={(e) => setQuery(e.target.value)}
              options={options}
              optionsIcon="ri-arrow-right-line"
              onSelect={handleSelect}
            />
            <p className="fr-mt-2w">
              {(categoryName) ? <Tag className="bg-categories">{categoryName}</Tag> : null}
            </p>
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
                <DateOneField
                  value={startDate}
                  name="startDate"
                  label="Date de début"
                  onValueChangeHandler={setStartDate}
                  isRequired
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <DateOneField
                  value={endDate}
                  name="endDate"
                  label="Date de fin"
                  onValueChangeHandler={setEndDate}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <hr />
        {savingErrors || null}
        <Row>
          <Col>
            <ButtonGroup size="sm" isEquisized align="right" isInlineFrom="md">
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
  onSaveHandler: PropTypes.func.isRequired,
};
