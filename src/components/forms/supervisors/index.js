import { useEffect, useState } from 'react';
import {
  Container,
  Col,
  Row,
  Select,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import useForm from '../../../hooks/useForm';
import DateInput from '../../date-input';
import SearchBar from '../../search-bar';
import FormFooter from '../form-footer';
import api from '../../../utils/api';
import { parseRelatedElement } from '../../../utils/parse-related-element';
import PaysageBlame from '../../paysage-blame';
import useFetch from '../../../hooks/useFetch';
import { capitalize } from '../../../utils/strings';

function sanitize(form) {
  const fields = ['resourceId', 'relatedObjectId', 'relationTag',
    'startDateOfficialTextId', 'endDateOfficialTextId', 'startDate', 'endDate'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}
export default function SupervisorsForm({ id, data, onDelete, onSave }) {
  const validator = (body) => {
    const errors = {};
    if (!body?.resourceId) {
      errors.resourceId = 'Vous devez sélectionner un objet à lier';
    }
    return errors;
  };

  const [showErrors, setShowErrors] = useState(false);

  const [startDateOfficialTextQuery, setStartDateOfficialTextQuery] = useState('');
  const [endDateOfficialTextQuery, setEndDateOfficialTextQuery] = useState('');

  const [startDateOfficialTextOptions, setStartDateOfficialTextOptions] = useState([]);
  const [endDateOfficialTextOptions, setEndDateOfficialTextOptions] = useState([]);
  const [isSearchingStartDateOfficialText, setIsSearchingStartDateOfficialText] = useState(false);
  const [isSearchingEndDateOfficialText, setIsSearchingEndDateOfficialText] = useState(false);

  const { form, updateForm, errors } = useForm(parseRelatedElement(data), validator);

  const { data: ministers } = useFetch('/supervising-ministers?limit=500');
  const ministersOptions = (ministers?.data)
    ? [
      { label: 'Sélectionner', value: null },
      ...ministers.data
        .map((element) => ({ label: capitalize(element.usualName), value: element.id }))
        .sort((a, b) => a.label > b.label),
    ]
    : [{ label: 'Sélectionner', value: null }];

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearchingStartDateOfficialText(true);
      const response = await api.get(`/autocomplete?query=${startDateOfficialTextQuery}&types=official-texts`);
      setStartDateOfficialTextOptions(response.data?.data);
      setIsSearchingStartDateOfficialText(false);
    };
    if (startDateOfficialTextQuery) { getAutocompleteResult(); } else { setStartDateOfficialTextOptions([]); }
  }, [startDateOfficialTextQuery]);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearchingEndDateOfficialText(true);
      const response = await api.get(`/autocomplete?query=${endDateOfficialTextQuery}&types=official-texts`);
      setEndDateOfficialTextOptions(response.data?.data);
      setIsSearchingEndDateOfficialText(false);
    };
    if (endDateOfficialTextQuery) { getAutocompleteResult(); } else { setEndDateOfficialTextOptions([]); }
  }, [endDateOfficialTextQuery]);

  const handleEndDateOfficialTextSelect = ({ id: endDateOfficialTextId, name }) => {
    updateForm({ endDateOfficialTextName: name, endDateOfficialTextId });
    setEndDateOfficialTextQuery('');
    setEndDateOfficialTextOptions([]);
  };
  const handleEndDateOfficialTextOptionsUnselect = () => {
    updateForm({ endDateOfficialTextName: null, endDateOfficialTextId: null });
    setEndDateOfficialTextQuery('');
    setEndDateOfficialTextOptions([]);
  };

  const handleStartDateOfficialTextSelect = ({ id: startDateOfficialTextId, name }) => {
    updateForm({ startDateOfficialTextName: name, startDateOfficialTextId });
    setStartDateOfficialTextQuery('');
    setStartDateOfficialTextOptions([]);
  };
  const handleStartDateOfficialTextOptionsUnselect = () => {
    updateForm({ startDateOfficialTextName: null, startDateOfficialTextId: null });
    setStartDateOfficialTextQuery('');
    setStartDateOfficialTextOptions([]);
  };

  const handleSave = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body, id);
  };

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
            <Select
              label="Ministre de tutelle"
              options={ministersOptions}
              selected={form.resourceId}
              onChange={(e) => updateForm({ resourceId: e.target.value })}
              required
              message={(showErrors && errors.resourceId) ? errors.resourceId : null}
              messageType={(showErrors && errors.resourceId) ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <DateInput
              value={form.startDate || ''}
              label="Date de début"
              onDateChange={((v) => updateForm({ startDate: v }))}
            />
          </Col>
          <Col n="12">
            <SearchBar
              buttonLabel="Rechercher"
              value={startDateOfficialTextQuery || ''}
              label="Texte officiel de début de relation"
              hint="Rechercher et sélectionner un texte officiel"
              scope={form.startDateOfficialTextName}
              placeholder={form.startDateOfficialTextId ? '' : 'Rechercher...'}
              onChange={(e) => { updateForm({ startDateOfficialTextId: null }); setStartDateOfficialTextQuery(e.target.value); }}
              options={startDateOfficialTextOptions}
              onSelect={handleStartDateOfficialTextSelect}
              onDeleteScope={handleStartDateOfficialTextOptionsUnselect}
              isSearching={isSearchingStartDateOfficialText}
            />
          </Col>
          <Col n="12">
            <DateInput
              value={form.endDate || ''}
              label="Date de fin"
              onDateChange={((v) => updateForm({ endDate: v }))}
            />
          </Col>
          <Col n="12">
            <SearchBar
              buttonLabel="Rechercher"
              value={endDateOfficialTextQuery || ''}
              label="Texte officiel de fin de relation"
              hint="Rechercher et sélectionner un texte officiel"
              scope={form.endDateOfficialTextName}
              placeholder={form.endDateOfficialTextId ? '' : 'Rechercher...'}
              onChange={(e) => { updateForm({ endDateOfficialTextId: null }); setEndDateOfficialTextQuery(e.target.value); }}
              options={endDateOfficialTextOptions}
              onSelect={handleEndDateOfficialTextSelect}
              onDeleteScope={handleEndDateOfficialTextOptionsUnselect}
              isSearching={isSearchingEndDateOfficialText}
            />
          </Col>
        </Row>
        <FormFooter
          id={id}
          onSaveHandler={handleSave}
          onDeleteHandler={onDelete}
        />
      </Container>
    </form>
  );
}

SupervisorsForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

SupervisorsForm.defaultProps = {
  id: null,
  data: {},
  onDelete: null,
};
