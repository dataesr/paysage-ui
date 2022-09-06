import PropTypes from 'prop-types';
import { Modal, ModalContent } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import SearchBar from '../search-bar';

export default function Search({ isOpen, setIsOpen }) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/autocomplete?query=${query}`);
      console.log(response.data);
      setOptions(response.data?.data);
    };
    if (isOpen && query) getAutocompleteResult();
  }, [isOpen, query]);

  const handleSearchRedirection = ({ id, type }) => {
    navigate(`/${type}/${id}`);
    setIsOpen(false);
    setQuery('');
    setOptions([]);
  };

  return (
    <Modal size="lg" isOpen={isOpen} hide={() => setIsOpen(false)}>
      <ModalContent className="height-30vh">
        <SearchBar
          size="lg"
          buttonLabel="Rechercher"
          value={query}
          label="Rechercher dans paysage"
          placeholder="Rechercher..."
          onChange={(e) => setQuery(e.target.value)}
          autocompleteOptions={options}
          onSearch={handleSearchRedirection}
          onAutocompleteSelection={handleSearchRedirection}
        />
      </ModalContent>
    </Modal>
  );
}

Search.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};
