import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
import Search from './search';

export default function Header() {
  const { pathname } = useLocation();
  const { viewer, signout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  useEffect(() => {
    const callback = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.code === 'KeyK') {
        console.log('EVENT');
        event.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
    };
    document.addEventListener('keydown', callback);
    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [isSearchOpen, setIsSearchOpen]);
  return (
    <HeaderWrapper>
      <HeaderBody>
        <Logo splitCharacter={10}>
          Ministère le l'enseignement supérieur et de la recherche
        </Logo>
        <Service
          title={(
            <>
              Paysage
              <span className="fr-badge fr-badge--sm fr-badge--green-emeraude">STAGING</span>
            </>
          )}
          description="Plateforme d'échanges et d'informations de la DGESIP et de la DGRI"
        />
        <Tool closeButtonLabel="fermer">
          <ToolItemGroup>
            {viewer?.id ? (
              <ToolItem
                icon="ri-user-3-line"
                asLink={<RouterLink to="/mon-compte" />}
              >
                {viewer.firstName}
                {' '}
                {viewer.lastName}
              </ToolItem>
            ) : (
              <ToolItem
                icon="ri-user-3-line"
                asLink={<RouterLink to="/se-connecter" />}
              >
                Se connecter
              </ToolItem>
            )}
            {viewer.id && (
              <ToolItem
                icon="ri-logout-circle-r-line"
                onClick={() => signout()}
              >
                Déconnexion
              </ToolItem>
            )}
            {viewer.id && (
              <ToolItem
                icon="ri-search-line"
                onClick={() => setIsSearchOpen(true)}
              />
            )}
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
            </NavItem>
            <NavItem
              title="Je recherche"
              current={pathname.startsWith('/rechercher')}
            >
              <NavSubItem
                current={pathname.startsWith('/personnes')}
                title="Rechercher des personnes"
                asLink={<RouterLink to="/personnes" />}
              />
              <NavSubItem
                current={pathname.startsWith('/structures')}
                title="Rechercher des structures"
                asLink={<RouterLink to="/structures" />}
              />
              <NavSubItem
                current={pathname.startsWith('/termes')}
                title="Rechercher des termes"
                asLink={<RouterLink to="/termes" />}
              />
              <NavSubItem
                current={pathname.startsWith('/categories')}
                title="Rechercher des catégories"
                asLink={<RouterLink to="/categories" />}
              />
              <NavSubItem
                current={pathname.startsWith('/textes-officiels')}
                title="Rechercher des textes officiels"
                asLink={<RouterLink to="/textes-officiels" />}
              />
            </NavItem>
          </>
        )}
        <NavItem title="Ressources" current={pathname.startsWith('/ressources')}>
          <NavSubItem
            current={pathname.startsWith('/ressources-externes')}
            title="Les ressources externes"
            asLink={<RouterLink to="/ressources-externes" />}
          />
        </NavItem>
        {(viewer?.id && (['admin', 'user'].includes(viewer?.role))) && (
          <NavItem
            title="Administration"
            current={pathname.startsWith('/admin')}
            asLink={<RouterLink to="/admin" />}
          />
        )}
        <NavItem
          title="Aide"
          asLink={<RouterLink to="/aide" />}
          current={pathname.startsWith('/aide')}
        />
      </HeaderNav>
      <Search isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
    </HeaderWrapper>
  );
}
