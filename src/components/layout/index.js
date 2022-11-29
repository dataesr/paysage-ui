import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, SwitchTheme } from '@dataesr/react-dsfr';
import Header from './header';
import Footer from './footer';
import PageBorder from './page-border';
import useAuth from '../../hooks/useAuth';
import { Spinner } from '../spinner';
import ScrollToTop from '../scroll-to-top';

import './layout.scss';

export default function Layout() {
  const [isSwitchThemeOpen, setIsSwitchThemeOpen] = useState(false);
  const { isLoading } = useAuth();
  return (
    <>
      <Header />
      <SwitchTheme isOpen={isSwitchThemeOpen} setIsOpen={setIsSwitchThemeOpen} />
      <div role="alert" id="notice-container" />
      <Container as="main" role="main" fluid>
        {
          isLoading
            ? <Row className="fr-my-2w flex--space-around"><Spinner /></Row>
            : <Outlet />
        }
      </Container>
      <ScrollToTop />
      <Footer switchTheme={{ isOpen: isSwitchThemeOpen, setIsOpen: setIsSwitchThemeOpen }} />
      <PageBorder />
    </>
  );
}
