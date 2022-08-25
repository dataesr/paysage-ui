import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Admin from './pages/Admin';
import AdminDashboard from './pages/Admin/dashboard';
import CategoriesAddPage from './pages/Categories/add';
import CategoriesPage from './pages/Categories';
import CategoryByIdPage from './pages/Categories/id';
import ContributePage from './pages/Contribute';
import HelpPage from './pages/Help';
import HomePage from './pages/Home';
import Layout from './components/Layout';
import Nomenclatures from './pages/Admin/nomenclatures';
import OfficialTextsAddPage from './pages/OfficialTexts/add';
import OfficialTextsByIdPage from './pages/OfficialTexts/id';
import OfficialTextsPage from './pages/OfficialTexts';
import PersonByIdPage from './pages/Persons/id';
import PersonsAddPage from './pages/Persons/add';
import PersonsPage from './pages/Persons';
import Passwordless from './pages/Authentication/passwordless';
import ProjectsAddPage from './pages/Projects/add';
import ProjectsPage from './pages/Projects';
import RessourcesInternesPage from './pages/Ressources/internes';
import RessourcesExternesPage from './pages/Ressources/externes';
import SignIn from './pages/Authentication/signin';
import SignUp from './pages/Authentication/signup';
import StructureByIdPage from './pages/Structures/id';
import StructuresAddPage from './pages/Structures/add';
import StructuresPage from './pages/Structures';
import TermByIdPage from './pages/Terms/id';
import TermsAddPage from './pages/Terms/add';
import TermsPage from './pages/Terms';
import UserAccount from './pages/Account';
import UserGroups from './pages/Account/groups';
import UserProfile from './pages/Account/profile';
import UserPreferences from './pages/Account/preferences';
import Users from './pages/Admin/utilisateurs';
import UserSecurity from './pages/Account/security';

import './styles/index.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/se-connecter" element={<SignIn />} />
          <Route path="/creer-un-compte" element={<SignUp />} />
          <Route path="/mot-de-passe-oublie" element={<Passwordless />} />

          <Route path="/profile" element={<UserAccount />}>
            <Route path="" element={<UserProfile />} />
            <Route path="preferences" element={<UserPreferences />} />
            <Route path="groupes" element={<UserGroups />} />
            <Route path="securite" element={<UserSecurity />} />
          </Route>

          <Route path="/admin" element={<Admin />}>
            <Route path="" element={<AdminDashboard />} />
            <Route path="utilisateurs" element={<Users />} />
            <Route path="nomenclatures/types-de-document" element={<Nomenclatures route="document-types" title="Types de documents" />} />
            <Route path="nomenclatures/ministeres-de-tutelle" element={<Nomenclatures route="supervising-ministers" title="Ministères de tutelle" />} />
            <Route path="nomenclatures/types-de-mail" element={<Nomenclatures route="email-types" title="Types d'email" />} />
          </Route>

          <Route path="/rechercher/categories" element={<CategoriesPage />} />
          <Route path="/categories/ajouter" element={<CategoriesAddPage />} />
          <Route path="/categories/:id" element={<CategoryByIdPage />} />

          <Route path="/contribuer" element={<ContributePage />} />

          <Route path="/rechercher/personnes" element={<PersonsPage />} />
          <Route path="/personnes/ajouter" element={<PersonsAddPage />} />
          <Route path="/personnes/:id" element={<PersonByIdPage />} />

          <Route path="/rechercher/projets" element={<ProjectsPage />} />
          <Route path="/projets/ajouter" element={<ProjectsAddPage />} />

          <Route path="/rechercher/structures" element={<StructuresPage />} />
          <Route path="/structures/ajouter" element={<StructuresAddPage />} />
          <Route path="/structures/:id" element={<StructureByIdPage />} />

          <Route path="/rechercher/termes" element={<TermsPage />} />
          <Route path="/termes/ajouter" element={<TermsAddPage />} />
          <Route path="/termes/:id" element={<TermByIdPage />} />

          <Route
            path="/rechercher/textes-officiels"
            element={<OfficialTextsPage />}
          />
          <Route
            path="/textes-officiels/ajouter"
            element={<OfficialTextsAddPage />}
          />
          <Route
            path="/textes-officiels/ajouter/:route/:idFrom"
            element={<OfficialTextsAddPage />}
          />
          <Route
            path="/textes-officiels/:id"
            element={<OfficialTextsByIdPage />}
          />
          <Route
            path="/textes-officiels/:id/:route/:idFrom"
            element={<OfficialTextsByIdPage />}
          />

          <Route
            path="/ressources-internes"
            element={<RessourcesInternesPage />}
          />
          <Route
            path="/ressources-externes"
            element={<RessourcesExternesPage />}
          />

          <Route path="/aide" element={<HelpPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
