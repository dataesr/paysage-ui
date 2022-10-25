import { useEffect, useState } from 'react';
import {
  Container,
  Col,
  Row,
  // Select,
  TagGroup,
  Tag,
  Icon,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import useForm from '../../../hooks/useForm';
import DateInput from '../../date-input';
import SearchBar from '../../search-bar';
import FormFooter from '../form-footer';
import api from '../../../utils/api';
// import useFetch from '../../../hooks/useFetch';
import { parseRelatedElement } from '../../../utils/parse-related-element';
import PaysageBlame from '../../paysage-blame';

function sanitize(form) {
  const newForm = { ...form };
  if (newForm.otherAssociatedObjects?.length) newForm.otherAssociatedObjectIds = newForm.otherAssociatedObjects.map((associated) => associated.id);
  const fields = ['resourceId', 'relatedObjectId', 'relationTypeId', 'relationsGroupId', 'relationTag',
    'startDateOfficialTextId', 'endDateOfficialTextId', 'startDate', 'endDate', 'otherAssociatedObjectIds'];
  const body = {};
  Object.keys(newForm).forEach((key) => { if (fields.includes(key)) { body[key] = newForm[key]; } });
  return body;
}

export default function LaureateForm({ id, resourceType, relatedObjectTypes, data, onDelete, onSave, inverse }) {
  const validator = (body) => {
    const errors = {};
    if (!body?.relatedObjectId && !inverse) {
      errors.relatedObjectId = 'Vous devez sélectionner un objet à lier';
    }
    if (!body?.resourceId && inverse) {
      errors.relatedObjectId = 'Vous devez sélectionner un objet à lier';
    }
    return errors;
  };
  // const relationTypeUrl = (relatedObjectTypes.length > 1)
  //   ? `/relation-types?limit=500&filters[for][$in]=${relatedObjectTypes.join('&filters[for][$in]=')}`
  //   : `/relation-types?limit=500&filters[for]=${relatedObjectTypes[0]}`;

  // const { data: relationTypes } = useFetch(relationTypeUrl);

  // const [showErrors, setShowErrors] = useState(false);

  const [associatedQuery, setAssociatedQuery] = useState('');
  const [relatedObjectQuery, setRelatedObjectQuery] = useState('');
  const [resourceQuery, setResourceQuery] = useState('');
  // const [startDateOfficialTextQuery, setStartDateOfficialTextQuery] = useState('');
  // const [endDateOfficialTextQuery, setEndDateOfficialTextQuery] = useState('');

  const [associatedOptions, setAssociatedOptions] = useState([]);
  const [resourceOptions, setResourceOptions] = useState([]);
  const [relatedObjectOptions, setRelatedObjectOptions] = useState([]);
  // const [startDateOfficialTextOptions, setStartDateOfficialTextOptions] = useState([]);
  // const [endDateOfficialTextOptions, setEndDateOfficialTextOptions] = useState([]);

  const { form, updateForm } = useForm(parseRelatedElement(data), validator);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const types = encodeURIComponent(relatedObjectTypes.join(','));
      const response = await api.get(`/autocomplete?query=${relatedObjectQuery}&types=${types}`);
      setRelatedObjectOptions(response.data?.data);
    };
    if (relatedObjectQuery) { getAutocompleteResult(); } else { setRelatedObjectOptions([]); }
  }, [relatedObjectQuery, relatedObjectTypes]);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/autocomplete?query=${resourceQuery}&types=${resourceType}`);
      setResourceOptions(response.data?.data);
    };
    if (resourceQuery) { getAutocompleteResult(); } else { setResourceOptions([]); }
  }, [resourceQuery, resourceType]);

  // useEffect(() => {
  //   const getAutocompleteResult = async () => {
  //     const response = await api.get(`/autocomplete?query=${startDateOfficialTextQuery}&types=official-texts`);
  //     setStartDateOfficialTextOptions(response.data?.data);
  //   };
  //   if (startDateOfficialTextQuery) { getAutocompleteResult(); } else { setStartDateOfficialTextOptions([]); }
  // }, [startDateOfficialTextQuery]);

  // useEffect(() => {
  //   const getAutocompleteResult = async () => {
  //     const response = await api.get(`/autocomplete?query=${endDateOfficialTextQuery}&types=official-texts`);
  //     setEndDateOfficialTextOptions(response.data?.data);
  //   };
  //   if (endDateOfficialTextQuery) { getAutocompleteResult(); } else { setEndDateOfficialTextOptions([]); }
  // }, [endDateOfficialTextQuery]);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/autocomplete?query=${associatedQuery}&types=structures`);
      setAssociatedOptions(response.data?.data);
    };
    if (associatedQuery) { getAutocompleteResult(); } else { setAssociatedOptions([]); }
  }, [associatedQuery]);

  const handleObjectSelect = ({ id: associatedObjectId, name: displayName }) => {
    const currentAssociatedObjects = form.otherAssociatedObjects?.length ? form.otherAssociatedObjects : [];
    updateForm({ otherAssociatedObjects: [...currentAssociatedObjects, { id: associatedObjectId, displayName }] });
    setAssociatedQuery('');
    setAssociatedOptions([]);
  };

  const handleObjectDelete = (objectId) => {
    updateForm({ otherAssociatedObjects: form.otherAssociatedObjects.filter((o) => o.id !== objectId) });
    setAssociatedQuery('');
    setAssociatedOptions([]);
  };

  // const handleEndDateOfficialTextSelect = ({ id: endDateOfficialTextId, name }) => {
  //   updateForm({ endDateOfficialTextName: name, endDateOfficialTextId });
  //   setEndDateOfficialTextQuery('');
  //   setEndDateOfficialTextOptions([]);
  // };
  // const handleEndDateOfficialTextOptionsUnselect = () => {
  //   updateForm({ endDateOfficialTextName: null, endDateOfficialTextId: null });
  //   setEndDateOfficialTextQuery('');
  //   setEndDateOfficialTextOptions([]);
  // };

  // const handleStartDateOfficialTextSelect = ({ id: startDateOfficialTextId, name }) => {
  //   updateForm({ startDateOfficialTextName: name, startDateOfficialTextId });
  //   setStartDateOfficialTextQuery('');
  //   setStartDateOfficialTextOptions([]);
  // };
  // const handleStartDateOfficialTextOptionsUnselect = () => {
  //   updateForm({ startDateOfficialTextName: null, startDateOfficialTextId: null });
  //   setStartDateOfficialTextQuery('');
  //   setStartDateOfficialTextOptions([]);
  // };

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
    // if (Object.keys(errors).length > 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body, id);
  };

  // const relationTypesOptions = (relationTypes?.data)
  //   ? [
  //     { label: 'Appartient à la liste', value: null },
  //     ...relationTypes.data.map((element) => ({ label: element.name, value: element.id })),
  //   ]
  //   : [{ label: 'Appartient à la liste', value: null }];
  return (
    <form>
      <Container>
        <PaysageBlame
          createdBy={data.createdBy}
          updatedBy={data.updatedBy}
          updatedAt={data.updatedAt}
          createdAt={data.createdAt}
        />
        <Row>
          {inverse
            ? (
              <Col n="12" className="fr-pb-2w">
                <SearchBar
                  buttonLabel="Rechercher"
                  value={resourceQuery || ''}
                  label="Objet paysage à lier"
                  hint="Rechercher dans les objects paysage"
                  required
                  scope={form.resourceName}
                  placeholder={form.resourceId ? '' : 'Rechercher...'}
                  onChange={(e) => { updateForm({ resourceId: null }); setResourceQuery(e.target.value); }}
                  options={resourceOptions}
                  onSelect={handleResourceSelect}
                  onDeleteScope={handleResourceUnselect}
                />
              </Col>
            )
            : (
              <Col n="12" className="fr-pb-2w">
                <SearchBar
                  buttonLabel="Rechercher"
                  value={relatedObjectQuery || ''}
                  label="Objet paysage à lier"
                  hint="Rechercher dans les objects paysage"
                  required
                  scope={form.relatedObjectName}
                  placeholder={form.relatedObjectId ? '' : 'Rechercher...'}
                  onChange={(e) => { updateForm({ relatedObjectId: null }); setRelatedObjectQuery(e.target.value); }}
                  options={relatedObjectOptions}
                  onSelect={handleRelatedObjectSelect}
                  onDeleteScope={handleRelatedObjectUnselect}
                />
              </Col>
            )}
          <Col n="12" spacing="pb-2w">
            <SearchBar
              buttonLabel="Rechercher"
              value={associatedQuery || ''}
              label="Structures associées au lauréat"
              placeholder="Rechercher..."
              onChange={(e) => { setAssociatedQuery(e.target.value); }}
              options={associatedOptions}
              onSelect={handleObjectSelect}
            />
            {(form.otherAssociatedObjects?.length > 0) && (
              <Row spacing="mt-2w">
                <TagGroup>
                  {form.otherAssociatedObjects.map((element) => (
                    <Tag key={element.id} onClick={() => handleObjectDelete(element.id)}>
                      {element.displayName}
                      <Icon iconPosition="right" name="ri-close-line" />
                    </Tag>
                  ))}
                </TagGroup>
              </Row>
            )}
          </Col>
          {/* <Col n="12" className="fr-pb-2w">
            <Select
              label="Type de relation"
              options={relationTypesOptions}
              selected={form.relationTypeId}
              onChange={(e) => updateForm({ relationTypeId: e.target.value })}
              tabIndex={0}
              required
              message={(showErrors && errors.relationTypeId) ? errors.relationTypeId : null}
              messageType={(showErrors && errors.relationTypeId) ? 'error' : ''}
            />
          </Col> */}
          <Col n="12" className="fr-pb-2w">
            <DateInput
              value={form.startDate || ''}
              label="Date de début"
              onDateChange={((v) => updateForm({ startDate: v }))}
            />
          </Col>
          {/* <Col n="12" className="fr-pb-2w">
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
            />
          </Col> */}
          {/* <Col n="12" className="fr-pb-2w">
            <DateInput
              value={form.endDate || ''}
              label="Date de fin"
              onDateChange={((v) => updateForm({ endDate: v }))}
            />
          </Col>
          <Col n="12" className="fr-pb-2w">
            <SearchBar
              buttonLabel="Rechercher"
              value={endDateOfficialTextQuery || ''}
              label="Texte officiel de fin de relation"
              hint="Rechercher et sélectionner une personne"
              scope={form.endDateOfficialTextName}
              placeholder={form.endDateOfficialTextId ? '' : 'Rechercher...'}
              onChange={(e) => { updateForm({ endDateOfficialTextId: null }); setEndDateOfficialTextQuery(e.target.value); }}
              options={endDateOfficialTextOptions}
              onSelect={handleEndDateOfficialTextSelect}
              onDeleteScope={handleEndDateOfficialTextOptionsUnselect}
            />
          </Col> */}
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

LaureateForm.propTypes = {
  id: PropTypes.string,
  relatedObjectTypes: PropTypes.arrayOf(PropTypes.string),
  resourceType: PropTypes.string.isRequired,
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  inverse: PropTypes.bool,
};

LaureateForm.defaultProps = {
  id: null,
  relatedObjectTypes: [''],
  data: {},
  onDelete: null,
  inverse: false,
};
