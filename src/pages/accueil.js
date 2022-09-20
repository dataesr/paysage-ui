import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ButtonGroup, Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';
import TagInput from '../components/tag-input';
import useToast from '../hooks/useToast';
import useNotice from '../hooks/useNotice';
import ModifyCard from '../components/card/modify-card';
import SearchBar from '../components/search-bar';
import api from '../utils/api';
import Button from '../components/button';

export default function HomePage() {
  const { toast } = useToast();
  const { notice } = useNotice();
  const [tags, setTags] = useState([]);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/autocomplete?query=${query}`);
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
          <Button secondary onClick={() => notice({ content: 'info', autoDismissAfter: 5000 })}>Info</Button>
          <Button secondary color="success" onClick={() => notice({ content: 'success', autoDismissAfter: 0, type: 'success' })}>Success</Button>
          <Button secondary color="error" onClick={() => notice({ content: 'error', autoDismissAfter: 8000, type: 'error' })}>Error</Button>
          <Button secondary icon="ri-error-warning-line" onClick={() => notice({ content: 'warning', autoDismissAfter: 3000, type: 'warning' })}>Warn</Button>
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
      <Row className="fr-pb-5w">
        <Title as="h2">Boutons</Title>
      </Row>
      <Row className="fr-pb-2w">
        <Title as="h3" look="h6">Boutons color="error"</Title>
      </Row>
      <Row gutters className="fr-pb-5w">
        <ButtonGroup isInlineFrom="md">
          <Button color="error">Bouton</Button>
          <Button secondary color="error">Bouton</Button>
          <Button tertiary color="error">Bouton</Button>
          <Button tertiary borderless color="error">Bouton</Button>
        </ButtonGroup>
      </Row>
      <Row className="fr-pb-2w">
        <Title as="h3" look="h6">Boutons color="success"</Title>
      </Row>
      <Row gutters className="fr-pb-5w">
        <ButtonGroup size="sm" isInlineFrom="md">
          <Button color="success">Bouton</Button>
          <Button secondary color="success">Bouton</Button>
          <Button tertiary color="success">Bouton</Button>
          <Button tertiary borderless color="success">Bouton</Button>
        </ButtonGroup>
      </Row>
      <Row className="fr-pb-2w">
        <Title as="h3" look="h6">Boutons color="text"</Title>
      </Row>
      <Row gutters className="fr-pb-5w">
        <ButtonGroup size="sm" isInlineFrom="md">
          <Button color="text">Bouton</Button>
          <Button secondary color="text">Bouton</Button>
          <Button tertiary color="text">Bouton</Button>
          <Button tertiary borderless color="text">Bouton</Button>
        </ButtonGroup>
      </Row>
      <Row className="fr-pb-2w">
        <Title as="h3" look="h5">Boutons sans couleur</Title>
      </Row>
      <Row gutters className="fr-pb-5w">
        <ButtonGroup size="sm" isInlineFrom="md">
          <Button color="inherit">Bouton</Button>
          <Button secondary color="inherit">Bouton</Button>
          <Button tertiary color="inherit">Bouton</Button>
          <Button tertiary borderless color="inherit">Bouton</Button>
        </ButtonGroup>
      </Row>
      <Row className="fr-pb-2w">
        <Title as="h3" look="h5">Boutons avec icone seule</Title>
      </Row>
      <Row gutters className="fr-pb-5w">
        <ButtonGroup size="sm" isInlineFrom="md">
          <Button rounded icon="ri-more-2-fill" />
          <Button secondary rounded icon="ri-more-2-fill" />
          <Button tertiary rounded icon="ri-more-2-fill" />
          <Button tertiary borderless rounded icon="ri-more-2-fill" />
        </ButtonGroup>
      </Row>
      <Row gutters className="fr-pb-5w">
        <ButtonGroup isInlineFrom="md">
          <Button rounded icon="ri-more-2-fill" />
          <Button secondary rounded icon="ri-more-2-fill" />
          <Button tertiary rounded icon="ri-more-2-fill" />
          <Button tertiary borderless rounded icon="ri-more-2-fill" />
        </ButtonGroup>
      </Row>
      <Row gutters className="fr-pb-5w">
        <ButtonGroup size="lg" isInlineFrom="md">
          <Button color="text" rounded icon="ri-more-2-fill" />
          <Button color="text" secondary rounded icon="ri-more-2-fill" />
          <Button color="text" tertiary rounded icon="ri-more-2-fill" />
          <Button color="text" tertiary borderless rounded icon="ri-more-2-fill" />
        </ButtonGroup>
      </Row>
      <Row className="fr-pb-5w">
        <Title as="h2">Couleurs d'objets</Title>
      </Row>
      <Row gutters className="fr-pb-5w">
        <Col n="12 sm-6 md-4 lg-3">
          <Title as="h5">Catégories</Title>
          <div className="color-tester bg-categories"><Text size="sm" spacing="m-0">green-menthe-850</Text></div>
        </Col>
        <Col n="12 sm-6 md-4 lg-3">
          <Title as="h5">Catégories juridiques</Title>
          <div className="color-tester bg-legal-categories"><Text size="sm" spacing="m-0">MISSING</Text></div>
        </Col>
        <Col n="12 sm-6 md-4 lg-3">
          <Title as="h5">Document</Title>
          <div className="color-tester bg-documents"><Text size="sm" spacing="m-0">green-archipel-main-557</Text></div>
        </Col>
        <Col n="12 sm-6 md-4 lg-3">
          <Title as="h5">Personnes</Title>
          <div className="color-tester bg-persons"><Text size="sm" spacing="m-0">green-archipel-main-557</Text></div>
        </Col>
        <Col n="12 sm-6 md-4 lg-3">
          <Title as="h5">Prix scientifiques</Title>
          <div className="color-tester bg-prices"><Text size="sm" spacing="m-0">blue-ecume-main-400</Text></div>
        </Col>
        <Col n="12 sm-6 md-4 lg-3">
          <Title as="h5">Projets</Title>
          <div className="color-tester bg-projects"><Text size="sm" spacing="m-0">MISSING</Text></div>
        </Col>
        <Col n="12 sm-6 md-4 lg-3">
          <Title as="h5">Structures</Title>
          <div className="color-tester bg-structures"><Text size="sm" spacing="m-0">blue-ecume-moon-675</Text></div>
        </Col>
        <Col n="12 sm-6 md-4 lg-3">
          <Title as="h5">Termes</Title>
          <div className="color-tester bg-terms"><Text size="sm" spacing="m-0">warning-850</Text></div>
        </Col>
        <Col n="12 sm-6 md-4 lg-3">
          <Title as="h5">Textes officiels</Title>
          <div className="color-tester bg-official-texts"><Text size="sm" spacing="m-0">purple-glycine-200</Text></div>
        </Col>
        <Col n="12 sm-6 md-4 lg-3">
          <Title as="h5">Utilisateurs</Title>
          <div className="color-tester bg-users"><Text size="sm" spacing="m-0">MISSING</Text></div>
        </Col>
      </Row>
    </Container>
  );
}
