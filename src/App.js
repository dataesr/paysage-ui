import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import CategoriesPage from './pages/Categories';
import CategoriesAddPage from './pages/Categories/add';
import ContributePage from './pages/Contribute';
import Footer from './components/Footer';
import Header from './components/Header';
import HelpPage from './pages/Help';
import HomePage from './pages/Home';
import OfficialTextsPage from './pages/OfficialTexts';
import OfficialTextsAddPage from './pages/OfficialTexts/add';
import PersonsPage from './pages/Persons';
import PersonsAddPage from './pages/Persons/add';
import ProjectsPage from './pages/Projects';
import ProjectsAddPage from './pages/Projects/add';
import RessourcesPage from './pages/Ressources';
import StructuresPage from './pages/Structures';
import StructuresAddPage from './pages/Structures/add';
import TermsPage from './pages/Terms';
import TermsAddPage from './pages/Terms/add';

import './styles/index.scss';

function App() {
  axios.interceptors.request.use(
    (config) => {
      // eslint-disable-next-line no-param-reassign
      config.baseURL = process.env.REACT_APP_API_URL;
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = 'Bearer 123';
      return config;
    },
    (error) =>
      // Do something with request error
      // eslint-disable-next-line implicit-arrow-linebreak
      Promise.reject(error),
  );

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/ajouter" element={<CategoriesAddPage />} />

        <Route path="/contribuer" element={<ContributePage />} />

        <Route path="/personnes" element={<PersonsPage />} />
        <Route path="/personnes/ajouter" element={<PersonsAddPage />} />

        <Route path="/projets" element={<ProjectsPage />} />
        <Route path="/projets/ajouter" element={<ProjectsAddPage />} />

        <Route path="/structures" element={<StructuresPage />} />
        <Route path="/structures/ajouter" element={<StructuresAddPage />} />

        <Route path="/termes" element={<TermsPage />} />
        <Route path="/termes/ajouter" element={<TermsAddPage />} />

        <Route path="/textes-officiels" element={<OfficialTextsPage />} />
        <Route
          path="/textes-officiels/ajouter"
          element={<OfficialTextsAddPage />}
        />

        <Route path="/ressources" element={<RessourcesPage />} />

        <Route path="/aide" element={<HelpPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
