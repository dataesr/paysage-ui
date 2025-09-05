import { useEffect, useState } from 'react';
import { Container, Col, Select, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import useForm from '../../../../hooks/useForm';
import SearchBar from '../../../search-bar';
import api from '../../../../utils/api';
import FormFooter from '../../../forms/form-footer';

function sanitize(form) {
  const fields = [
    'structureId',
    'type',
  ];
  const body = {};
  Object.keys(form).forEach((key) => {
    if (fields.includes(key)) {
      body[key] = form[key];
    }
  });
  return body;
}

export default function AddStructureForm({
  id,
  onSave,
}) {
  const validator = (body) => {
    const errors = {};
    if (!body?.structureId) {
      errors.structureId = 'Vous devez sélectionner une structure';
    }
    if (!body?.type) {
      errors.type = 'Vous devez sélectionner un type';
    }
    return errors;
  };
  const [showErrors, setShowErrors] = useState(false);
  const [structureQuery, setStructureQuery] = useState('');
  const [structureOptions, setStructureOptions] = useState([]);
  const [isSearchingStructure, setIsSearchingStructure] = useState(false);

  const { form, updateForm, errors } = useForm({ type: 'primary', structureId: '', structureName: '' }, validator);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearchingStructure(true);
      const response = await api.get(
        `/autocomplete?query=${structureQuery}&types=structures`,
      );
      setStructureOptions(response.data?.data);
      setIsSearchingStructure(false);
    };
    if (structureQuery) {
      getAutocompleteResult();
    } else {
      setStructureOptions([]);
    }
  }, [structureQuery]);

  const handleStructureSelect = ({ id: structureId, name }) => {
    updateForm({ structureName: name, structureId });
    setStructureQuery('');
    setStructureOptions([]);
  };
  const handleStructureUnselect = () => {
    updateForm({ structureName: null, structureId: null });
    setStructureQuery('');
    setStructureOptions([]);
  };

  const handleSave = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(id, body);
  };
  return (
    <form>
      <Container fluid>
        <Row gutters>
          <Col n="12" className="fr-pb-2w">
            <SearchBar
              buttonLabel="Rechercher"
              value={structureQuery || ''}
              label="Structure Paysage à lier"
              hint="Rechercher une structure Paysage"
              required
              scope={form.structureName}
              placeholder={form.structureId ? '' : 'Rechercher...'}
              onChange={(e) => {
                updateForm({ structureId: null });
                setStructureQuery(e.target.value);
              }}
              options={structureOptions}
              onSelect={handleStructureSelect}
              onDeleteScope={handleStructureUnselect}
              isSearching={isSearchingStructure}
              message={
                showErrors && errors.relatedObjectId
                  ? errors.relatedObjectId
                  : null
              }
              messageType={showErrors && errors.relatedObjectId ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <Select
              label="Type"
              options={[{ value: 'primary', label: 'Domaine principal' }, { value: 'secondary', label: 'Domaine secondaire' }, { value: 'historical', label: 'Domaine historique' }]}
              selected={form.type}
              onChange={(e) => updateForm({ type: e.target.value })}
              required
              message={(showErrors && errors.type) ? errors.type : null}
              messageType={(showErrors && errors.type) ? 'error' : ''}
            />
          </Col>
        </Row>
        <FormFooter
          id={id}
          onSaveHandler={handleSave}
        />
      </Container>
    </form>
  );
}

AddStructureForm.propTypes = {
  id: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};
