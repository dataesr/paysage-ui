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
import FormFooter from '../../forms/form-footer/form-footer';
import api from '../../../utils/api';

export default function GovernanceForm({ data, onDeleteHandler, onSaveHandler }) {
  const validator = (body) => {
    const errors = {};
    if (!body?.relatedObjectId) {
      errors.relatedObjectId = 'Vous devez séléctionner un objet à lier';
    }
    if (!body?.relationTypeId) {
      errors.relatedObjectId = 'Vous devez séléctionner un type de liaison';
    }
    return errors;
  };

  const [showErrors, setShowErrors] = useState(false);
  const [relatedObjectQuery, setRelatedObjectQuery] = useState('');
  const [startDateOfficialTextQuery, setStartDateOfficialTextQuery] = useState('');
  const [endDateOfficialTextQuery, setEndDateOfficialTextQuery] = useState('');
  const [relationTypesoptions, setRelationTypesOptions] = useState([]);
  const [personsOptions, setPersonsOptions] = useState([]);
  const [startDateOfficialTextOptions, setStartDateOfficialTextOptions] = useState([]);
  const [endDateOfficialTextOptions, setEndDateOfficialTextOptions] = useState([]);
  const { form, updateForm, errors } = useForm(data, validator);

  useEffect(() => {
    const getOptions = async () => {
      const response = await api.get('/relation-types?limit=500').catch((e) => {
        console.log(e);
      });
      if (response.ok) {
        setRelationTypesOptions(
          response.data.data.map((item) => ({
            label: item.usualName,
            value: item.id,
          })),
        );
        if (!data) { // valeur par défaut
          updateForm({ relationTypeId: response.data.data[0].id });
        }
      }
    };
    getOptions();
  }, []);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/autocomplete?query=${relatedObjectQuery}&types=persons`);
      setPersonsOptions(response.data?.data);
    };
    if (relatedObjectQuery) { getAutocompleteResult(); } else { setPersonsOptions([]); }
  }, [relatedObjectQuery]);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/autocomplete?query=${startDateOfficialTextQuery}&types=official-texts`);
      setStartDateOfficialTextOptions(response.data?.data);
    };
    if (startDateOfficialTextQuery) { getAutocompleteResult(); } else { setStartDateOfficialTextOptions([]); }
  }, [startDateOfficialTextQuery]);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/autocomplete?query=${endDateOfficialTextQuery}&types=official-texts`);
      setEndDateOfficialTextOptions(response.data?.data);
    };
    if (endDateOfficialTextQuery) { getAutocompleteResult(); } else { setEndDateOfficialTextOptions([]); }
  }, [endDateOfficialTextQuery]);

  const handleEndDateOfficialTextSelect = ({ id, name }) => {
    updateForm({ endDateOfficialTextName: name, endDateOfficialTextId: id });
    setEndDateOfficialTextQuery('');
    setEndDateOfficialTextOptions([]);
  };
  const handleEndDateOfficialTextOptionsUnselect = () => {
    updateForm({ endDateOfficialTextName: null, endDateOfficialTextId: null });
    setEndDateOfficialTextQuery('');
    setEndDateOfficialTextOptions([]);
  };

  const handleStartDateOfficialTextSelect = ({ id, name }) => {
    updateForm({ startDateOfficialTextName: name, startDateOfficialTextId: id });
    setStartDateOfficialTextQuery('');
    setStartDateOfficialTextOptions([]);
  };
  const handleStartDateOfficialTextOptionsUnselect = () => {
    updateForm({ startDateOfficialTextName: null, startDateOfficialTextId: null });
    setStartDateOfficialTextQuery('');
    setStartDateOfficialTextOptions([]);
  };

  const handlePersonSelect = ({ id, name }) => {
    updateForm({ relatedObjectName: name, relatedObjectId: id });
    relatedObjectQuery('');
    setPersonsOptions([]);
  };
  const handlePersonUnselect = () => {
    updateForm({ relatedObjectName: null, relatedObjectId: null });
    relatedObjectQuery('');
    setPersonsOptions([]);
  };

  return (
    <form>
      <Container>
        <Row>
          <Col n="12" className="fr-pb-5w">
            <SearchBar
              buttonLabel="Rechercher"
              value={relatedObjectQuery || ''}
              label="Personne"
              hint="Recherchez et séléctionnez une personne paysage"
              required
              scope={form.relatedObjectName}
              placeholder={form.relatedObjectId ? '' : 'Rechercher...'}
              onChange={(e) => { updateForm({ relatedObjectId: null }); setRelatedObjectQuery(e.target.value); }}
              options={personsOptions}
              onSelect={handlePersonSelect}
              onDeleteScope={handlePersonUnselect}
            />
          </Col>
          <Col n="12" className="fr-pb-5w">
            <Select
              label="Type"
              options={relationTypesoptions}
              selected={form.relationTypeId}
              onChange={(e) => updateForm({ relationTypeId: e.target.value })}
              tabIndex={0}
              required
              message={(showErrors && errors.relationTypeId) ? errors.relationTypeId : null}
              messageType={(showErrors && errors.relationTypeId) ? 'error' : ''}
            />
          </Col>
          <Col n="12" className="fr-pb-5w">
            <DateInput
              value={form.startDate || ''}
              label="Date de début"
              onDateChange={((v) => updateForm({ startDate: v }))}
            />
          </Col>
          <Col n="12" className="fr-pb-5w">
            <SearchBar
              buttonLabel="Rechercher"
              value={startDateOfficialTextQuery || ''}
              label="Texte officiel de début de relation"
              hint="Recherchez et séléctionnez un text officiel paysage"
              scope={form.startDateOfficialTextId}
              placeholder={form.startDateOfficialTextId ? '' : 'Rechercher...'}
              onChange={(e) => { updateForm({ startDateOfficialTextId: null }); setStartDateOfficialTextQuery(e.target.value); }}
              options={startDateOfficialTextOptions}
              onSelect={handleStartDateOfficialTextSelect}
              onDeleteScope={handleStartDateOfficialTextOptionsUnselect}
            />
          </Col>
          <Col n="12" className="fr-pb-5w">
            <DateInput
              value={form.endDate || ''}
              label="Date de fin"
              onDateChange={((v) => updateForm({ endDate: v }))}
            />
          </Col>
          <Col n="12" className="fr-pb-5w">
            <SearchBar
              buttonLabel="Rechercher"
              value={endDateOfficialTextQuery || ''}
              label="Texte officiel de fin de relation"
              hint="Recherchez et séléctionnez une personne paysage"
              scope={form.endDateOfficialTextId}
              placeholder={form.endDateOfficialTextId ? '' : 'Rechercher...'}
              onChange={(e) => { updateForm({ endDateOfficialTextId: null }); setEndDateOfficialTextQuery(e.target.value); }}
              options={endDateOfficialTextOptions}
              onSelect={handleEndDateOfficialTextSelect}
              onDeleteScope={handleEndDateOfficialTextOptionsUnselect}
            />
          </Col>
        </Row>
        <FormFooter
          id={data?.id}
          onSaveHandler={onSaveHandler}
          onDeleteHandler={onDeleteHandler}
        />
      </Container>
    </form>
  );
}

GovernanceForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
};

GovernanceForm.defaultProps = {
  data: {},
  onDeleteHandler: null,
};
