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
      <FooterBody description="Paysage : Plateforme d'échanges et d'informations de la DGESIP et de la DGRI">
        <Logo
          asLink={<Link href="https://www.enseignementsup-recherche.gouv.fr/fr" target="_blank" rel="noreferrer" />}
          splitCharacter={9}
        >
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
        <FooterLink asLink={<RouterLink to="/aide" />}>
          Aide
        </FooterLink>
        <FooterLink asLink={<RouterLink to="/projet-et-equipe" />}>
          L'équipe et son projet
        </FooterLink>
        <FooterLink asLink={<RouterLink to="/nous-contacter" />}>
          Nous contacter
        </FooterLink>
        <FooterLink href="#">
          Mentions légales
        </FooterLink>
        <FooterLink asLink={<Link href="https://github.com/orgs/dataesr/repositories?q=paysage&type=&language=&sort=" target="_blank" />}>
          Github
        </FooterLink>
        <FooterLink target="_blank" href={`https://github.com/dataesr/paysage-ui/releases/tag/v${process.env.REACT_APP_VERSION}`}>
          {`Version de l'application v${process.env.REACT_APP_VERSION}`}
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
