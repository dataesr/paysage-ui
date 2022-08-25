import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Col, Container, Row, SideMenu, SideMenuItem, SideMenuLink } from '@dataesr/react-dsfr';

export default function Account() {
  return (
    <Container spacing="mb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink asLink={<RouterLink to="/profile" />}>
              Profil
            </SideMenuLink>
            <SideMenuItem expandedDefault title="Paramètres">
              <SideMenuLink asLink={<RouterLink to="/profile/preferences" />}>
                Préférences
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="/profile/securite" />}>
                Sécurité
              </SideMenuLink>
            </SideMenuItem>
            <SideMenuLink asLink={<RouterLink to="/profile/groupes" />}>
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
