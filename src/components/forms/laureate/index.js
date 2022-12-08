import { useEffect, useState } from 'react';
import {
  Container,
  Col,
  Row,
  // Select,
  TagGroup,
  Tag,
  Icon,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import useForm from '../../../hooks/useForm';
import DateInput from '../../date-input';
import SearchBar from '../../search-bar';
import FormFooter from '../form-footer';
import api from '../../../utils/api';
import { parseRelatedElement } from '../../../utils/parse-related-element';
import PaysageBlame from '../../paysage-blame';

function sanitize(form) {
  const newForm = { ...form };
  if (newForm.otherAssociatedObjects?.length) newForm.otherAssociatedObjectIds = newForm.otherAssociatedObjects.map((associated) => associated.id);
  const fields = ['resourceId', 'relatedObjectId', 'relationTypeId', 'relationsGroupId', 'relationTag', 'startDate', 'endDate', 'otherAssociatedObjectIds', 'laureatePrecision'];
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

  const [associatedQuery, setAssociatedQuery] = useState('');
  const [relatedObjectQuery, setRelatedObjectQuery] = useState('');
  const [resourceQuery, setResourceQuery] = useState('');

  const [associatedOptions, setAssociatedOptions] = useState([]);
  const [relatedObjectOptions, setRelatedObjectOptions] = useState([]);
  const [resourceOptions, setResourceOptions] = useState([]);
  const [isSearchingResource, setIsSearchingResource] = useState(false);
  const [isSearchingRelatedObject, setIsSearchingRelatedObject] = useState(false);
  const [isSearchingStructure, setIsSearchingStructure] = useState(false);

  const { form, updateForm } = useForm(parseRelatedElement(data), validator);

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
      setIsSearchingStructure(true);
      const response = await api.get(`/autocomplete?query=${associatedQuery}&types=structures`);
      setAssociatedOptions(response.data?.data);
      setIsSearchingStructure(false);
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
                  label="Prix"
                  hint="Rechercher parmi les prix"
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
              <Col n="12" className="fr-pb-2w">
                <SearchBar
                  buttonLabel="Rechercher"
                  value={relatedObjectQuery || ''}
                  label="Lauréat"
                  // TODO: Restore projects
                  // hint="Rechercher parmi les structures, les personnes et les projets"
                  hint="Rechercher parmi les structures et les personnes"
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
          <Col n="12" spacing="pb-2w">
            <SearchBar
              buttonLabel="Rechercher"
              value={associatedQuery || ''}
              label="Structure(s) partageant le même prix"
              placeholder="Rechercher..."
              onChange={(e) => { setAssociatedQuery(e.target.value); }}
              options={associatedOptions}
              onSelect={handleObjectSelect}
              isSearching={isSearchingStructure}
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
          <Col n="12" className="fr-pb-2w">
            <DateInput
              value={form.startDate || ''}
              label="Date"
              onDateChange={((v) => updateForm({ startDate: v }))}
            />
          </Col>
          <Col n="12">
            <TextInput
              label="Précisions"
              value={form.laureatePrecision}
              onChange={(e) => updateForm({ laureatePrecision: e.target.value })}
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
