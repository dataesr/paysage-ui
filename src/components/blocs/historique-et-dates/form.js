import { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Row,
  Select,
  Title,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import api from '../../../utils/api';
import validator from './validator';
import FormFooter from '../../forms/form-footer';
import useForm from '../../../hooks/useForm';
import { STRUCTURES_CREATION_REASONS, STRUCTURES_CLOSURE_REASONS } from '../../../utils/constants';
import DateInput from '../../date-input';
import SearchBar from '../../search-bar';

export default function WeblinkForm({ data, onDeleteHandler, onSaveHandler }) {
  // const [showErrors, setShowErrors] = useState(false);
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState(null);
  const [optionsTOCreation, setOptionsCreation] = useState([data.creationOfficialTextId]);

  const [optionsTOClosure, setOptionsClosure] = useState([data.creationOfficialTextId]);

  const { form, updateForm } = useForm(data, validator);

  const creationReasonsOptions = STRUCTURES_CREATION_REASONS.map((el) => ({ label: el, value: el }));
  const closureReasonsOptions = STRUCTURES_CLOSURE_REASONS.map((el) => ({ label: el, value: el }));

  // const onSave = () => {
  //   if (Object.keys(errors).length > 0) return setShowErrors(true);
  //   return onSaveHandler(form);
  // };

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/autocomplete?query=${query}&types=officialTexts`);
      setOptionsCreation(response.data?.data);
    };
    if (query) { getAutocompleteResult(); } else { setOptionsCreation([]); }
  }, [query]);

  const handleSelect = ({ id, name }) => {
    updateForm({ creationOfficialTextId: id });
    setScope(name);
    setQuery('');
    setOptionsCreation([]);
  };
  const handleUnselect = () => {
    updateForm({ creationOfficialTextId: null });
    setScope(null);
    setQuery('');
    setOptionsCreation([]);
  };

  return (
    <form>
      <Container>
        <Row>
          <Col>
            <Title as="h3" look="h6">
              Création
            </Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Select
              label="Raison de création"
              options={creationReasonsOptions}
              selected={form?.creationReason}
              onChange={(e) => updateForm({ creationReason: e.target.value })}
              tabIndex={0}
              // message={(showErrors && errors.creationReason) ? errors.creationReason : null}
              // messageType={(showErrors && errors.creationReason) ? 'error' : ''}
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <DateInput
              value={form?.creationDate}
              label="Date de début"
              onDateChange={(value) => updateForm({ creationDate: value })}
              isRequired
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <SearchBar
              size="lg"
              buttonLabel="Rechercher"
              value={query}
              label="Texte officiel de création"
              hint="Recherchez et séléctionnez un texte officiel présent dans paysage"
              scope={scope}
              placeholder={scope ? '' : 'Rechercher...'}
              onChange={(e) => { updateForm({ creationOfficialTextId: null }); setQuery(e.target.value); }}
              options={optionsTOCreation}
              onSelect={handleSelect}
              onDeleteScope={handleUnselect}
            />
          </Col>
        </Row>
        {
          (data?.creationOfficialText) ? (
            <Row>
              {JSON.stringify(data?.creationOfficialText)}
            </Row>
          ) : null
        }
        <Row className="fr-pt-5w">
          <Col>
            <Title as="h3" look="h6">
              Fermeture
            </Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Select
              label="Raison de création"
              options={closureReasonsOptions}
              selected={form?.closureReason}
              onChange={(e) => updateForm({ closureReason: e.target.value })}
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <DateInput
              value={form?.closureDate}
              label="Date de fermeture"
              onDateChange={(value) => updateForm({ closureDate: value })}
            />
          </Col>
        </Row>
        <FormFooter
          id={data?.id}
          onSaveHandler={() => onSaveHandler(form)}
          onDeleteHandler={onDeleteHandler}
        />
      </Container>
    </form>
  );
}

WeblinkForm.propTypes = {
  data: PropTypes.object,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
};

WeblinkForm.defaultProps = {
  data: {},
  onDeleteHandler: null,
};
