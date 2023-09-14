import { useCallback } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, ButtonGroup, Col, Container, Row, SearchableSelect, Table, Text, Title } from '@dataesr/react-dsfr';
import usePageTitle from '../../hooks/usePageTitle';
import useFetch from '../../hooks/useFetch';
import Button from '../../components/button';

const addSelectDefaultOption = (options) => [{ label: 'Séléctionner', value: '' }, ...options];

const columns = [
  { name: 'person', label: 'Personne', sortable: true, render: ({ personId, person }) => <a href={`/personnes/${personId}`}>{person}</a> },
  { name: 'relationType', label: 'Type de mandat', sortable: true },
  { name: 'structure', label: 'Etablissement', sortable: true, render: ({ structureId, structureName }) => <a href={`/structures/${structureId}`}>{structureName}</a> },
  { name: 'email', label: 'Email', render: ({ mandateEmail, personalEmail }) => mandateEmail || personalEmail },
];

export default function Annuaire() {
  usePageTitle('Annuaire · Recherche de contacts');
  const [searchParams, setSearchParams] = useSearchParams();

  const { data } = useFetch(`/annuaire?${searchParams.toString()}`);
  const relationTypesOptions = addSelectDefaultOption((data?.relationTypes?.map((element) => ({ label: element, value: element }))) || []);
  const categoriesOptions = addSelectDefaultOption((data?.categories?.map((element) => ({ label: element, value: element }))) || []);
  const mandateTypeGroupOptions = addSelectDefaultOption((data?.mandateTypeGroups?.map((element) => ({ label: element, value: element }))) || []);
  const structuresOptions = addSelectDefaultOption((data?.structures?.map((element) => ({ label: element, value: element }))) || []);

  const handleSearch = useCallback((key, value) => {
    searchParams.delete('limit');
    if (value && searchParams.get(key) !== value) {
      searchParams.set(key, value);
      setSearchParams(searchParams);
    }
    if (!value && searchParams.get(key)) {
      searchParams.delete(key);
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container spacing="mb-6w">
      <Row alignItems="center">
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>
              Accueil
            </BreadcrumbItem>
            <BreadcrumbItem>
              Annuaire
            </BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2">Annuaire</Title>
        </Col>
      </Row>
      <Row>
        <Text bold size="lead">Recherche de contacts</Text>
      </Row>
      <Row gutters alignItems="bottom">
        <Col n="12 md-6">
          <SearchableSelect
            label="Type de relation"
            options={relationTypesOptions}
            selected={searchParams.get('relationType') || ''}
            onChange={(v) => handleSearch('relationType', v)}
            tabIndex={0}
          />
        </Col>
        <Col n="12 md-6">
          <SearchableSelect
            label="Groupe de fonction"
            options={mandateTypeGroupOptions}
            selected={searchParams.get('mandateTypeGroup') || ''}
            onChange={(v) => handleSearch('mandateTypeGroup', v)}
            tabIndex={0}
          />
        </Col>
        <Col n="12 md-6">
          <SearchableSelect
            label="Catégorie de l'établissement"
            options={categoriesOptions}
            selected={searchParams.get('category') || ''}
            onChange={(v) => handleSearch('category', v)}
            tabIndex={0}
          />
        </Col>
        <Col n="12 md-6">
          <SearchableSelect
            label="Etablissement"
            options={structuresOptions}
            selected={searchParams.get('structure') || ''}
            onChange={(v) => handleSearch('structure', v)}
            tabIndex={0}
          />
        </Col>
        <Col>
          <ButtonGroup>
            <Button
              className="fr-mb-0"
              onClick={() => {
                searchParams.set('limit', '1000');
                setSearchParams(searchParams);
              }}
            >
              Générer
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        <Text bold size="lead">Listes de contacts prédéfinies</Text>
      </Row>
      <Row>
        <Table
          fixedLayout
          rowKey={(x) => x.id}
          data={data?.data || []}
          columns={columns}
          pagination
          paginationPosition="center"
          perPage={10}
        />
      </Row>
    </Container>
  );
}
