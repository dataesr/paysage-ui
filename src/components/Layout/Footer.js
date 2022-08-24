import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FooterTop,
  FooterTopCategory,
  Footer as FooterWrapper,
  FooterBody,
  FooterBottom,
  FooterBodyItem,
  FooterCopy,
  FooterLink,
  Link,
  Logo,
  Text,
} from '@dataesr/react-dsfr';

export default function Footer({ switchTheme }) {
  const { isOpen, setIsOpen } = switchTheme;

  return (
    <FooterWrapper>
      <FooterTop>
        <FooterTopCategory title="Liens utiles">
          <FooterLink asLink={<RouterLink to="/help" />}>
            Aide
          </FooterLink>
          <FooterLink asLink={<RouterLink to="/" />}>
            Nous contacter
          </FooterLink>
        </FooterTopCategory>
        <FooterTopCategory title="Liens utiles">
          <FooterLink asLink={<RouterLink to="/help" />}>
            Notes de version
          </FooterLink>
          <FooterLink asLink={<RouterLink to="/" />}>
            Github
          </FooterLink>
        </FooterTopCategory>
      </FooterTop>
      <FooterBody description="Paysage : Plateforme d'échanges et d'informations de la DGESIP et de la DGRI">
        <Logo>
          Ministère de l‘enseignement supérieur et de la recherche
        </Logo>
        <FooterBodyItem>
          <Link target="_blank" href="https://legifrance.gouv.fr">
            legifrance.gouv.fr
          </Link>
        </FooterBodyItem>
        <FooterBodyItem>
          <Link target="_blank" href="https://gouvernement.fr">
            gouvernement.fr
          </Link>
        </FooterBodyItem>
        <FooterBodyItem>
          <Link target="_blank" href="https://service-public.fr">
            service-public.fr
          </Link>
        </FooterBodyItem>
        <FooterBodyItem>
          <Link target="_blank" href="https://data.gouv.fr">data.gouv.fr</Link>
        </FooterBodyItem>
      </FooterBody>
      <FooterBottom>
        <FooterLink href="#">
          Pan du Site
        </FooterLink>
        <FooterLink href="#">
          Accessibilité
        </FooterLink>
        <FooterLink href="#">
          Mentions légales
        </FooterLink>
        <FooterLink onClick={() => setIsOpen(true)}>
          <button
            type="button"
            className="fr-fi-theme-fill fr-link--icon-left"
            aria-controls="fr-theme-modal"
            data-fr-opened={isOpen}
          >
            Paramètres d’affichage
          </button>
        </FooterLink>
        <FooterCopy to="/">
          <Text size="sm">
            Sauf mention contraire, tous les contenus de ce site sont sous
            <Link target="_blank" href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"> licence étalab2.0</Link>
          </Text>
        </FooterCopy>
      </FooterBottom>
    </FooterWrapper>
  );
}

Footer.propTypes = {
  switchTheme: PropTypes.shape({
    isOpen: PropTypes.bool,
    setIsOpen: PropTypes.func,
  }).isRequired,
};
