import {
  ButtonGroup,
  Col,
  Container,
  Row,
  Text,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useForm from '../../hooks/useForm';
import api from '../../utils/api';
import Button from '../button';
import SearchBar from '../search-bar';

export default function DeleteForm({ currentObjectId, onDelete, type }) {
  const { form, updateForm } = useForm({ name: null, id: null });
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRelatedObjectSelect = ({ id, name }) => {
    updateForm({ name, id });
    setQuery('');
    setOptions([]);
  };
  const handleRelatedObjectUnselect = () => {
    updateForm({ name: null, id: null });
    setQuery('');
    setOptions([]);
  };

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsLoading(true);
      const response = await api.get(
        `/autocomplete?query=${query}&types=${type}`,
      );
      setOptions(response.data?.data);
      setIsLoading(false);
    };
    if (query) {
      getAutocompleteResult();
    } else {
      setOptions([]);
    }
  }, [query, type, currentObjectId]);

  return (
    <form>
      <Container fluid>
        <Row gutters>
          <Col n="12">
            <Text>Vous êtes sur le point de supprimer un objet et toutes les métadonnées associées : identifiants, media sociaux, liens web, relations, documents, suivis etc.</Text>
            <Text>Vous pouvez ajouter un lien symbolique avec un autre objet du même type afin de notifier que cet objet est un doublon avec un autre.</Text>
          </Col>
          <Col n="12">
            <SearchBar
              buttonLabel="Rechercher"
              value={query}
              label="Objet Paysage à lier"
              hint="Rechercher dans les objets Paysage"
              required
              scope={form.name}
              placeholder={form.id ? '' : 'Rechercher...'}
              onChange={(e) => {
                updateForm({ relatedObjectId: null });
                setQuery(e.target.value);
              }}
              options={options?.filter((el) => el.id !== currentObjectId)}
              onSelect={handleRelatedObjectSelect}
              onDeleteScope={handleRelatedObjectUnselect}
              isSearching={isLoading}
            />
          </Col>
          <Col n="12">
            <hr />
          </Col>
          <Col n="12">
            <ButtonGroup>
              <Button color="error" onClick={() => onDelete(form.id)}>
                Supprimer
                {' '}
                {form.id ? 'avec ' : 'sans '}
                {' '}
                redirection
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </form>
  );
}

DeleteForm.propTypes = {
  onDelete: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['structures', 'persons']).isRequired,
  currentObjectId: PropTypes.string.isRequired,
};
