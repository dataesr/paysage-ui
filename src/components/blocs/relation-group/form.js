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
import useFetch from '../../../hooks/useFetch';

const getInitialFormFromData = (data) => {
  if (!data.id) return {};
  const { relatedObject, startDate, endDate } = data;
  let relatedObjectName;
  switch (relatedObject.type) {
  case 'person':
    relatedObjectName = `${relatedObject.firstName} ${relatedObject.lastName}`.trim();
    break;
  case 'structure':
    relatedObjectName = relatedObject.currentName.usualName;
    break;
  case 'price':
    relatedObjectName = relatedObject.nameFr;
    break;
  case 'project':
    relatedObjectName = relatedObject.nameFr;
    break;
  default:
    relatedObjectName = relatedObject.usualNameFr;
    break;
  }
  return ({
    startDate,
    endDate,
    relationTypeId: data.relationType?.id,
    relatedObjectName,
    relatedObjectId: data.relatedObject?.id,
  });
};

const validator = (body) => {
  const errors = {};
  if (!body?.relatedObjectId) {
    errors.relatedObjectId = 'Vous devez séléctionner un objet à lier';
  }
  return errors;
};

export default function RelationForm({ forObjects, data, onDeleteHandler, onSaveHandler }) {
  const relationTypeUrl = (forObjects.length > 1)
    ? `/relation-types?limit=500&filters[for][$in]=${forObjects.join('&filters[for][$in]=') }`
    : `/relation-types?limit=500&filters[for]=${forObjects[0]}`;

  const { data: relationTypes } = useFetch(relationTypeUrl);

  const [showErrors, setShowErrors] = useState(false);

  const [relatedObjectQuery, setRelatedObjectQuery] = useState('');
  const [startDateOfficialTextQuery, setStartDateOfficialTextQuery] = useState('');
  const [endDateOfficialTextQuery, setEndDateOfficialTextQuery] = useState('');

  const [relatedObjectOptions, setRelatedObjectOptions] = useState([]);
  const [startDateOfficialTextOptions, setStartDateOfficialTextOptions] = useState([]);
  const [endDateOfficialTextOptions, setEndDateOfficialTextOptions] = useState([]);

  const { form, updateForm, errors } = useForm(getInitialFormFromData(data), validator);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/autocomplete?query=${relatedObjectQuery}&types=${forObjects.join(',')}`);
      setRelatedObjectOptions(response.data?.data);
    };
    if (relatedObjectQuery) { getAutocompleteResult(); } else { setRelatedObjectOptions([]); }
  }, [relatedObjectQuery, forObjects]);

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

  const handleRelatedObjectSelect = ({ id, name }) => {
    updateForm({ relatedObjectName: name, relatedObjectId: id });
    setRelatedObjectQuery('');
    setRelatedObjectOptions([]);
  };
  const handleRelatedObjectUnselect = () => {
    updateForm({ relatedObjectName: null, relatedObjectId: null });
    setRelatedObjectQuery('');
    setRelatedObjectOptions([]);
  };

  const handleSave = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    return onSaveHandler(form);
  };

  const relationTypesOptions = (relationTypes?.data)
    ? [
      { label: 'Appartient à la liste', value: null },
      ...relationTypes.data.map((element) => ({ label: element.name, value: element.id })),
    ]
    : [{ label: 'Appartient à la liste', value: null }];

  return (
    <form>
      <Container>
        <Row>
          <Col n="12" className="fr-pb-5w">
            <SearchBar
              buttonLabel="Rechercher"
              value={relatedObjectQuery || ''}
              label="Objet paysage à lier"
              hint="Recherchez dans les objects paysage"
              required
              scope={form.relatedObjectName}
              placeholder={form.relatedObjectId ? '' : 'Rechercher...'}
              onChange={(e) => { updateForm({ relatedObjectId: null }); setRelatedObjectQuery(e.target.value); }}
              options={relatedObjectOptions}
              onSelect={handleRelatedObjectSelect}
              onDeleteScope={handleRelatedObjectUnselect}
            />
          </Col>
          <Col n="12" className="fr-pb-5w">
            <Select
              label="Type"
              options={relationTypesOptions}
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
          onSaveHandler={handleSave}
          onDeleteHandler={onDeleteHandler}
        />
      </Container>
    </form>
  );
}

RelationForm.propTypes = {
  forObjects: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.object,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
};

RelationForm.defaultProps = {
  forObjects: [''],
  data: {},
  onDeleteHandler: null,
};
