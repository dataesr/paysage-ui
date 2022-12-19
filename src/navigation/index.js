import { Navigate, Routes as RouterRoutes, Route } from 'react-router-dom';

import Redirect from './redirect';
import { ContributePage, PersonAddPage, ProjectAddPage, StructureAddPage, OfficialTextAddPage } from '../pages/contribuer';
import HelpPage from '../pages/aide';
import HomePage from '../pages/accueil';
import Layout from '../layout';
import OfficialTextsByIdPage from '../pages/textes-officiels/id';
import Passwordless from '../pages/mot-de-passe-oublie';
import RessourcesExternesPage from '../pages/resources-externes';
import SignIn from '../pages/se-connecter';
import SignUp from '../pages/creer-un-compte';
import NotFound from '../pages/not-found';

import ProtectedRoute from './protected-route';

import {
  StructureBudgetPage,
  StructureByIdPage,
  StructureCategoriesPage,
  StructureElementsLiesPage,
  StructureEtudiantsPage,
  StructureExportPage,
  StructureGouvernancePage,
  StructureImmobilierPage,
  StructureInsertionProfessionnellePage,
  StructureOffreDeFormationPage,
  StructurePresentationPage,
  StructureProjetsPage,
  StructurePrixEtRecompensesPage,
  StructureRHPage,
} from '../pages/structures/[id]';

import {
  PersonByIdPage,
  PersonCategories,
  PersonExportPage,
  PersonMandats,
  PersonPresentationPage,
  PersonPrices,
  PersonProjets,
  PersonsRelatedElements,
} from '../pages/personnes/[id]';

import TermsAddPage from '../pages/termes/ajouter';
import { TermByIdPage, TermPresentationPage, TermExportPage, TermRelatedElements } from '../pages/termes/[id]';

import {
  ProjectByIdPage,
  ProjectPresentationPage,
  ProjectCategories,
  ProjectPrices,
  ProjectExportPage,
} from '../pages/projets/[id]';

import CategoriesAddPage from '../pages/categories/ajouter';
import { CategoryByIdPage, CategoryPresentationPage, CategoriesExportPage, CategoryRelatedElements } from '../pages/categories/[id]';

import { AccountPage, ProfilePage, PreferencesPage, SecurityPage } from '../pages/mon-compte';
import {
  AdminPage, AdminDashboardPage, AdminUsersPage, AdminNomenclaturesPage,
  AdminLegalCategoriesPage, AdminRelationTypesPage, AdminGroupsPage,
} from '../pages/admin';

import '../styles/index.scss';
import SearchPage from '../pages/rechercher';
import ContactPage from '../pages/nous-contacter';
import ProjetEtEquipe from '../pages/projet-et-equipe';
import AgendaOutlet from '../components/blocs/evenements';
import DocumentsOutlet from '../components/blocs/documents';
import ActualitesOutlet from '../components/blocs/actualites';
import OfficialTextsOutlet from '../components/blocs/textes-officiels';
import JournalOutlet from '../components/blocs/modification-journal';
import PriceAddPage from '../pages/prix/ajouter';
import { PriceByIdPage, PriceCategories, PriceExportPage, PricePresentationPage } from '../pages/prix/[id]';
import SupervisingMinistersByIdPage from '../pages/supervising-ministers/id';
import LegalCategoriesByIdPage from '../pages/legal-categories/id';

import ScrollToTopOnPathnameChange from './scroll-top-on-pathname-change';

