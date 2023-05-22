import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';

import Layout from '../layout';
import HomePage from '../pages/accueil';
import HelpPage from '../pages/aide';
import { ContributePage, OfficialTextAddPage, PersonAddPage, ProjectAddPage, StructureAddPage } from '../pages/contribuer';
import SignUp from '../pages/creer-un-compte';
import Passwordless from '../pages/mot-de-passe-oublie';
import NotFound from '../pages/not-found';
import RessourcesExternesPage from '../pages/resources-externes';
import SignIn from '../pages/se-connecter';
import OfficialTextsByIdPage from '../pages/textes-officiels/id';
import Redirect from './redirect';

import ProtectedRoute from './protected-route';
import VisitorRoute from './visitor-route';

import {
  StructureBudgetPage,
  StructureByIdPage,
  StructureCategoriesPage,
  StructureCategoriesGeographiquesPage,
  StructureElementsLiesPage,
  StructureEtudiantsPage,
  StructureExportPage,
  StructureGouvernancePage,
  StructureImmobilierPage,
  StructureInsertionProfessionnellePage,
  StructureOffreDeFormationPage,
  StructurePresentationPage,
  StructurePrixEtRecompensesPage,
  StructureProjetsPage,
  StructureRHPage,
} from '../pages/structures/[id]';

import { PersonByIdPage, PersonCategories, PersonExportPage, PersonMandats, PersonPresentationPage, PersonPrizes, PersonProjets, PersonsRelatedElements } from '../pages/personnes/[id]';

import { TermByIdPage, TermExportPage, TermPresentationPage, TermRelatedElements } from '../pages/termes/[id]';
import TermsAddPage from '../pages/termes/ajouter';

import {
  ProjectByIdPage,
  ProjectCategories,
  ProjectExportPage,
  ProjectPresentationPage,
  ProjectPrizes,
} from '../pages/projets/[id]';

import { CategoriesExportPage, CategoryByIdPage, CategoryPresentationPage, CategoryRelatedElements } from '../pages/categories/[id]';
import CategoriesAddPage from '../pages/categories/ajouter';

import {
  AdminApiKeysPage,
  AdminDashboardPage,
  AdminGroupsPage,
  AdminJobsPage,
  AdminJournalPage,
  AdminLegalCategoriesPage,
  AdminNomenclaturesPage,
  AdminPage,
  AdminRelationTypesPage,
  AdminUsersPage,
} from '../pages/admin';

import { AccountPage, PreferencesPage, ProfilePage, SecurityPage } from '../pages/mon-compte';

import ActualitesOutlet from '../components/blocs/actualites';
import DocumentsOutlet from '../components/blocs/documents';
import AgendaOutlet from '../components/blocs/evenements';
import JournalOutlet from '../components/blocs/modification-journal';
import OfficialTextsOutlet from '../components/blocs/textes-officiels';
import LegalCategoriesByIdPage from '../pages/legal-categories/id';
import ContactPage from '../pages/nous-contacter';
import { PrizeByIdPage, PrizeCategories, PrizeExportPage, PrizePresentationPage } from '../pages/prix/[id]';
import PrizeAddPage from '../pages/prix/ajouter';
import ProjetEtEquipe from '../pages/projet-et-equipe';
import SearchPage from '../pages/rechercher';
import SupervisingMinistersByIdPage from '../pages/supervising-ministers/id';
import '../styles/index.scss';

import BulkImport from '../components/bulk-imports';
import MatomoReport from './matomo-report';
import ScrollToTopOnPathnameChange from './scroll-top-on-pathname-change';
import CGU from '../pages/cgu';
import MentionsLegales from '../pages/mentions-legales';

