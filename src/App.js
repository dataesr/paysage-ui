import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';

import CategoriesAddPage from './pages/categories/ajouter';
import CategoriesPage from './pages/categories';
import CategoryByIdPage from './pages/categories/id';
import { ContributePage, PersonAddPage, ProjectAddPage, StructureAddPage, OfficialTextAddPage } from './pages/contribuer';
import HelpPage from './pages/aide';
import HomePage from './pages/accueil';
import Layout from './components/layout';
import OfficialTextsByIdPage from './pages/textes-officiels/id';
import OfficialTextsPage from './pages/textes-officiels';
import PersonByIdPage from './pages/personnes/id';
import PersonsPage from './pages/personnes';
import Passwordless from './pages/mot-de-passe-oublie';
import ProjectsPage from './pages/projets';
import RessourcesExternesPage from './pages/resources-externes';
import SignIn from './pages/se-connecter';
import SignUp from './pages/creer-un-compte';

import ProtectedRoute from './components/protected-route';

import StructuresPage from './pages/structures';
import {
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
  StructureExportPage,
} from './pages/structures/[id]';

import TermsPage from './pages/termes';
import TermByIdPage from './pages/termes/id';
import TermsAddPage from './pages/termes/ajouter';

import { AccountPage, ProfilePage, PreferencesPage, SecurityPage, GroupsPage } from './pages/mon-compte';
import { AdminPage, AdminDashboardPage, AdminUsersPage, NomenclaturesPage, LegalCategoriesPage, RelationTypesPage } from './pages/admin';

import './styles/index.scss';
import SearchPage from './pages/rechercher';

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

            <Route path="/structures" element={<StructuresPage />} />
            <Route path="/structures/ajouter" element={<StructureAddPage />} />
            <Route path="/structures/:id/exporter" element={<StructureExportPage />} />
            <Route path="/structures/:id" element={<StructureByIdPage />}>
              <Route path="" element={<Navigate to="presentation" replace />} />
              <Route path="presentation" element={<StructurePresentationPage />} />
              <Route path="gouvernance-et-referents" element={<StructureGouvernancePage />} />
              <Route path="ressource-humaines" element={<StructureRHPage />} />
              <Route path="budget" element={<StructureBudgetPage />} />
              <Route path="analyse-et-ressources-strategiques" element={<StructureAnalyseEtRessourcesStrategiquesPage />} />
              <Route path="actualites" element={<StructureActualitesPage />} />
              <Route path="immobilier" element={<StructureImmobilierPage />} />
              <Route path="etudiants" element={<StructureEtudiantsPage />} />
              <Route path="offre-de-formation" element={<StructureOffreDeFormationPage />} />
              <Route path="projets" element={<StructureProjetsPage />} />
              <Route path="chiffres-cles" element={<StructureChiffresClesPage />} />
              <Route path="textes-officiels" element={<StructureTextesOfficielsPage />} />
              <Route path="prix-et-recompenses" element={<StructurePrixEtRecompensesPage />} />
              <Route path="agenda" element={<StructureAgendaPage />} />
              <Route path="elements-lies" element={<StructureElementsLiesPage />} />
              <Route path="participations" element={<StructureParticipationsPage />} />
            </Route>

            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/ajouter" element={<CategoriesAddPage />} />
            <Route path="/categories/:id" element={<CategoryByIdPage />} />

            <Route path="/personnes" element={<PersonsPage />} />
            <Route path="/personnes/ajouter" element={<PersonAddPage />} />
            <Route path="/personnes/:id" element={<PersonByIdPage />} />

            <Route path="/projets/ajouter" element={<ProjectAddPage />} />
            <Route path="/projets" element={<ProjectsPage />} />

            <Route path="/termes" element={<TermsPage />} />
            <Route path="/termes/ajouter" element={<TermsAddPage />} />
            <Route path="/termes/:id" element={<TermByIdPage />} />

            <Route path="/textes-officiels" element={<OfficialTextsPage />} />
            <Route path="/textes-officiels/ajouter" element={<OfficialTextAddPage />} />
            <Route path="/textes-officiels/:id" element={<OfficialTextsByIdPage />} />

            <Route path="/contribuer" element={<ContributePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
