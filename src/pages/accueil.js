import { Container, Row, Title } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBar from '../components/search-bar';
import api from '../utils/api';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Paysage · Accueil'; }, []);
  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearching(true);
      const response = await api.get(`/autocomplete?query=${query}`);
      setOptions(response.data?.data);
      setIsSearching(false);
    };
    if (query) { getAutocompleteResult(); } else { setOptions([]); }
  }, [query]);

  const handleSearchRedirection = ({ id, type }) => {
    navigate(`/${type}/${id}`);
    setQuery('');
    setOptions([]);
  };
  const handleSearch = () => {
    navigate(`rechercher?query=${query}`);
    setQuery('');
    setOptions([]);
  };

  return (
    <Container spacing="mt-5w" as="main">
      <Row className="fr-pb-5w">
        <Title as="h2">Paysage de l'ESR</Title>
      </Row>
      <Row className="fr-pb-5w">
        <SearchBar
          size="lg"
          buttonLabel="Rechercher"
          value={query}
          label="Rechercher dans Paysage"
          placeholder="Rechercher..."
          onChange={(e) => setQuery(e.target.value)}
          options={options}
          optionsIcon="ri-arrow-right-line"
          onSearch={handleSearch}
          onSelect={handleSearchRedirection}
          isSearching={isSearching}
        />
      </Row>
    </Container>
  );
}
