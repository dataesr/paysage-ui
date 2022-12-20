import { useState } from 'react';
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
import usePageTitle from '../hooks/usePageTitle';
import useDebounce from '../hooks/useDebounce';
import useSearch from '../hooks/useSearch';
import { SEARCH_TYPES } from '../utils/constants';

export default function ContributePage() {
  const [query, setQuery] = useState('');
  usePageTitle('Contribuer');
  const debouncedQuery = useDebounce(query, 500);
  const { data: options, isLoading } = useSearch(SEARCH_TYPES, debouncedQuery);

  const data = [
    { type: 'structures', icon: 'ri-building-line', name: 'Ajouter une structure', url: '/structures/ajouter' },
    { type: 'persons', icon: 'ri-user-3-line', name: 'Ajouter une personne', url: '/personnes/ajouter' },
    { type: 'prizes', icon: 'ri-award-line', name: 'Ajouter un prix', url: '/prix/ajouter' },
    // TODO: Restore projects
    // { type: 'projects', icon: 'ri-booklet-line', name: 'Ajouter un projet', url: '/projets/ajouter' },
    { type: 'terms', icon: 'ri-hashtag', name: 'Ajouter un terme', url: '/termes/ajouter' },
    { type: 'categories', icon: 'ri-price-tag-3-line', name: 'Ajouter une catégorie', url: '/categories/ajouter' },
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
                isSearching={isLoading}
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
