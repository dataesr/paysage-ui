import { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Col, Container, Link, Row, Select, Title } from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { PageSpinner } from '../../components/spinner';

const DATE_DISPLAY_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const IDENTIFIER_DISPLAY_NAMES = {
  isni: 'ISNI',
  bnf: 'BNF',
  grid: 'GRID',
  ror: 'ROR',
  wikidata: 'Wikidata',
  idref: 'IdRef',
};

const SOURCE_DISPLAY_NAMES = {
  wikidata: 'Wikidata',
  idref: 'IdRef',
  sirene: 'Sirene',
};

function getCurrentIdentifier(paysageData, type) {
  const currentIdentifiers = Array.isArray(paysageData?.currentIdentifiers) ? paysageData.currentIdentifiers : [];
  return currentIdentifiers.find((identifier) => identifier.type === type);
}

const normalizeValue = (value) => (value || '').replace(/\s+/g, '').toLowerCase();

function IdentifiersUpdateList() {
  const [identifierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const { data, isLoading } = useFetch('/structures-identifier/updates?filters[status]=pending');
  if (isLoading) return <Row className="fr-my-2w flex--space-around"><PageSpinner /></Row>;

  const allStructuresRaw = data?.data?.filter((structure) => structure?.suggestions?.length > 0) ?? [];

  const allStructures = allStructuresRaw
    .map((structure) => ({
      ...structure,
      suggestions: structure.suggestions.filter((suggestion) => {
        const currentIdentifier = getCurrentIdentifier(structure?.paysageData, suggestion.type);
        const isSameValue = currentIdentifier && normalizeValue(currentIdentifier.value) === normalizeValue(suggestion.value);
        return !isSameValue;
      }),
    }))
    .filter((structure) => structure.suggestions.length > 0);

  const statusOptions = [...new Set(
    allStructures
      .map((s) => s?.paysageData?.structureStatus)
      .filter(Boolean),
  )].sort();

  const sectorOptions = [...new Set(
    allStructures
      .map((s) => s?.paysageData?.legalcategory?.legalPersonality)
      .filter(Boolean),
  )].sort();

  const countryOptions = [...new Set(
    allStructures
      .map((s) => s?.paysageData?.currentLocalisation?.country)
      .filter(Boolean),
  )].sort();

  const structures = allStructures
    .filter((structure) => !identifierFilter || structure.suggestions.some((suggestion) => suggestion.type === identifierFilter))
    .filter((structure) => !statusFilter || structure?.paysageData?.structureStatus === statusFilter)
    .filter((structure) => !sectorFilter || structure?.paysageData?.legalcategory?.legalPersonality === sectorFilter)
    .filter((structure) => !countryFilter || structure?.paysageData?.currentLocalisation?.country === countryFilter);

  return (
    <Container fluid>
      <Title as="h1" look="h4">
        Mises à jour des identifiants
      </Title>
      <hr />
      <Row gutters>
        <Col n="4">
          <Select
            label="Statut"
            options={[
              { value: '', label: 'Tous les statuts' },
              ...statusOptions.map((value) => ({ value, label: value })),
            ]}
            selected={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </Col>
        <Col n="4">
          <Select
            label="Secteur"
            options={[
              { value: '', label: 'Tous les secteurs' },
              ...sectorOptions.map((value) => ({ value, label: value })),
            ]}
            selected={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          />
        </Col>
        <Col n="4">
          <Select
            label="Pays"
            options={[
              { value: '', label: 'Tous les pays' },
              ...countryOptions.map((value) => ({ value, label: value })),
            ]}
            selected={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          />
        </Col>
      </Row>
      <p className="fr-text--sm fr-mb-0">
        {`${structures.length} structure(s) affichée(s) sur ${allStructures.length}`}
      </p>
      <hr />
      {structures?.map((structure) => (
        <div key={structure.id}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexGrow: 1 }}>
              <Link href={`${structure?.paysageData?.href}/updates`} className="fr-link fr-text--md fr-text--bold fr-mb-0">
                {structure?.paysageData?.displayName}
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'right' }}>
              {structure?.paysageData?.currentLocalisation?.country && (
                <p className="fr-badge fr-badge--sm fr-m-0 fr-mr-1w fr-badge--purple-glycine">
                  {structure.paysageData.currentLocalisation.country}
                </p>
              )}
              {structure?.paysageData?.structureStatus === 'active' && (
                <p className="fr-badge fr-badge--sm fr-m-0 fr-mr-1w fr-badge--success">
                  {structure.paysageData.structureStatus}
                </p>
              )}
              {structure?.paysageData?.structureStatus === 'inactive' && (
                <p className="fr-badge fr-badge--sm fr-m-0 fr-mr-1w fr-badge--error">
                  {structure.paysageData.structureStatus}
                </p>
              )}
              <br />
              {structure?.paysageData?.legalcategory?.legalPersonality && (
                <p className="fr-badge fr-badge--sm fr-m-0 fr-badge--info">
                  {structure?.paysageData?.legalcategory?.legalPersonality ?? ''}
                </p>
              )}
            </div>
          </div>
          <p className="fr-card__detail fr-mb-0">
            {`Dernière modification repérée le ${new Date(structure.lastModificationDate)?.toLocaleDateString('fr', DATE_DISPLAY_OPTIONS)}`}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {structure.suggestions.map((suggestion, index) => {
              const currentIdentifier = getCurrentIdentifier(structure?.paysageData, suggestion.type);
              const isValueChange = !!currentIdentifier && normalizeValue(currentIdentifier.value) !== normalizeValue(suggestion.value);

              return (
                <p
                  key={`${structure.id}-${index}`}
                  className={`fr-badge fr-badge--sm fr-m-0 ${isValueChange ? 'fr-badge--warning' : 'fr-badge--success'}`}
                  title={isValueChange ? `Une valeur existe déjà pour ce type d'identifiant : ${currentIdentifier.value}` : undefined}
                >
                  {`${IDENTIFIER_DISPLAY_NAMES[suggestion.type] ?? suggestion.type} : ${suggestion.value} (${SOURCE_DISPLAY_NAMES[suggestion.sourceType] ?? suggestion.sourceType})`}
                  {isValueChange && ' ⚠️'}
                </p>
              );
            })}
          </div>
          <hr />
        </div>
      ))}
    </Container>
  );
}

export default function AdminIdentifiersUpdates() {
  return (
    <Container>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem>Mises à jour des identifiants</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <IdentifiersUpdateList />
    </Container>
  );
}
