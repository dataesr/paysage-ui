import { Container, Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import api from '../../../utils/api';

import FormFooter from '../form-footer';
import useForm from '../../../hooks/useForm';
import PaysageBlame from '../../paysage-blame';
import SearchBar from '../../search-bar';

function validate(body) {
  const errorMessage = {};
  if (!body?.geographicalCategoryId) errorMessage.geographicalCategoryId = 'La catégorie géographique est obligatoire';
  if (!body?.resourceId) errorMessage.resourceId = 'La structure est oblicatoire';
  return errorMessage;
}

function sanitize(form) {
  const fields = ['geographicalCategoryId', 'resourceId'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function GeographicalExceptionForm({ id, data, onDelete, onSave }) {
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm({ ...data }, validate);

  const [geographicalCategoriesQuery, setGeographicalCategoriesQuery] = useState('');
  const [isSearchingGeographicalCategory, setIsSearchingGeographicalCategory] = useState(false);
  const [geographicalCategoriesOptions, setGeographicalCategoriesOptions] = useState([]);

  const [structuresQuery, setStructuresQuery] = useState('');
  const [isSearchingStructure, setIsSearchingStructure] = useState(false);
  const [structuresOptions, setStructuresOptions] = useState([]);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearchingGeographicalCategory(true);
      const response = await api.get(
        `/autocomplete?query=${geographicalCategoriesQuery}&types=geographical-categories`,
      );
      setGeographicalCategoriesOptions(response.data?.data);
      setIsSearchingGeographicalCategory(false);
    };
    if (geographicalCategoriesQuery) {
      getAutocompleteResult();
    } else {
      setGeographicalCategoriesOptions([]);
    }
  }, [geographicalCategoriesQuery]);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearchingStructure(true);
      const response = await api.get(
        `/autocomplete?query=${structuresQuery}&types=structures`,
      );
      setStructuresOptions(response.data?.data);
      setIsSearchingStructure(false);
    };
    if (structuresQuery) {
      getAutocompleteResult();
    } else {
      setStructuresOptions([]);
    }
  }, [structuresQuery]);

  const handleSubmit = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body, id);
  };

  const handleStructureSelect = ({ id: resourceId, name }) => {
    updateForm({ resourceName: name, resourceId });
    setStructuresQuery('');
    setStructuresOptions([]);
  };
  const handleStructureUnselect = () => {
    updateForm({ resourceName: null, resourceId: null });
    setStructuresQuery('');
    setStructuresOptions([]);
  };

  const handleGeographicalCategorySelect = ({ id: geographicalCategoryId, nameFr }) => {
    updateForm({ geographicalCategoryName: nameFr, geographicalCategoryId });
    setGeographicalCategoriesQuery('');
    setGeographicalCategoriesOptions([]);
  };
  const handleGeographicalCategoryUnselect = () => {
    updateForm({ geographicalCategoryName: null, geographicalCategoryId: null });
    setGeographicalCategoriesQuery('');
    setGeographicalCategoriesOptions([]);
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
            <SearchBar
              buttonLabel="Rechercher"
              value={geographicalCategoriesQuery || ''}
              label="Catégorie géographique"
              hint="Rechercher dans les catégories géographiques de Paysage"
              required
              scope={form.geographicalCategoryName}
              placeholder={form.geographicalCategoryId ? '' : 'Rechercher...'}
              onChange={(e) => {
                updateForm({ geographicalCategoryId: null });
                setGeographicalCategoriesQuery(e.target.value);
              }}
              options={geographicalCategoriesOptions}
              onSelect={handleGeographicalCategorySelect}
              onDeleteScope={handleGeographicalCategoryUnselect}
              isSearching={isSearchingGeographicalCategory}
              message={
                showErrors && errors.geographicalCategoryId
                  ? errors.geographicalCategoryId
                  : null
              }
              messageType={showErrors && errors.geographicalCategoryId ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <SearchBar
              buttonLabel="Rechercher"
              value={structuresQuery || ''}
              label="Structure"
              hint="Rechercher dans les structures de Paysage"
              required
              scope={form.resourceName}
              placeholder={form.resourceId ? '' : 'Rechercher...'}
              onChange={(e) => {
                updateForm({ resourceId: null });
                setStructuresQuery(e.target.value);
              }}
              options={structuresOptions}
              onSelect={handleStructureSelect}
              onDeleteScope={handleStructureUnselect}
              isSearching={isSearchingStructure}
              message={
                showErrors && errors.resourceId
                  ? errors.resourceId
                  : null
              }
              messageType={showErrors && errors.resourceId ? 'error' : ''}
            />
          </Col>
        </Row>
        <FormFooter
          id={data?.id}
          onSaveHandler={handleSubmit}
          onDeleteHandler={onDelete}
        />
      </Container>
    </form>
  );
}

GeographicalExceptionForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

GeographicalExceptionForm.defaultProps = {
  id: null,
  data: {},
  onDelete: null,
};
