import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row, Select, TextInput } from '@dataesr/react-dsfr';
import useForm from '../../../../hooks/useForm';
import api from '../../../../utils/api';
import FormFooter from '../../../forms/form-footer';
import SearchBar from '../../../search-bar';

function validate(body) {
  const validationErrors = {};
  if (!body.userId) { validationErrors.userId = "L'utilisateur doit être séléctionné"; }
  if (!body.role) { validationErrors.role = 'Le rôle est obligatoire.'; }
  if (!body.name) { validationErrors.type = 'Le nom de la clé est obligatoire'; }
  return validationErrors;
}

function sanitize(form) {
  const fields = ['name', 'userId', 'role'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function ApiKeyForm({ onSave }) {
  const { form, updateForm, errors } = useForm({ role: 'reader' }, validate);
  const [showErrors, setShowErrors] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [userOptions, setUserOptions] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = () => {
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body);
  };

  const handleUserSelect = ({ id: userId, name: username }) => {
    updateForm({ userId, username });
    setUserQuery('');
    setUserOptions([]);
  };

  const handleUserDelete = () => {
    updateForm({ userId: null, username: null });
    setUserQuery('');
    setUserOptions([]);
  };

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearching(true);
      const response = await api.get(`/autocomplete?query=${userQuery}&types=users`);
      setUserOptions(response.data?.data);
      setIsSearching(false);
    };
    if (userQuery) { getAutocompleteResult(); } else { setUserOptions([]); }
  }, [userQuery]);

  return (
    <form>
      <Container fluid>
        <Row gutters>
          <Col n="12">
            <SearchBar
              required
              buttonLabel="Rechercher un utilisateur"
              isSearching={isSearching}
              label="Sélectionner un utilisateur"
              onChange={(e) => { setUserQuery(e.target.value); }}
              onSelect={handleUserSelect}
              options={userOptions}
              scope={form.username}
              onDeleteScope={handleUserDelete}
              placeholder={form.username ? null : 'Rechercher un utilisateur...'}
              value={userQuery || ''}
              message={
                showErrors && errors.userId
                  ? errors.userId
                  : null
              }
              messageType={showErrors && errors.userId ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <TextInput
              label="Nom de la clé"
              required
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              message={(showErrors && errors.name) ? errors.name : null}
              messageType={(showErrors && errors.name) ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <Select
              label="Rôle associé à la clé"
              options={[{ value: 'reader', label: 'Invité (lecture uniquement)' }, { value: 'user', label: 'Utilisateur (lecture & écriture)' }, { value: 'admin', label: 'Administrateur' }]}
              selected={form.role}
              onChange={(e) => updateForm({ role: e.target.value })}
              required
              message={(showErrors && errors.role) ? errors.role : null}
              messageType={(showErrors && errors.role) ? 'error' : ''}
            />
          </Col>
        </Row>
        <FormFooter onSaveHandler={handleSubmit} />
      </Container>
    </form>
  );
}
ApiKeyForm.propTypes = {
  onSave: PropTypes.func.isRequired,
};
