import { Col, Container, Row, SideMenu, SideMenuItem, SideMenuLink } from '@dataesr/react-dsfr';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle';
import AdminApiKeysPage from './api-keys';
import AdminLegalCategoriesPage from './categories-juridiques';
import AdminGeographicalExceptionsPage from './exceptions-geographiques';
import AdminDashboardPage from './dashboard';
import AdminGroupsPage from './groupes';
import AdminJobsPage from './jobs';
import AdminJournalPage from './journal';
import AdminNomenclaturesPage from './nomenclatures';
import AdminGeographicalCategoriesPage from './categories-geographiques';
import AdminSirenePage from './sirene';

import AdminRelationTypesPage from './relation-types';
import AdminUsersPage from './users';

function AdminPage() {
  usePageTitle('Administration du site');
  const { pathname } = useLocation();
  const page = pathname.split('/').pop();
  return (
    <Container spacing="mb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink className={(page === 'dashboard') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin" replace />}>
              Tableau de bord
            </SideMenuLink>
            <SideMenuLink className={(page === 'journal') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/journal" replace />}>
              Journal des modifications
            </SideMenuLink>
            <SideMenuLink className={(page === 'utilisateurs') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/utilisateurs" replace />}>
              Utilisateurs
            </SideMenuLink>
            <SideMenuLink className={(page === 'groupes') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/groupes" replace />}>
              Groupes d'utilisateurs
            </SideMenuLink>
            <SideMenuLink className={(page === 'apikeys') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/apikeys" replace />}>
              Clés API
            </SideMenuLink>
            <SideMenuItem title="Nomenclatures">
              <SideMenuLink className={(page === 'categories-juridiques') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/categories-juridiques" replace />}>
                Catégories juridiques
              </SideMenuLink>
              <SideMenuLink className={(page === 'types-de-document') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/nomenclatures/types-de-document" replace />}>
                Types de document
              </SideMenuLink>
              <SideMenuLink className={(page === 'types-de-mail') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/nomenclatures/types-de-mail" replace />}>
                Types de mail
              </SideMenuLink>
              <SideMenuLink className={(page === 'ministres-de-tutelle') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/nomenclatures/ministres-de-tutelle" replace />}>
                Ministres de tutelle
              </SideMenuLink>
              <SideMenuLink className={(page === 'types-de-relation') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/types-de-relation" replace />}>
                Types de relation
              </SideMenuLink>
              {/* <SideMenuLink className={(page === 'categories-geographiques') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/categories-geographiques" replace />}>
                Catégories géographiques
              </SideMenuLink> */}
            </SideMenuItem>
            <SideMenuLink className={(page === 'exceptions-geographiques') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/exceptions-geographiques" replace />}>
              Exceptions géographiques
            </SideMenuLink>
            <SideMenuItem title="Imports en masse">
              <SideMenuLink className={(page === 'structures') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/imports/structures" replace />}>
                Structures
              </SideMenuLink>
              <SideMenuLink className={(page === 'personnes') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/imports/personnes" replace />}>
                Personnes
              </SideMenuLink>
              <SideMenuLink className={(page === 'prix') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/imports/prix" replace />}>
                Prix
              </SideMenuLink>
              <SideMenuLink className={(page === 'laureats') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/imports/laureats" replace />}>
                Lauréat
              </SideMenuLink>
              <SideMenuLink className={(page === 'gouvernance') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/imports/gouvernance" replace />}>
                Gouvernance
              </SideMenuLink>
              <SideMenuLink className={(page === 'terms') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/imports/terms" replace />}>
                Termes
              </SideMenuLink>
              <SideMenuLink className={(page === 'structures-identifiers') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/imports/structures-identifiers" replace />}>
                Identifiants de structure
              </SideMenuLink>
              <SideMenuLink className={(page === 'persons-identifiers') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/imports/persons-identifiers" replace />}>
                Identifiants de personne
              </SideMenuLink>
            </SideMenuItem>
            <SideMenuLink className={(page === 'taches') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/taches" replace />}>
              Tâches du système
            </SideMenuLink>
            <SideMenuLink className={(page === 'sirene') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/sirene" replace />}>
              Mises à jour Sirene
            </SideMenuLink>
          </SideMenu>
        </Col>
        <Col n="12 md-9">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export {
  AdminDashboardPage, AdminPage, AdminUsersPage, AdminNomenclaturesPage, AdminJournalPage,
  AdminLegalCategoriesPage, AdminRelationTypesPage, AdminGroupsPage, AdminApiKeysPage, AdminJobsPage,
  AdminGeographicalExceptionsPage, AdminGeographicalCategoriesPage, AdminSirenePage,
};
