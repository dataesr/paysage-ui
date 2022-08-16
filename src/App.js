import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CategoriesPage from './pages/Categories';
import CategoriesAddPage from './pages/Categories/add';
import CategoryByIdPage from './pages/Categories/id';
import ContributePage from './pages/Contribute';
import HelpPage from './pages/Help';
import HomePage from './pages/Home';
import OfficialTextsPage from './pages/OfficialTexts';
import OfficialTextsAddPage from './pages/OfficialTexts/add';
import OfficialTextsByIdPage from './pages/OfficialTexts/id';
import PersonsPage from './pages/Persons';
import PersonsAddPage from './pages/Persons/add';
import PersonByIdPage from './pages/Persons/id';
import ProjectsPage from './pages/Projects';
import ProjectsAddPage from './pages/Projects/add';
import RessourcesPage from './pages/Ressources';
import StructuresPage from './pages/Structures';
import StructuresAddPage from './pages/Structures/add';
import StructureByIdPage from './pages/Structures/id';
import TermsPage from './pages/Terms';
import TermsAddPage from './pages/Terms/add';
import TermByIdPage from './pages/Terms/id';
import Layout from './components/Layout';
import SignIn from './pages/Authentication/signin';
import SignUp from './pages/Authentication/signup';
import Bienvenue from './pages/Authentication/bienvenue';

import './styles/index.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/se-connecter" element={<SignIn />} />
          <Route path="/creer-un-compte" element={<SignUp />} />
          <Route path="/bienvenue" element={<Bienvenue />} />

          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/ajouter" element={<CategoriesAddPage />} />
          <Route path="/categories/:id" element={<CategoryByIdPage />} />

          <Route path="/contribuer" element={<ContributePage />} />

          <Route path="/personnes" element={<PersonsPage />} />
          <Route path="/personnes/ajouter" element={<PersonsAddPage />} />
          <Route path="/personnes/:id" element={<PersonByIdPage />} />

          <Route path="/projets" element={<ProjectsPage />} />
          <Route path="/projets/ajouter" element={<ProjectsAddPage />} />

          <Route path="/structures" element={<StructuresPage />} />
          <Route path="/structures/ajouter" element={<StructuresAddPage />} />
          <Route path="/structures/:id" element={<StructureByIdPage />} />

          <Route path="/termes" element={<TermsPage />} />
          <Route path="/termes/ajouter" element={<TermsAddPage />} />
          <Route path="/termes/:id" element={<TermByIdPage />} />

          <Route path="/textes-officiels" element={<OfficialTextsPage />} />
          <Route
            path="/textes-officiels/ajouter"
            element={<OfficialTextsAddPage />}
          />
          <Route
            path="/textes-officiels/:id"
            element={<OfficialTextsByIdPage />}
          />

          <Route path="/ressources" element={<RessourcesPage />} />

          <Route path="/aide" element={<HelpPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
