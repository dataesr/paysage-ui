import { Breadcrumb, BreadcrumbItem, Col, Container, Link, Row, Title } from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

const DATE_DISPLAY_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const FIELD_DISPLAY_NAMES = {
  changementNicSiegeUniteLegale: 'Changement NIC du siège',
  changementAdresseSiegeUniteLegale: "Changement d'adresse",
  changementCategorieJuridiqueUniteLegale: 'Changement de catégorie juridique',
  changementEtatAdministratifUniteLegale: "Changement d'état administratif",
  changementDenominationUniteLegale: 'Changement de nom',
  changementEtatAdministratifEtablissement: "Changement d'état administratif",
};

function SireneUpdateList() {
  const { data, isLoading } = useFetch('/sirene/updates?filters[status]=pending');

  if (isLoading) return null;

  const updates = data?.data?.filter((structure) => structure.updates.length > 0);

  return (
    <Container fluid>
      <Title as="h1" look="h4">
        Mises à jour Sirene

      </Title>
      {updates?.map((structure) => (
        <div key={structure.id}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexGrow: 1 }}>
              <Link href={`${structure?.paysageData?.href}/updates`} className="fr-link fr-text--md fr-text--bold fr-mb-0">{structure?.paysageData?.displayName}</Link>
            </div>
            <div>
              <p
                className={`fr-badge fr-badge--sm fr-m-0 fr-badge--${(structure.type === 'establishment') ? 'info' : 'success'}`}
              >
                {(structure.type === 'establishment') ? 'établissement' : 'unité légale'}
              </p>
            </div>
          </div>
          <p className="fr-card__detail fr-mb-0">
            {`Dernière modification repérée dans la base sirene le ${new Date(structure.updates.map((u) => u.createdAt).sort().reverse()[0])?.toLocaleDateString('fr', DATE_DISPLAY_OPTIONS)}`}
          </p>
          <p className="fr-text--bold fr-text--sm">{structure.updates.map((update) => FIELD_DISPLAY_NAMES[update.field] ?? update.field).join(', ')}</p>
          <hr />
        </div>
      ))}
    </Container>
  );
}

export default function AdminSireneUpdates() {
  return (
    <Container>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem>Mises à jour Sirene</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <SireneUpdateList />
    </Container>
  );
}
