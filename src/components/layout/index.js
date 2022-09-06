import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, SwitchTheme } from '@dataesr/react-dsfr';
import Header from './header';
import Footer from './footer';
import PageBorder from './page-border';

export default function Layout() {
  const [isSwitchThemeOpen, setIsSwitchThemeOpen] = useState(false);
  return (
    <>
      <Header />
      <SwitchTheme isOpen={isSwitchThemeOpen} setIsOpen={setIsSwitchThemeOpen} />
      <div role="alert" id="notice-container" />
      <Container as="main" role="main" fluid>
        <Outlet />
      </Container>
      <Footer switchTheme={{ isOpen: isSwitchThemeOpen, setIsOpen: setIsSwitchThemeOpen }} />
      <PageBorder />
    </>
  );
}
