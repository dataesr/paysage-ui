import { useEffect, useState } from 'react';
import {
  Container,
  Col,
  Row,
  TextInput,
  Checkbox,
  RadioGroup,
  Radio,
  Title,
  SearchableSelect,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import useForm from '../../../hooks/useForm';
import DateInput from '../../date-input';
import SearchBar from '../../search-bar';
import FormFooter from '../form-footer';
import api from '../../../utils/api';
import useFetch from '../../../hooks/useFetch';
import { parseRelatedElement } from '../../../utils/parse-related-element';
import PaysageBlame from '../../paysage-blame';

function sanitize(form) {
  const fields = ['resourceId', 'relatedObjectId', 'relationTypeId', 'relationTag',
    'startDateOfficialTextId', 'endDateOfficialTextId', 'startDate', 'endDate', 'mandateTemporary', 'mandateReason',
    'mandateEmail', 'mandatePosition', 'mandatePrecision'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function MandateForm({ id, resourceType, relatedObjectTypes, data, onDelete, onSave, inverse }) {
  const validate = (body) => {
    const errors = {};
    if (!body?.relatedObjectId && !inverse) {
      errors.relatedObjectId = 'Vous devez sélectionner un objet à lier';
    }
    if (!body?.resourceId && inverse) {
      errors.relatedObjectId = 'Vous devez sélectionner un objet à lier';
    }
    return errors;
  };
  const relationTypeUrl = (relatedObjectTypes.length > 1)
    ? `/relation-types?limit=500&filters[for][$in]=${relatedObjectTypes.join('&filters[for][$in]=')}`
    : `/relation-types?limit=500&filters[for]=${relatedObjectTypes[0]}`;

  const { data: relationTypes } = useFetch(relationTypeUrl);

  const [showErrors, setShowErrors] = useState(false);

  const [relatedObjectQuery, setRelatedObjectQuery] = useState('');
  const [resourceQuery, setResourceQuery] = useState('');
  const [startDateOfficialTextQuery, setStartDateOfficialTextQuery] = useState('');
  const [endDateOfficialTextQuery, setEndDateOfficialTextQuery] = useState('');

  const [resourceOptions, setResourceOptions] = useState([]);
  const [relatedObjectOptions, setRelatedObjectOptions] = useState([]);
  const [startDateOfficialTextOptions, setStartDateOfficialTextOptions] = useState([]);
  const [endDateOfficialTextOptions, setEndDateOfficialTextOptions] = useState([]);
  const [isSearchingEndDateOfficialText, setIsSearchingEndDateOfficialText] = useState(false);
  const [isSearchingStartDateOfficialText, setIsSearchingStartDateOfficialText] = useState(false);
  const [isSearchingRelatedObject, setIsSearchingRelatedObject] = useState(false);
  const [isSearchingResource, setIsSearchingResource] = useState(false);

  const { form, updateForm, errors } = useForm(parseRelatedElement(data), validate);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearchingRelatedObject(true);
      const types = encodeURIComponent(relatedObjectTypes.join(','));
      const response = await api.get(`/autocomplete?query=${relatedObjectQuery}&types=${types}`);
      setRelatedObjectOptions(response.data?.data);
      setIsSearchingRelatedObject(false);
    };
    if (relatedObjectQuery) { getAutocompleteResult(); } else { setRelatedObjectOptions([]); }
  }, [relatedObjectQuery, relatedObjectTypes]);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearchingResource(true);
      const response = await api.get(`/autocomplete?query=${resourceQuery}&types=${resourceType}`);
      setResourceOptions(response.data?.data);
      setIsSearchingResource(false);
    };
    if (resourceQuery) { getAutocompleteResult(); } else { setResourceOptions([]); }
  }, [resourceQuery, resourceType]);

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

  const handleRelatedObjectSelect = ({ id: relatedObjectId, name }) => {
    updateForm({ relatedObjectName: name, relatedObjectId });
    setRelatedObjectQuery('');
    setRelatedObjectOptions([]);
  };
  const handleRelatedObjectUnselect = () => {
    updateForm({ relatedObjectName: null, relatedObjectId: null });
    setRelatedObjectQuery('');
    setRelatedObjectOptions([]);
  };

  const handleResourceSelect = ({ id: resourceId, name }) => {
    updateForm({ resourceName: name, resourceId });
    setResourceQuery('');
    setResourceOptions([]);
  };
  const handleResourceUnselect = () => {
    updateForm({ resourceName: null, resourceId: null });
    setResourceQuery('');
    setResourceOptions([]);
  };

  const handleSave = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body, id);
  };

  const relationTypesOptions = (relationTypes?.data)
    ? [
      { label: 'Appartient à la liste', value: null },
      ...relationTypes.data
        .map((element) => ({ label: element.name, value: element.id }))
        .sort((a, b) => a.label > b.label),
    ]
    : [{ label: 'Appartient à la liste', value: null }];
  return (
    <form>
      <Container>
        <PaysageBlame
          createdBy={data.createdBy}
          updatedBy={data.updatedBy}
          updatedAt={data.updatedAt}
          createdAt={data.createdAt}
        />
        <Row gutters>
          {inverse
            ? (
              <Col n="12">
                <SearchBar
                  buttonLabel="Rechercher"
                  value={resourceQuery || ''}
                  label="Objet Paysage à lier"
                  hint="Rechercher dans les objets Paysage"
                  required
                  scope={form.resourceName}
                  placeholder={form.resourceId ? '' : 'Rechercher...'}
                  onChange={(e) => { updateForm({ resourceId: null }); setResourceQuery(e.target.value); }}
                  options={resourceOptions}
                  onSelect={handleResourceSelect}
                  onDeleteScope={handleResourceUnselect}
                  isSearching={isSearchingResource}
                />
              </Col>
            )
            : (
              <Col n="12">
                <SearchBar
                  buttonLabel="Rechercher"
                  value={relatedObjectQuery || ''}
                  label="Personne à lier"
                  hint="Rechercher dans les objets Paysage"
                  required
                  scope={form.relatedObjectName}
                  placeholder={form.relatedObjectId ? '' : 'Rechercher...'}
                  onChange={(e) => { updateForm({ relatedObjectId: null }); setRelatedObjectQuery(e.target.value); }}
                  options={relatedObjectOptions}
                  onSelect={handleRelatedObjectSelect}
                  onDeleteScope={handleRelatedObjectUnselect}
                  isSearching={isSearchingRelatedObject}
                />
              </Col>
            )}
          <Col n="12">
            <SearchableSelect
              label="Type de relation"
              options={relationTypesOptions}
              selected={form.relationTypeId}
              onChange={(relationTypeId) => updateForm({ relationTypeId })}
              tabIndex={0}
              required
              message={(showErrors && errors.relationTypeId) ? errors.relationTypeId : null}
              messageType={(showErrors && errors.relationTypeId) ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <TextInput
              label="Intitulé exact de la fonction"
              hint="Si vous avez des informations plus précises sur la fonction exercée, précisez les ici."
              value={form.mandatePrecision}
              onChange={(e) => updateForm({ mandatePrecision: e.target.value })}
              message={(showErrors && errors.mandatePrecision) ? errors.mandatePrecision : null}
              messageType={(showErrors && errors.mandatePrecision) ? 'error' : ''}
            />
          </Col>
          <Col n="12"><Title as="h3" look="h5" spacing="mb-0">Dates</Title></Col>
          <Col n="12">
            <DateInput
              value={form.startDate || ''}
              label="Date de début"
              onDateChange={((v) => updateForm({ startDate: v }))}
            />
          </Col>
          <Col n="12">
            <DateInput
              value={form.endDate || ''}
              label="Date de fin"
              onDateChange={((v) => updateForm({ endDate: v }))}
            />
          </Col>
          <Col n="12"><Title as="h3" look="h5" spacing="mb-0">Textes officiels</Title></Col>
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
          <Col n="12">
            <Title as="h3" look="h5" spacing="mb-0">
              Information du mandat
            </Title>
          </Col>
          <Col n="12">
            <Checkbox
              label="Mandat par intérim"
              checked={form.mandateTemporary}
              onChange={() => updateForm({ mandateTemporary: !form.mandateTemporary })}
              message={(showErrors && errors.mandateTemporary) ? errors.mandateTemporary : null}
              messageType={(showErrors && errors.mandateTemporary) ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <RadioGroup legend="Raison du mandat :" isInline>
              <Radio
                label="élection"
                onChange={() => updateForm({ mandateReason: 'élection' })}
                checked={form.mandateReason === 'élection'}
              />
              <Radio
                label="Nomination"
                onChange={() => updateForm({ mandateReason: 'nomination' })}
                checked={form.mandateReason === 'nomination'}
              />
            </RadioGroup>
          </Col>
          <Col n="12">
            <RadioGroup legend="Position du mandat :" isInline>
              <Radio
                legend="Position du mandat"
                label="1er mandat"
                onChange={() => updateForm({ mandatePosition: '1' })}
                checked={form.mandatePosition === '1'}
              />
              <Radio
                label="2ème mandat"
                onChange={() => updateForm({ mandatePosition: '2' })}
                checked={form.mandatePosition === '2'}
              />
              <Radio
                label="3ème mandat et plus"
                onChange={() => updateForm({ mandatePosition: '3+' })}
                checked={form.mandatePosition === '3+'}
              />
              <Radio
                label="Sans objet"
                onChange={() => updateForm({ mandatePosition: null })}
                checked={!form.mandatePosition}
              />
            </RadioGroup>
          </Col>
          <Col n="12">
            <TextInput
              label="Adresse email associée au mandat :"
              value={form.mandateEmail}
              onChange={(e) => updateForm({ mandateEmail: e.target.value })}
              message={(showErrors && errors.mandateEmail) ? errors.mandateEmail : null}
              messageType={(showErrors && errors.mandateEmail) ? 'error' : ''}
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

MandateForm.propTypes = {
  id: PropTypes.string,
  relatedObjectTypes: PropTypes.arrayOf(PropTypes.string),
  resourceType: PropTypes.string.isRequired,
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  inverse: PropTypes.bool,
};

MandateForm.defaultProps = {
  id: null,
  relatedObjectTypes: [''],
  data: {},
  onDelete: null,
  inverse: false,
};
