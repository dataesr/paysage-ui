import { Col, Container, Row, SideMenu, SideMenuItem, SideMenuLink } from '@dataesr/react-dsfr';
import { Link as RouterLink, Outlet } from 'react-router-dom';

import AdminDashboardPage from './dashboard';
import AdminNomenclaturesPage from './nomenclatures';
import AdminUsersPage from './users';
import AdminLegalCategoriesPage from './categories-juridiques';
import AdminRelationTypesPage from './relation-types';
import AdminGroupsPage from './groupes';
import AdminApiKeysPage from './api-keys';
import usePageTitle from '../../hooks/usePageTitle';

function AdminPage() {
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
            <SideMenuItem expandedDefault title="Nomenclatures">
              <SideMenuLink asLink={<RouterLink to="/admin/categories-juridiques" replace />}>
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