export default function Routes() {
  return (
    <>
      <ScrollToTopOnPathnameChange />
      <RouterRoutes>
        <Route element={<Layout />}>
          <Route path="/se-connecter" element={<SignIn />} />
          <Route path="/creer-un-compte" element={<SignUp />} />
          <Route path="/mot-de-passe-oublie" element={<Passwordless />} />
          <Route path="*" element={<NotFound />} />

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminPage />}>
              <Route path="" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="utilisateurs" element={<AdminUsersPage />} />
              <Route path="groupes" element={<AdminGroupsPage />} />
              <Route path="categories-juridiques" element={<AdminLegalCategoriesPage />} />
              <Route path="types-de-relation" element={<AdminRelationTypesPage />} />
              <Route path="nomenclatures" element={<Navigate to="nomenclatures/types-de-document" replace />} />
              <Route path="nomenclatures/types-de-document" element={<AdminNomenclaturesPage route="/document-types" title="Types de documents" />} />
              <Route path="nomenclatures/ministres-de-tutelle" element={<AdminNomenclaturesPage route="/supervising-ministers" title="Ministres de tutelle" />} />
              <Route path="nomenclatures/types-de-mail" element={<AdminNomenclaturesPage route="/email-types" title="Types d'email" />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/nous-contacter" element={<ContactPage />} />
            <Route path="/aide" element={<HelpPage />} />
            <Route path="/projet-et-equipe" element={<ProjetEtEquipe />} />
            <Route path="/ressources-externes" element={<RessourcesExternesPage />} />
            <Route path="/mon-compte" element={<AccountPage />}>
              <Route path="" element={<Navigate to="/mon-compte/profile" replace />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="preferences" element={<PreferencesPage />} />
              <Route path="securite" element={<SecurityPage />} />
            </Route>

            <Route path="/rechercher/*" element={<SearchPage />} />

            <Route path="/structures/ajouter" element={<StructureAddPage />} />
            <Route path="/structures/:id/exporter" element={<StructureExportPage />} />
            <Route path="/structures/:id" element={<StructureByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<StructurePresentationPage />} />
              <Route path="actualites" element={<ActualitesOutlet />} />
              <Route path="evenements" element={<AgendaOutlet />} />
              <Route path="categories" element={<StructureCategoriesPage />} />
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

            <Route path="/categories/ajouter" element={<CategoriesAddPage />} />
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

            <Route path="/personnes/ajouter" element={<PersonAddPage />} />
            <Route path="/personnes/:id/exporter" element={<PersonExportPage />} />
            <Route path="/persons/:id" element={<Redirect />} />
            <Route path="/personnes/:id" element={<PersonByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<PersonPresentationPage />} />
              <Route path="mandats" element={<PersonMandats />} />
              <Route path="projets" element={<PersonProjets />} />
              <Route path="actualites" element={<ActualitesOutlet />} />
              <Route path="evenements" element={<AgendaOutlet />} />
              <Route path="prix-et-recompenses" element={<PersonPrices />} />
              <Route path="categories" element={<PersonCategories />} />
              <Route path="documents" element={<DocumentsOutlet />} />
              <Route path="textes-officiels" element={<OfficialTextsOutlet />} />
              <Route path="elements-lies" element={<PersonsRelatedElements />} />
              <Route path="journal" element={<JournalOutlet />} />
            </Route>

            <Route path="/termes/ajouter" element={<TermsAddPage />} />
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

            <Route path="/prix/ajouter" element={<PriceAddPage />} />
            <Route path="/prix/:id/exporter" element={<PriceExportPage />} />
            <Route path="/prices/:id" element={<Redirect />} />
            <Route path="/prix/:id" element={<PriceByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<PricePresentationPage />} />
              <Route path="categories" element={<PriceCategories />} />
              <Route path="actualites" element={<ActualitesOutlet />} />
              <Route path="evenements" element={<AgendaOutlet />} />
              <Route path="documents" element={<DocumentsOutlet />} />
              <Route path="textes-officiels" element={<OfficialTextsOutlet />} />
              <Route path="journal" element={<JournalOutlet />} />
            </Route>

            <Route path="/projets/ajouter" element={<ProjectAddPage />} />
            <Route path="/projets/:id/exporter" element={<ProjectExportPage />} />
            <Route path="/projects/:id" element={<Redirect />} />
            <Route path="/projets/:id" element={<ProjectByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<ProjectPresentationPage />} />
              <Route path="categories" element={<ProjectCategories />} />
              <Route path="actualites" element={<ActualitesOutlet />} />
              <Route path="evenements" element={<AgendaOutlet />} />
              <Route path="prix-et-recompenses" element={<ProjectPrices />} />
              <Route path="documents" element={<DocumentsOutlet />} />
              <Route path="textes-officiels" element={<OfficialTextsOutlet />} />
              <Route path="journal" element={<JournalOutlet />} />
            </Route>

            <Route path="/textes-officiels/ajouter" element={<OfficialTextAddPage />} />
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
