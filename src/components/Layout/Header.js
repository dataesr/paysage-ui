import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Header as HeaderWrapper,
  HeaderBody,
  HeaderNav,
  Logo,
  NavItem,
  NavSubItem,
  Service,
  Tool,
  ToolItem,
  ToolItemGroup,
} from '@dataesr/react-dsfr';
import useAuth from '../../hooks/useAuth';

export default function Header({ switchTheme }) {
  const { isOpen, setIsOpen } = switchTheme;
  const { pathname } = useLocation();
  const { viewer, signout } = useAuth();
  const handleSignOut = () => {
    signout();
    window.location.reload(false);
  };
  return (
    <HeaderWrapper>
      <HeaderBody>
        <Logo splitCharacter={10}>
          Ministère le l'enseignement supérieur et de la recherche
        </Logo>
        <Service
          title="Paysage"
          description="Plateforme d'échanges et d'informations de la DGESIP et de la DGRI"
        />
        <Tool closeButtonLabel="fermer">
          <ToolItemGroup>
            {viewer?.id ? (
              <>
                <ToolItem
                  icon="ri-user-3-line"
                  asLink={<RouterLink to="/me" />}
                >
                  {viewer.email}
                </ToolItem>
                <ToolItem
                  icon="ri-logout-circle-r-line"
                  onClick={handleSignOut}
                />
              </>
            ) : (
              <ToolItem
                icon="ri-user-3-line"
                asLink={<RouterLink to="/se-connecter" />}
              >
                Se connecter
              </ToolItem>
            )}
            <ToolItem icon="ri-sun-fill" onClick={() => setIsOpen(true)}>
              <span aria-controls="fr-theme-modal" data-fr-opened={isOpen}>
                Paramètres d’affichage
              </span>
            </ToolItem>
          </ToolItemGroup>
        </Tool>
      </HeaderBody>
      <HeaderNav path={pathname}>
        <NavItem
          title="Accueil"
          asLink={<RouterLink to="/">Accueil</RouterLink>}
          current={pathname === '/'}
        />
        {viewer?.id && (
          <>
            <NavItem
              title="Je contribue"
              current={pathname.startsWith('/contribuer')}
            >
              <NavSubItem
                current={
                  pathname.startsWith('/contribuer')
                  && !pathname.endsWith('/import')
                }
                title="Ajouter un nouvel objet"
                asLink={<RouterLink to="/contribuer" />}
              />
              <NavSubItem
                current={pathname.endsWith('/import')}
                title="Ajouter en masse"
                asLink={<RouterLink to="/contribuer/structure/import" />}
              />
            </NavItem>
            <NavItem title="Annuaire">
              <NavSubItem
                current={pathname.startsWith('/personnes')}
                title="Rechercher une personne"
                asLink={<RouterLink to="/personnes" />}
              />
              <NavSubItem
                title="Listes qualifiées"
                asLink={<RouterLink to="/list" />}
              />
            </NavItem>
            <NavItem title="Répertoire">
              <NavSubItem
                current={pathname.startsWith('/structures')}
                title="Rechercher une structure"
                asLink={<RouterLink to="/structures" />}
              />
              <NavSubItem
                title="Listes qualifiées"
                asLink={<RouterLink to="/list" />}
              />
            </NavItem>
          </>
        )}
        <NavItem
          title="Ressources"
          asLink={<RouterLink to="/ressources" />}
          current={pathname.startsWith('/ressources')}
        />
        <NavItem
          title="Aide"
          asLink={<RouterLink to="/aide" />}
          current={pathname.startsWith('/aide')}
        />
      </HeaderNav>
    </HeaderWrapper>
  );
}

Header.propTypes = {
  switchTheme: PropTypes.shape({
    isOpen: PropTypes.bool,
    setIsOpen: PropTypes.func,
  }).isRequired,
};
