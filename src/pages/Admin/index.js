import { Col, Container, Row, SideMenu, SideMenuItem, SideMenuLink } from '@dataesr/react-dsfr';
import { Link as RouterLink, Outlet } from 'react-router-dom';

export default function Administation() {
  return (
    <Container spacing="mb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink asLink={<RouterLink to="/admin" />}>
              Tableau de bord
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="/admin/utilisateurs" />}>
              Utilisateurs
            </SideMenuLink>
            <SideMenuItem expandedDefault title="Nomenclatures">
              <SideMenuLink asLink={<RouterLink to="/admin/nomenclatures/types-de-document" />}>
                Types de document
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="/admin/nomenclatures/types-de-mail" />}>
                Types de mail
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="/admin/nomenclatures/ministeres-de-tutelle" />}>
                Ministères de tutelle
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
