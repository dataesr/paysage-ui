import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import TagInput from '../components/tag-input';
import useToast from '../hooks/useToast';
import useNotice from '../hooks/useNotice';
import ModifyCard from '../components/card/modify-card';
import SearchBar from '../components/search-bar';
import api from '../utils/api';

export default function HomePage() {
  const { toast } = useToast();
  const { notice } = useNotice();
  const [tags, setTags] = useState([]);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/autocomplete?query=${query}`); // &types=categories
      setOptions(response.data?.data);
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
        <Title as="h2">Search Tester</Title>
      </Row>
      <Row className="fr-pb-5w">
        <SearchBar
          size="lg"
          buttonLabel="Rechercher"
          value={query}
          label="Rechercher dans paysage"
          placeholder="Rechercher..."
          onChange={(e) => setQuery(e.target.value)}
          options={options}
          optionsIcon="ri-arrow-right-line"
          onSearch={handleSearch}
          onSelect={handleSearchRedirection}
        />
      </Row>
      <Row className="fr-pb-5w">
        <Title as="h2">Toast Tester</Title>
      </Row>
      <Row className="fr-pb-5w">
        <ButtonGroup isInlineFrom="lg">

          <Button onClick={() => toast({ toastType: 'info', title: 'test un peu plus long peut etre sur deux lignes', autoDismissAfter: 0 })}>Toast</Button>
          <Button onClick={() => toast({
            toastType: 'success',
            title: 'test un peu plus long peut etre sur deux lignes',
            description: 'Ici avec un dismiss de huit secondes',
            autoDismissAfter: 8000,
          })}
          >
            Toast
          </Button>
          <Button onClick={() => toast({ toastType: 'error', title: 'test', description: 'test un peu plus long eventuellement sur deux lignes' })}>Toast</Button>
          <Button onClick={() => toast({ toastType: 'warning', description: 'Impossible' })}>Toast</Button>
        </ButtonGroup>
      </Row>
      <Row className="fr-pb-5w">
        <Title as="h2">Notice Tester</Title>
      </Row>
      <Row className="fr-pb-5w">
        <ButtonGroup isInlineFrom="lg">
          <Button onClick={() => notice({ content: 'info', autoDismissAfter: 5000 })}>Notice</Button>
          <Button onClick={() => notice({ content: 'success', autoDismissAfter: 0, type: 'success' })}>Notice</Button>
          <Button onClick={() => notice({ content: 'error', autoDismissAfter: 8000, type: 'error' })}>Notice</Button>
          <Button onClick={() => notice({ content: 'warning', autoDismissAfter: 3000, type: 'warning' })}>Notice</Button>
        </ButtonGroup>
      </Row>
      <Row className="fr-pb-5w">
        <Title as="h2">TagInput Tester</Title>
      </Row>
      <Row className="fr-pb-5w">
        <ButtonGroup isInlineFrom="lg">

          <TagInput
            label="Autres noms"
            hint='Validez votre ajout avec la touche "Entrée" afin de valider votre ajout'
            tags={tags || []}
            onTagsChange={(newTags) => setTags(newTags)}
          />
        </ButtonGroup>
      </Row>
      <Row className="fr-pb-5w">
        <Col n="3">
          <ModifyCard title="titre" description="desc" />
        </Col>
      </Row>
    </Container>
  );
}
