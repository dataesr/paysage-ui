import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';

import Redirect from './components/redirect';
import { ContributePage, PersonAddPage, ProjectAddPage, StructureAddPage, OfficialTextAddPage } from './pages/contribuer';
import HelpPage from './pages/aide';
import HomePage from './pages/accueil';
import Layout from './components/layout';
import OfficialTextsByIdPage from './pages/textes-officiels/id';
import Passwordless from './pages/mot-de-passe-oublie';
import RessourcesExternesPage from './pages/resources-externes';
import SignIn from './pages/se-connecter';
import SignUp from './pages/creer-un-compte';

import ProtectedRoute from './components/protected-route';

import {
  StructureByIdPage,
  StructureBudgetPage,
  StructureCategoriesPage,
  StructureElementsLiesPage,
  StructureEtudiantsPage,
  StructureExportPage,
  StructureGouvernancePage,
  StructureImmobilierPage,
  StructureOffreDeFormationPage,
  StructurePresentationPage,
  StructureProjetsPage,
  StructurePrixEtRecompensesPage,
  StructureRHPage,
} from './pages/structures/[id]';

import {
  PersonByIdPage,
  PersonCategories,
  PersonMandats,
  PersonPresentationPage,
  PersonPrices,
  PersonProjets,
  PersonsRelatedElements,
} from './pages/personnes/[id]';

import TermsAddPage from './pages/termes/ajouter';
import { TermByIdPage, TermPresentationPage, TermCategories } from './pages/termes/[id]';

import {
  ProjectByIdPage,
  ProjectPresentationPage,
  ProjectCategories,
  ProjectPrices,
  ProjectRelatedElements,
} from './pages/projets/[id]';

import CategoriesAddPage from './pages/categories/ajouter';
import { CategoryByIdPage, CategoryPresentationPage, CategoryCategories } from './pages/categories/[id]';

import { AccountPage, ProfilePage, PreferencesPage, SecurityPage, GroupsPage } from './pages/mon-compte';
import { AdminPage, AdminDashboardPage, AdminUsersPage, NomenclaturesPage, LegalCategoriesPage, RelationTypesPage } from './pages/admin';

import './styles/index.scss';
import SearchPage from './pages/rechercher';
import AgendaOutlet from './components/outlets/evenements';
import DocumentsOutlet from './components/outlets/documents';
import ActualitesOutlet from './components/outlets/actualites';
import OfficialTextsOutlet from './components/outlets/textes-officiels';
import ParticipationsOutlet from './components/outlets/participations';
import PriceAddPage from './pages/prix/ajouter';
import { PriceByIdPage, PriceCategories, PricePresentationPage } from './pages/prix/[id]';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/se-connecter" element={<SignIn />} />
          <Route path="/creer-un-compte" element={<SignUp />} />
          <Route path="/mot-de-passe-oublie" element={<Passwordless />} />
          <Route path="/ressources-externes" element={<RessourcesExternesPage />} />
          <Route path="/aide" element={<HelpPage />} />

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminPage />}>
              <Route path="" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="utilisateurs" element={<AdminUsersPage />} />
              <Route path="categories-juridiques" element={<LegalCategoriesPage />} />
              <Route path="types-de-relation" element={<RelationTypesPage />} />
              <Route path="nomenclatures" element={<Navigate to="nomenclatures/types-de-document" replace />} />
              <Route path="nomenclatures/types-de-document" element={<NomenclaturesPage route="/document-types" title="Types de documents" />} />
              <Route path="nomenclatures/ministeres-de-tutelle" element={<NomenclaturesPage route="/supervising-ministers" title="Ministères de tutelle" />} />
              <Route path="nomenclatures/types-de-mail" element={<NomenclaturesPage route="/email-types" title="Types d'email" />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/mon-compte" element={<AccountPage />}>
              <Route path="" element={<Navigate to="/mon-compte/profile" replace />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="preferences" element={<PreferencesPage />} />
              <Route path="groupes" element={<GroupsPage />} />
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
                <Route path="ressource-humaines" element={<StructureRHPage />} />
                <Route path="immobilier" element={<StructureImmobilierPage />} />
                <Route path="etudiants" element={<StructureEtudiantsPage />} />
                <Route path="offre-de-formation" element={<StructureOffreDeFormationPage />} />
              </Route>
              <Route path="projets" element={<StructureProjetsPage />} />
              <Route path="prix-et-recompenses" element={<StructurePrixEtRecompensesPage />} />
              <Route path="elements-lies" element={<StructureElementsLiesPage />} />
              <Route path="participations" element={<ParticipationsOutlet />} />
            </Route>

            <Route path="/categories/ajouter" element={<CategoriesAddPage />} />
            <Route path="/categories/:id" element={<CategoryByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<CategoryPresentationPage />} />
              <Route path="categories" element={<CategoryCategories />} />
              <Route path="actualites" element={<ActualitesOutlet />} />
              <Route path="evenements" element={<AgendaOutlet />} />
              <Route path="documents" element={<DocumentsOutlet />} />
              <Route path="textes-officiels" element={<OfficialTextsOutlet />} />
            </Route>

            <Route path="/personnes/ajouter" element={<PersonAddPage />} />
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
              <Route path="participations" element={<ParticipationsOutlet />} />
            </Route>

            <Route path="/termes/ajouter" element={<TermsAddPage />} />
            <Route path="/terms/:id" element={<Redirect />} />
            <Route path="/termes/:id" element={<TermByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<TermPresentationPage />} />
              <Route path="categories" element={<TermCategories />} />
              <Route path="actualites" element={<ActualitesOutlet />} />
              <Route path="evenements" element={<AgendaOutlet />} />
              <Route path="documents" element={<DocumentsOutlet />} />
              <Route path="textes-officiels" element={<OfficialTextsOutlet />} />
            </Route>

            <Route path="/prix/ajouter" element={<PriceAddPage />} />
            <Route path="/prices/:id" element={<Redirect />} />
            <Route path="/prix/:id" element={<PriceByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<PricePresentationPage />} />
              <Route path="categories" element={<PriceCategories />} />
              <Route path="actualites" element={<ActualitesOutlet />} />
              <Route path="evenements" element={<AgendaOutlet />} />
              <Route path="documents" element={<DocumentsOutlet />} />
              <Route path="textes-officiels" element={<OfficialTextsOutlet />} />
            </Route>

            <Route path="/projets/ajouter" element={<ProjectAddPage />} />
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
              <Route path="elements-lies" element={<ProjectRelatedElements />} />
            </Route>

            <Route path="/textes-officiels/ajouter" element={<OfficialTextAddPage />} />
            <Route path="/official-texts/:id" element={<Redirect />} />
            <Route path="/textes-officiels/:id" element={<OfficialTextsByIdPage />} />

            <Route path="/contribuer" element={<ContributePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
