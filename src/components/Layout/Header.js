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

export default function Header() {
  const { pathname } = useLocation();
  const { viewer } = useAuth();

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
                // icon="ri-user-3-line"
                asLink={<RouterLink to="/profile" />}
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
            <NavItem
              title="Je recherche"
              current={pathname.startsWith('/rechercher')}
            >
              <NavSubItem
                current={pathname.startsWith('/rechercher/personnes')}
                title="Rechercher des personnes"
                asLink={<RouterLink to="/rechercher/personnes" />}
              />
              <NavSubItem
                current={pathname.startsWith('/rechercher/structures')}
                title="Rechercher des structures"
                asLink={<RouterLink to="/rechercher/structures" />}
              />
              <NavSubItem
                current={pathname.startsWith('/rechercher/termes')}
                title="Rechercher des termes"
                asLink={<RouterLink to="/rechercher/termes" />}
              />
              <NavSubItem
                current={pathname.startsWith('/rechercher/categories')}
                title="Rechercher des catégories"
                asLink={<RouterLink to="/rechercher/categories" />}
              />
              <NavSubItem
                current={pathname.startsWith('/rechercher/textes-officiels')}
                title="Rechercher des textes officiels"
                asLink={<RouterLink to="/rechercher/textes-officiels" />}
              />
            </NavItem>
          </>
        )}
        <NavItem title="Ressources" current={pathname.startsWith('/ressources')}>
          <NavSubItem
            current={pathname.startsWith('/ressources/listes-qualifiées')}
            title="Listes qualifiées"
            asLink={<RouterLink to="/listes" />}
          />
          <NavSubItem
            current={pathname.startsWith('/ressources/liens-externes')}
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
    </HeaderWrapper>
  );
}
