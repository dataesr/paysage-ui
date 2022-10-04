import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
import useDebounce from '../../hooks/useDebounce';
import SearchBar from '../search-bar';
import api from '../../utils/api';

export default function Header() {
  const { pathname } = useLocation();
  const { viewer, signout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query');

  const [query, setQuery] = useState(initialQuery || '');
  const debouncedQuery = useDebounce(query, 500);
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/autocomplete?query=${debouncedQuery}&limit=10`);
      setOptions(response.data?.data);
    };
    if (debouncedQuery) { getAutocompleteResult(); } else { setOptions([]); }
  }, [debouncedQuery]);

  useEffect(() => {
    if (!pathname.startsWith('/rechercher')) { setQuery(''); }
  }, [pathname]);

  const handleSearchRedirection = ({ id, type }) => {
    navigate(`/${type}/${id}`);
    setQuery('');
    setOptions([]);
  };
  const handleSearch = () => {
    if (pathname.startsWith('/rechercher')) {
      setSearchParams({ query });
    } else {
      navigate(`/rechercher/structures?query=${query}`);
    }
    setOptions([]);
  };

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
        <Tool closeButtonLabel="fermer" className="extend">
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
                onClick={() => { signout(); navigate('/'); }}
              >
                Déconnexion
              </ToolItem>
            )}
          </ToolItemGroup>
          {viewer.id && (
            <SearchBar
              size="md"
              buttonLabel="Rechercher"
              hideLabel
              value={query}
              label="Rechercher dans paysage"
              placeholder="Rechercher..."
              onChange={(e) => setQuery(e.target.value)}
              options={options}
              onSearch={handleSearch}
              onSelect={handleSearchRedirection}
            />
          )}
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
              asLink={<RouterLink to="/contribuer" />}
              current={pathname.startsWith('/contribuer')}
            />
            <NavItem
              title="Je recherche"
              asLink={<RouterLink to="/rechercher?query=" />}
              current={pathname.startsWith('/rechercher')}
            />
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
    </HeaderWrapper>
  );
}
