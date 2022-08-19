import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, SwitchTheme } from '@dataesr/react-dsfr';
import Header from './Header';
import Footer from './Footer';
import PageBorder from './PageBorder';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header switchTheme={{ isOpen, setIsOpen }} />
      <SwitchTheme isOpen={isOpen} setIsOpen={setIsOpen} />
      <Container as="main" fluid className="fr-px-2w">
        <Outlet />
      </Container>
      <Footer switchTheme={{ isOpen, setIsOpen }} />
      <PageBorder />
    </>
  );
}
