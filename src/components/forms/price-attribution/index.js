import { useEffect, useState } from 'react';
import {
  Container,
  Col,
  Row,
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
  const fields = ['resourceId', 'relatedObjectId', 'relationTag', 'startDate', 'endDate'];
  const body = {};
  Object.keys(newForm).forEach((key) => { if (fields.includes(key)) { body[key] = newForm[key]; } });
  return body;
}

export default function PriceAttributionForm({ id, resourceType, relatedObjectTypes, data, onDelete, onSave, inverse }) {
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

  const [relatedObjectQuery, setRelatedObjectQuery] = useState('');
  const [resourceQuery, setResourceQuery] = useState('');

  const [relatedObjectOptions, setRelatedObjectOptions] = useState([]);
  const [resourceOptions, setResourceOptions] = useState([]);
  const [isSearchingResource, setIsSearchingResource] = useState(false);
  const [isSearchingRelatedObject, setIsSearchingRelatedObject] = useState(false);

  const { form, updateForm } = useForm(parseRelatedElement(data), validator);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearchingRelatedObject(true);
      const types = encodeURIComponent(relatedObjectTypes.join(','));
      const response = await api.get(`/search?query=${relatedObjectQuery}&types=${types}`);
      setRelatedObjectOptions(response.data?.data);
      setIsSearchingRelatedObject(false);
    };
    if (relatedObjectQuery) { getAutocompleteResult(); } else { setRelatedObjectOptions([]); }
  }, [relatedObjectQuery, relatedObjectTypes]);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearchingResource(true);
      const response = await api.get(`/search?query=${resourceQuery}&types=${resourceType}`);
      setResourceOptions(response.data?.data);
      setIsSearchingResource(false);
    };
    if (resourceQuery) { getAutocompleteResult(); } else { setResourceOptions([]); }
  }, [resourceQuery, resourceType]);

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
        <Row gutters>
          {inverse
            ? (
              <Col n="12">
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
              <Col n="12">
                <SearchBar
                  buttonLabel="Rechercher"
                  value={relatedObjectQuery || ''}
                  label="Porteur"
                  // TODO: Restore projects
                  // hint="Rechercher parmi les structures, les personnes et les projets"
                  hint="Rechercher parmi les structures"
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
          <Col n="12" className="fr-pb-2w">
            <DateInput
              value={form.startDate || ''}
              label="Date"
              onDateChange={((v) => updateForm({ startDate: v }))}
            />
          </Col>
          <Col n="12" className="fr-pb-2w">
            <DateInput
              value={form.endDate || ''}
              label="Date"
              onDateChange={((v) => updateForm({ endDate: v }))}
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

PriceAttributionForm.propTypes = {
  id: PropTypes.string,
  relatedObjectTypes: PropTypes.arrayOf(PropTypes.string),
  resourceType: PropTypes.string.isRequired,
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  inverse: PropTypes.bool,
};

PriceAttributionForm.defaultProps = {
  id: null,
  relatedObjectTypes: [''],
  data: {},
  onDelete: null,
  inverse: false,
};
