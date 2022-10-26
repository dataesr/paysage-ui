import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Badge, BadgeGroup, ButtonGroup, Col, Container, Download,
  Icon, Row, Text, Title } from '@dataesr/react-dsfr';
import TagInput from '../components/tag-input';
import useToast from '../hooks/useToast';
import useNotice from '../hooks/useNotice';
import ModifyCard from '../components/card/modify-card';
import SearchBar from '../components/search-bar';
import api from '../utils/api';
import Button from '../components/button';
import { DropdownButton, DropdownButtonItem } from '../components/dropdown-button';
import { Timeline, TimelineItem } from '../components/timeline';

export default function HomePage() {
  const { toast } = useToast();
  const { notice } = useNotice();
  const [tags, setTags] = useState([]);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

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
        <Title as="h2">Search Tester</Title>
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
      <Row className="fr-pb-5w">
        <Title as="h2">Dropdown button</Title>
      </Row>
      <Row className="flex--space-between fr-pb-5w">
        <DropdownButton title="Options">
          <DropdownButtonItem asLink={<Link to="/structures" />}>
            <Icon size="xl" name="ri-download-2-fill" color="var(--border-action-high-blue-france)" />
            Exporter
          </DropdownButtonItem>
          <DropdownButtonItem onClick={() => setIsFav(!isFav)}>
            <Icon size="xl" name={`ri-star-${isFav ? 'fill' : 'line'}`} color="var(--border-action-high-blue-france)" />
            {isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </DropdownButtonItem>
          <DropdownButtonItem onClick={() => setIsEdit(!isEdit)}>
            <Icon size="xl" name={`ri-edit-${isEdit ? 'fill' : 'line'}`} color="var(--border-action-high-blue-france)" />
            {isEdit ? 'Désactiver le mode édition' : 'Activer le mode édition'}
          </DropdownButtonItem>
        </DropdownButton>
        <DropdownButton align="right" title="options">
          <DropdownButtonItem asLink={<Link to="/structures" />}>
            Exporter
            <Icon iconPosition="right" size="xl" name="ri-download-2-fill" color="var(--border-action-high-blue-france)" />
          </DropdownButtonItem>
          <DropdownButtonItem onClick={() => setIsFav(!isFav)}>
            {isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            <Icon iconPosition="right" size="xl" name={`ri-star-${isFav ? 'fill' : 'line'}`} color="var(--border-action-high-blue-france)" />
          </DropdownButtonItem>
          <DropdownButtonItem onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? 'Désactiver le mode édition' : 'Activer le mode édition'}
            <Icon iconPosition="right" size="xl" name={`ri-edit-${isEdit ? 'fill' : 'line'}`} color="var(--border-action-high-blue-france)" />
          </DropdownButtonItem>
        </DropdownButton>
      </Row>
      <Row className="fr-pb-5w">
        <Title as="h2">Timeline tester</Title>
      </Row>
      <Row className="fr-pb-5w">
        <Timeline>
          <TimelineItem date="2022-05-04">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </TimelineItem>
          <TimelineItem date="2014-12-10">
            <BadgeGroup>
              <Badge isSmall text="évènement" />
              <Badge isSmall text="Suivi" colorFamily="blue-ecume" />
            </BadgeGroup>
            <Text>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
            </Text>
            <Text bold>
              Documents associés à l'évenement:
            </Text>
            <Row>
              <Download
                label="label"
                file="null"
                metaData=""
                description="Fichier de bilan"
              />
            </Row>
          </TimelineItem>
          <TimelineItem date="2011-09-28">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </TimelineItem>
        </Timeline>
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
          <Button onClick={() => toast({ toastType: 'error', title: 'test', description: 'test un peu plus long éventuellement sur deux lignes' })}>Toast</Button>
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
          <Button>Bouton</Button>
          <Button secondary>Bouton</Button>
          <Button tertiary>Bouton</Button>
          <Button tertiary borderless>Bouton</Button>
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
          <div className="color-tester bg-documents"><Text size="sm" spacing="m-0">transparent</Text></div>
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
