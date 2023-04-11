import { Col, Container, Row, SideMenu, SideMenuItem, SideMenuLink } from '@dataesr/react-dsfr';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';

import usePageTitle from '../../hooks/usePageTitle';
import AdminApiKeysPage from './api-keys';
import AdminLegalCategoriesPage from './categories-juridiques';
import AdminDashboardPage from './dashboard';
import AdminGroupsPage from './groupes';
import AdminNomenclaturesPage from './nomenclatures';
import AdminRelationTypesPage from './relation-types';
import AdminUsersPage from './users';

function AdminPage() {
  const { path } = useLocation();
  const page = path.pop('/');
  usePageTitle('Administration du site');
  return (
    <Container spacing="mb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink asLink={<RouterLink to="/admin" replace />}>
              Tableau de bord
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="/admin/utilisateurs" replace />}>
              Utilisateurs
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="/admin/groupes" replace />}>
              Groupes d'utilisateurs
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="/admin/apikeys" replace />}>
              Clés API
            </SideMenuLink>
            <SideMenuItem title="Nomenclatures">
              <SideMenuLink className={(page === 'categories-juridiques') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/categories-juridiques" replace />}>
                Catégories juridiques
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="/admin/nomenclatures/types-de-document" replace />}>
                Types de document
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="/admin/nomenclatures/types-de-mail" replace />}>
                Types de mail
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="/admin/nomenclatures/ministres-de-tutelle" replace />}>
                Ministres de tutelle
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="/admin/types-de-relation" replace />}>
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
              <SideMenuLink className={(page === 'gouvernance') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/imports/gouvernance" replace />}>
                Gouvernance
              </SideMenuLink>
              <SideMenuLink className={(page === 'laureats') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/imports/laureats" replace />}>
                Lauréats
              </SideMenuLink>
            </SideMenuItem>
            <SideMenuLink className={(page === 'taches') && 'sidemenu__item--active'} asLink={<RouterLink to="/admin/taches" replace />}>
              Tâches du systeme
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
  AdminDashboardPage, AdminPage, AdminUsersPage, AdminNomenclaturesPage,
  AdminLegalCategoriesPage, AdminRelationTypesPage, AdminGroupsPage, AdminApiKeysPage,
};