export default function Routes() {
  return (
    <>
      <ScrollToTopOnPathnameChange />
      <MatomoReport />
      <RouterRoutes>
        <Route element={<Layout />}>
          <Route path="*" element={<NotFound />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route element={<VisitorRoute />}>
            <Route path="/se-connecter" element={<SignIn />} />
            <Route path="/creer-un-compte" element={<SignUp />} />
            <Route path="/mot-de-passe-oublie" element={<Passwordless />} />
          </Route>

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminPage />}>
              <Route path="" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="journal" element={<AdminJournalPage />} />
              <Route path="utilisateurs" element={<AdminUsersPage />} />
              <Route path="groupes" element={<AdminGroupsPage />} />
              <Route path="apikeys" element={<AdminApiKeysPage />} />
              <Route path="categories-juridiques" element={<AdminLegalCategoriesPage />} />
              <Route path="types-de-relation" element={<AdminRelationTypesPage />} />
              <Route path="taches" element={<AdminJobsPage />} />
              <Route path="nomenclatures" element={<Navigate to="nomenclatures/types-de-document" replace />} />
              <Route path="nomenclatures/types-de-document" element={<AdminNomenclaturesPage route="/document-types" title="Types de documents" />} />
              <Route path="nomenclatures/ministres-de-tutelle" element={<AdminNomenclaturesPage route="/supervising-ministers" title="Ministres de tutelle" />} />
              <Route path="nomenclatures/types-de-mail" element={<AdminNomenclaturesPage route="/email-types" title="Types d'email" />} />
              <Route path="imports/structures" element={<BulkImport type="structures" />} />
              <Route path="imports/personnes" element={<BulkImport type="personnes" />} />
              <Route path="imports/laureats" element={<BulkImport type="lauréats" />} />
              <Route path="imports/gouvernance" element={<BulkImport type="gouvernance" />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute roles={['admin', 'user']} />}>
            <Route path="/structures/ajouter" element={<StructureAddPage />} />
            <Route path="/categories/ajouter" element={<CategoriesAddPage />} />
            <Route path="/personnes/ajouter" element={<PersonAddPage />} />
            <Route path="/termes/ajouter" element={<TermsAddPage />} />
            <Route path="/prix/ajouter" element={<PrizeAddPage />} />
            <Route path="/projets/ajouter" element={<ProjectAddPage />} />
            <Route path="/textes-officiels/ajouter" element={<OfficialTextAddPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/nous-contacter" element={<ContactPage />} />
            <Route path="/aide" element={<HelpPage />} />
            <Route path="/projet-et-equipe" element={<ProjetEtEquipe />} />
            <Route path="/ressources" element={<RessourcesExternesPage />} />
            <Route path="/mon-compte" element={<AccountPage />}>
              <Route path="" element={<Navigate to="/mon-compte/profile" replace />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="preferences" element={<PreferencesPage />} />
              <Route path="securite" element={<SecurityPage />} />
            </Route>

            <Route path="/rechercher/*" element={<SearchPage />} />

            <Route path="/structures/:id/exporter" element={<StructureExportPage />} />
            <Route path="/structures/:id" element={<StructureByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<StructurePresentationPage />} />
              <Route path="actualites" element={<ActualitesOutlet />} />
              <Route path="evenements" element={<AgendaOutlet />} />
              <Route path="categories" element={<StructureCategoriesPage />} />
              <Route path="categories-geographiques" element={<StructureCategoriesGeographiquesPage />} />
              <Route path="documents" element={<DocumentsOutlet />} />
              <Route path="textes-officiels" element={<OfficialTextsOutlet />} />
              <Route path="gouvernance-et-referents" element={<StructureGouvernancePage />} />
              <Route path="chiffres-cles">
                <Route path="" element={<Navigate to="etudiants" replace />} />
                <Route path="budget" element={<StructureBudgetPage />} />
                <Route path="ressources-humaines" element={<StructureRHPage />} />
                <Route path="immobilier" element={<StructureImmobilierPage />} />
                <Route path="etudiants" element={<StructureEtudiantsPage />} />
                <Route path="offre-de-formation" element={<StructureOffreDeFormationPage />} />
                <Route path="insertion-professionnelle" element={<StructureInsertionProfessionnellePage />} />
              </Route>
              <Route path="projets" element={<StructureProjetsPage />} />
              <Route path="prix-et-recompenses" element={<StructurePrixEtRecompensesPage />} />
              <Route path="elements-lies" element={<StructureElementsLiesPage />} />
              <Route path="journal" element={<JournalOutlet />} />
            </Route>

            <Route path="/categories/:id/exporter" element={<CategoriesExportPage />} />
            <Route path="/categories/:id" element={<CategoryByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<CategoryPresentationPage />} />
              <Route path="elements-lies" element={<CategoryRelatedElements />} />
              <Route path="actualites" element={<ActualitesOutlet />} />
              <Route path="evenements" element={<AgendaOutlet />} />
              <Route path="documents" element={<DocumentsOutlet />} />
              <Route path="textes-officiels" element={<OfficialTextsOutlet />} />
              <Route path="journal" element={<JournalOutlet />} />
            </Route>

            <Route path="/personnes/:id/exporter" element={<PersonExportPage />} />
            <Route path="/persons/:id" element={<Redirect />} />
            <Route path="/personnes/:id" element={<PersonByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<PersonPresentationPage />} />
              <Route path="mandats" element={<PersonMandats />} />
              <Route path="projets" element={<PersonProjets />} />
              <Route path="actualites" element={<ActualitesOutlet />} />
              <Route path="evenements" element={<AgendaOutlet />} />
              <Route path="prix-et-recompenses" element={<PersonPrizes />} />
              <Route path="categories" element={<PersonCategories />} />
              <Route path="documents" element={<DocumentsOutlet />} />
              <Route path="textes-officiels" element={<OfficialTextsOutlet />} />
              <Route path="elements-lies" element={<PersonsRelatedElements />} />
              <Route path="journal" element={<JournalOutlet />} />
            </Route>

            <Route path="/termes/:id/exporter" element={<TermExportPage />} />
            <Route path="/terms/:id" element={<Redirect />} />
            <Route path="/termes/:id" element={<TermByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<TermPresentationPage />} />
              <Route path="elements-lies" element={<TermRelatedElements />} />
              <Route path="actualites" element={<ActualitesOutlet />} />
              <Route path="evenements" element={<AgendaOutlet />} />
              <Route path="documents" element={<DocumentsOutlet />} />
              <Route path="textes-officiels" element={<OfficialTextsOutlet />} />
              <Route path="journal" element={<JournalOutlet />} />
            </Route>

            <Route path="/prix/:id/exporter" element={<PrizeExportPage />} />
            <Route path="/prizes/:id" element={<Redirect />} />
            <Route path="/prix/:id" element={<PrizeByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<PrizePresentationPage />} />
              <Route path="categories" element={<PrizeCategories />} />
              <Route path="actualites" element={<ActualitesOutlet />} />
              <Route path="evenements" element={<AgendaOutlet />} />
              <Route path="documents" element={<DocumentsOutlet />} />
              <Route path="textes-officiels" element={<OfficialTextsOutlet />} />
              <Route path="journal" element={<JournalOutlet />} />
            </Route>

            <Route path="/projets/:id/exporter" element={<ProjectExportPage />} />
            <Route path="/projects/:id" element={<Redirect />} />
            <Route path="/projets/:id" element={<ProjectByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<ProjectPresentationPage />} />
              <Route path="categories" element={<ProjectCategories />} />
              <Route path="actualites" element={<ActualitesOutlet />} />
              <Route path="evenements" element={<AgendaOutlet />} />
              <Route path="prix-et-recompenses" element={<ProjectPrizes />} />
              <Route path="documents" element={<DocumentsOutlet />} />
              <Route path="textes-officiels" element={<OfficialTextsOutlet />} />
              <Route path="journal" element={<JournalOutlet />} />
            </Route>

            <Route path="/official-texts/:id" element={<Redirect />} />
            <Route path="/textes-officiels/:id" element={<OfficialTextsByIdPage />} />

            <Route path="/supervising-ministers/:id" element={<Redirect />} />
            <Route path="/ministres-de-tutelle/:id" element={<SupervisingMinistersByIdPage />} />

            <Route path="/legal-categories/:id" element={<Redirect />} />
            <Route path="/categories-juridiques/:id" element={<LegalCategoriesByIdPage />} />

            <Route path="/contribuer" element={<ContributePage />} />
          </Route>
        </Route>
      </RouterRoutes>
    </>
  );
}
