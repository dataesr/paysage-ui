import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Col, Container, Row, SideMenu, SideMenuItem, SideMenuLink } from '@dataesr/react-dsfr';
import SecurityPage from './security';

import ProfilePage from './profile';
import PreferencesPage from './preferences';
import usePageTitle from '../../hooks/usePageTitle';

function AccountPage() {
  usePageTitle('Paysage · Mon compte');
  return (
    <Container spacing="mb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink asLink={<RouterLink to="/mon-compte" replace />}>
              Profil
            </SideMenuLink>
            <SideMenuItem expandedDefault title="Paramètres">
              <SideMenuLink asLink={<RouterLink to="/mon-compte/preferences" replace />}>
                Préférences
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="/mon-compte/securite" replace />}>
                Sécurité
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

export { AccountPage, ProfilePage, PreferencesPage, SecurityPage };
