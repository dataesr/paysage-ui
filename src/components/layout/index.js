import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, SwitchTheme } from '@dataesr/react-dsfr';
import Header from './header';
import Footer from './footer';
import PageBorder from './page-border';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header switchTheme={{ isOpen, setIsOpen }} />
      <SwitchTheme isOpen={isOpen} setIsOpen={setIsOpen} />
      <Container as="main" role="main" fluid>
        <Outlet />
      </Container>
      <Footer switchTheme={{ isOpen, setIsOpen }} />
      <PageBorder />
    </>
  );
}
