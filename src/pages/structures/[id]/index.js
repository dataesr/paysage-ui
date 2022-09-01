import { Link as RouterLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { Badge, BadgeGroup, Breadcrumb, BreadcrumbItem, Col, Container, Row, SideMenu, SideMenuItem, SideMenuLink, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';

import StructurePresentationPage from './presentation';
import StructureActualitesPage from './actualites';
import StructurePrixPage from './prix';
import StructureChiffresClesPage from './chiffres-cles';

function StructureByIdPage() {
  const { id } = useParams();
  const { pathname } = useLocation();

  const { data, isLoading, error } = useFetch('GET', `/structures/${id}`);

  const menu = {
    'chiffres-cles': 'Chiffres clés',
    actualites: 'Actualités',
    presentation: null,
    prix: 'Prix scientifiques',
  };
  if (isLoading) return <>Chargement...</>;
  if (error) return <>Erreur...</>;
  const pathnameSplitted = pathname.split('/');
  const section = menu[pathnameSplitted[pathnameSplitted.length - 1]];
  return (
    <Container spacing="pb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuItem title="Présentation">
              <SideMenuLink asLink={<RouterLink to="presentation#" />}>
                Localisation
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="presentation#informations" />}>
                Informations
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="presentation#testing" />}>
                Test menu
              </SideMenuLink>
            </SideMenuItem>
            <SideMenuLink asLink={<RouterLink to="actualites" />}>
              Actualités
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="chiffres-cles" />}>
              Chiffres clés
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="prix" />}>
              Prix scientifiques
            </SideMenuLink>
          </SideMenu>
        </Col>
        <Col n="12 md-9">
          <>
            <Breadcrumb>
              <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
              <BreadcrumbItem asLink={<RouterLink to="/rechercher/structures" />}>Structures</BreadcrumbItem>
              {section && <BreadcrumbItem asLink={<RouterLink to="" />}>{data?.currentName?.usualName}</BreadcrumbItem>}
              {section && <BreadcrumbItem>{section}</BreadcrumbItem>}
              {(!section) && <BreadcrumbItem>{data?.currentName?.usualName}</BreadcrumbItem>}
            </Breadcrumb>
            <Title as="h2">
              {data.currentName.usualName}
              <BadgeGroup><Badge colorFamily="green-emeraude" text={data.active || 'active'} /></BadgeGroup>
            </Title>
            {section && <Title as="h3">{section}</Title>}
            <Outlet />
          </>
        </Col>
      </Row>
    </Container>
  );
}

export {
  StructureByIdPage,
  StructurePresentationPage,
  StructureActualitesPage,
  StructurePrixPage,
  StructureChiffresClesPage,
};
