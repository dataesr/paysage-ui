import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  SwitchTheme,
  Col,
  Container,
  Row,
} from '@dataesr/react-dsfr';
import useViewport from '../../hooks/useViewport';
import Header from './Header';
import Footer from './Footer';
import PageBorder from './PageBorder';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const { mobile } = useViewport();
  return (
    <>
      <PageBorder />
      <Header switchTheme={{ isOpen, setIsOpen }} />
      <SwitchTheme isOpen={isOpen} setIsOpen={setIsOpen} />
      <Container fluid={!mobile} spacing="mb-10w">
        <Row>
          <Col>
            <Outlet />
          </Col>
        </Row>
      </Container>
      <Footer switchTheme={{ isOpen, setIsOpen }} />
    </>
  );
}
