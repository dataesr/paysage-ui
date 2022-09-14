import { Link as RouterLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { Badge, BadgeGroup, Breadcrumb, BreadcrumbItem, Col, Container, Row, SideMenu, SideMenuItem, SideMenuLink, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import ClipboardCopy from '../../../utils/clipboard-copy';

import StructurePresentationPage from './presentation';
import StructureGouvernancePage from './gouvernance';
import StructureRHPage from './ressources-humaines';
import StructureBudgetPage from './budget';
import StructureAnalyseEtRessourcesStrategiquesPage from './analyses-et-ressources-strategiques';
import StructureActualitesPage from './actualites';
import StructureImmobilierPage from './immobilier';
import StructureEtudiantsPage from './etudiants';
import StructureOffreDeFormationPage from './offre-de-formation';
import StructureProjetsPage from './projets';
import StructureChiffresClesPage from './chiffres-cles';
import StructureTextesOfficielsPage from './textes-officiels';
import StructurePrixEtRecompensesPage from './prix-et-recompenses';
import StructureAgendaPage from './agenda';
import StructureElementsLiesPage from './elements-lies';
import StructureParticipationsPage from './participations';

function StructureByIdPage() {
  const { id } = useParams();
  const { pathname } = useLocation();

  const { data, isLoading, error } = useFetch(`/structures/${id}`);

  const menu = {
    'chiffres-cles': 'Chiffres clés',
    actualites: 'Actualités',
    presentation: null,
    'prix-et-recompenses': 'Prix scientifiques et récompenses',
  };
  if (isLoading) return <>Chargement...</>;
  if (error) return <>Erreur...</>;
  const pathnameSplitted = pathname.split('/');
  const section = menu[pathnameSplitted[pathnameSplitted.length - 1]];
  console.log(section);
  return (
    <Container spacing="pb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuItem title="Présentation">
              <SideMenuLink
                asLink={<RouterLink to="presentation#" />}
                className="sidemenu__item--active"
              >
                Localisation
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="presentation#informations" />}>
                Informations
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="presentation#historique-et-dates" />}>
                Historique & dates
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="presentation#categories" />}>
                Catégories
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="presentation#palmares-et-classements" />}>
                Palmarès & classements
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="presentation#presence-sur-le-web" />}>
                Présence sur le web
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="presentation#identifiants" />}>
                Identifiants
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="presentation#chiffres-cles" />}>
                Chiffres clés
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="presentation#gouvernance" />}>
                Gouvenance
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="presentation#dernieres-actualites" />}>
                Dernières actualités
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="presentation#suivi-dgesip" />}>
                Suivi DGESIP
              </SideMenuLink>
            </SideMenuItem>

            <SideMenuLink asLink={<RouterLink to="gouvernance-et-referents" />}>
              Gouvernance et référents
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="ressource-humaines" />}>
              Ressources humaines
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="budget" />}>
              Budget
            </SideMenuLink>

            <SideMenuItem title="Analyse & ressources stratégiques">
              <SideMenuLink asLink={<RouterLink to="analyse-et-ressources-strategiques#notes-du-conseiller" />}>
                Notes du conseiller
              </SideMenuLink>

              <SideMenuLink asLink={<RouterLink to="analyse-et-ressources-strategiques#documents" />}>
                Documents associés
              </SideMenuLink>

              <SideMenuLink asLink={<RouterLink to="analyse-et-ressources-strategiques#evaluations-hceres" />}>
                Evaluation HCERES
              </SideMenuLink>
            </SideMenuItem>

            <SideMenuLink asLink={<RouterLink to="actualites" />}>
              Actualités
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="immobilier" />}>
              Immobilier
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="etudiants" />}>
              Etudiants
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="offre-de-formation" />}>
              Offres de formation
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="projets" />}>
              Projets
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="chiffres-cles" />}>
              Chiffres clés
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="textes-officiels" />}>
              Textes officiels
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="prix-et-recompenses" />}>
              Prix & récompenses
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="agenda" />}>
              Agenda
            </SideMenuLink>

            <SideMenuItem title="Eléments liés">
              <SideMenuLink asLink={<RouterLink to="elements-lies#" />}>
                Structure internes
              </SideMenuLink>

              <SideMenuLink asLink={<RouterLink to="elements-lies" />}>
                Autres listes
              </SideMenuLink>
            </SideMenuItem>

            <SideMenuLink asLink={<RouterLink to="participations" />}>
              Participations
            </SideMenuLink>
          </SideMenu>
        </Col>
        <Col n="12 md-9">
          <>
            <Breadcrumb>
              <BreadcrumbItem asLink={<RouterLink to="/" />}>
                Accueil
              </BreadcrumbItem>
              <BreadcrumbItem
                asLink={<RouterLink to="/rechercher/structures" />}
              >
                Structures
              </BreadcrumbItem>
              {section && (
                <BreadcrumbItem asLink={<RouterLink to="" />}>
                  {data?.currentName?.usualName}
                </BreadcrumbItem>
              )}
              {section && <BreadcrumbItem>{section}</BreadcrumbItem>}
              {!section && (
                <BreadcrumbItem>{data?.currentName?.usualName}</BreadcrumbItem>
              )}
            </Breadcrumb>
            <Title as="h2">
              {data.currentName.usualName}
              <BadgeGroup>
                <Badge
                  colorFamily="yellow-tournesol"
                  text={<ClipboardCopy copyText={data.id} textOnClick="" colorFamily="" />}
                />
                <Badge
                  colorFamily="green-emeraude"
                  text={data.active || 'active'}
                />
              </BadgeGroup>
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
  StructureGouvernancePage,
  StructureRHPage,
  StructureBudgetPage,
  StructureAnalyseEtRessourcesStrategiquesPage,
  StructureActualitesPage,
  StructureImmobilierPage,
  StructureEtudiantsPage,
  StructureOffreDeFormationPage,
  StructureProjetsPage,
  StructureChiffresClesPage,
  StructureTextesOfficielsPage,
  StructurePrixEtRecompensesPage,
  StructureAgendaPage,
  StructureElementsLiesPage,
  StructureParticipationsPage,
};
