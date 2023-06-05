import { Col, Container, Row, SideMenu, SideMenuItem, SideMenuLink } from '@dataesr/react-dsfr';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle';
import AdminApiKeysPage from './api-keys';
import AdminLegalCategoriesPage from './categories-juridiques';
import AdminDashboardPage from './dashboard';
import AdminGroupsPage from './groupes';
import AdminJobsPage from './jobs';
import AdminJournalPage from './journal';
import AdminNomenclaturesPage from './nomenclatures';
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
            </SideMenuItem>
            <SideMenuItem title="Imports en masse">
              <SideMenuLink className={(page === 'structures') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/imports/structures" replace />}>
                Structures
              </SideMenuLink>
              <SideMenuLink className={(page === 'personnes') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/imports/personnes" replace />}>
                Personnes
              </SideMenuLink>
            </SideMenuItem>
            <SideMenuLink className={(page === 'taches') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/taches" replace />}>
              Tâches du système
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
};
