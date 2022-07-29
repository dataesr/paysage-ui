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
          {'Ministère le l\'enseignement supérieur et de la recherche'}
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
              <span
                aria-controls="fr-theme-modal"
                data-fr-opened={isOpen}
              >
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
              current={pathname.startsWith('/contrib')}
            >
              <NavSubItem
                current={
                  pathname.startsWith('/contrib')
                  && !pathname.endsWith('/import')
                }
                title="Ajouter un nouvel objet"
                asLink={<RouterLink to="/contrib" />}
              />
              <NavSubItem
                current={pathname.endsWith('/import')}
                title="Ajouter en masse"
                asLink={
                  <RouterLink to="/contrib/structure/import" />
                }
              />
            </NavItem>
            <NavItem title="Annuaire">
              <NavSubItem
                current={pathname.startsWith('/search/1')}
                title="Rechercher une personne"
                asLink={<RouterLink to="/search/1" />}
              />
              <NavSubItem
                title="Listes qualifiées"
                asLink={<RouterLink to="/list" />}
              />
            </NavItem>
            <NavItem title="Répertoire">
              <NavSubItem
                current={pathname.startsWith('/search')}
                title="Rechercher une structure"
                asLink={<RouterLink to="/search/0" />}
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
          asLink={<RouterLink to="/resources" />}
          current={pathname.startsWith('/resources')}
        />
        <NavItem
          title="Aide"
          asLink={<RouterLink to="/help" />}
          current={pathname.startsWith('/help')}
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
