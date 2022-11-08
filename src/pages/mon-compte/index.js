import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Col, Container, Row, SideMenu, SideMenuItem, SideMenuLink } from '@dataesr/react-dsfr';

import ProfilePage from './profile';
import PreferencesPage from './preferences';
import GroupsPage from './groups';
import SecurityPage from './security';

function AccountPage() {
  return (
    <Container spacing="mb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink asLink={<RouterLink to="/mon-compte" />}>
              Profil
            </SideMenuLink>
            <SideMenuItem expandedDefault title="Paramètres">
              <SideMenuLink asLink={<RouterLink to="/mon-compte/preferences" />}>
                Préférences
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="/mon-compte/securite" />}>
                Sécurité
              </SideMenuLink>
            </SideMenuItem>
            <SideMenuLink asLink={<RouterLink to="/mon-compte/groupes" />}>
              Groupes
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

export { AccountPage, ProfilePage, PreferencesPage, SecurityPage, GroupsPage };
