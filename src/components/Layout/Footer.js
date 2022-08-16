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
      </FooterTop>
      <FooterBody description="Paysage : Plateforme d'échanges et d'informations de la DGESIP et de la DGRI">
        <Logo>
          Ministère de l‘enseignement supérieur et de la recherche
        </Logo>
        <FooterBodyItem>
          <Link href="https://legifrance.gouv.fr">
            legifrance.gouv.fr
          </Link>
        </FooterBodyItem>
        <FooterBodyItem>
          <Link href="https://gouvernement.fr">
            gouvernement.fr
          </Link>
        </FooterBodyItem>
        <FooterBodyItem>
          <Link href="https://service-public.fr">
            service-public.fr
          </Link>
        </FooterBodyItem>
        <FooterBodyItem>
          <Link href="https://data.gouv.fr">data.gouv.fr</Link>
        </FooterBodyItem>
      </FooterBody>
      <FooterBottom>
        <FooterLink href="https://www.enseignementsup-recherche.gouv.fr/">
          enseignementsup-recherche.gouv.fr
        </FooterLink>
        <FooterLink onClick={() => setIsOpen(true)}>
          <span
            className="fr-fi-theme-fill fr-link--icon-left"
            aria-controls="fr-theme-modal"
            data-fr-opened={isOpen}
          >
            Paramètres d’affichage
          </span>
        </FooterLink>
        <FooterCopy to="/">
          © République Française 2022
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
