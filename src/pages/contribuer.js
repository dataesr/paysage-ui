import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Container,
  Icon,
  Row,
  Tile,
  TileBody,
  Title,
} from '@dataesr/react-dsfr';
import CategoryAddPage from './categories/ajouter';
import StructureAddPage from './structures/ajouter';
import TermAddPage from './termes/ajouter';
import OfficialTextAddPage from './textes-officiels/ajouter';
import PersonAddPage from './personnes/ajouter';
import ProjectAddPage from './projets/ajouter';
import SearchBar from '../components/search-bar';
import api from '../utils/api';

export default function ContributePage() {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => { document.title = 'Paysage · Contribuer'; }, []);
  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearching(true);
      const response = await api.get(`/autocomplete?query=${query}&limit=15`);
      setOptions(response.data?.data);
      setIsSearching(false);
    };
    if (query) { getAutocompleteResult(); } else { setOptions([]); }
  }, [query]);

  const data = [
    { type: 'structures', icon: 'ri-building-line', name: 'Ajouter une structure', url: '/structures/ajouter' },
    { type: 'persons', icon: 'ri-user-3-line', name: 'Ajouter une personne', url: '/personnes/ajouter' },
    { type: 'prices', icon: 'ri-award-line', name: 'Ajouter un prix', url: '/prix/ajouter' },
    // TODO: Restore projects
    // { type: 'projects', icon: 'ri-booklet-line', name: 'Ajouter un projet', url: '/projets/ajouter' },
    { type: 'categories', icon: 'ri-price-tag-3-line', name: 'Ajouter une catégorie', url: '/categories/ajouter' },
    { type: 'terms', icon: 'ri-hashtag', name: 'Ajouter un terme', url: '/termes/ajouter' },
  ];
  return (
    <Container className="fr-mb-6w">
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>
              Accueil
            </BreadcrumbItem>
            <BreadcrumbItem>Ajouter un nouvel objet</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <div className="fr-notice fr-notice--info fr-mb-2w">
        <div className="fr-container">
          <div className="fr-notice__body">
            <p className="fr-notice__title">
              Etes-vous sûr que l'objet n'existe pas ? Utilisez la recherche pour vous en assurer.
            </p>
            <Col n="12">
              <SearchBar
                value={query}
                placeholder="Rechercher"
                onChange={(e) => setQuery(e.target.value)}
                options={options}
                isSearching={isSearching}
              />
            </Col>
          </div>
        </div>
      </div>
      <Row>
        <Col>
          <Title as="h2" look="h3">Ajouter un nouvel objet Paysage</Title>
        </Col>
      </Row>
      <Row as="ul" gutters>
        {data.map((element) => (
          <Col n="12 md-6 lg-4" as="li" key={element.type}>
            <Tile horizontal color={`var(--${element.type}-color)`}>
              <TileBody
                titleAs="h5"
                title={element.name}
                asLink={<RouterLink to={element.url} />}
              />
              <div className="fr-tile__img">
                <Icon size="3x" name={element.icon} color={`var(--${element.type}-color)`} />
              </div>
            </Tile>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export {
  ContributePage,
  CategoryAddPage,
  StructureAddPage,
  TermAddPage,
  OfficialTextAddPage,
  PersonAddPage,
  ProjectAddPage,
};
