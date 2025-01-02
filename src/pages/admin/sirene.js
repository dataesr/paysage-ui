import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';
import { Bloc, BlocContent, BlocTitle } from '../../components/bloc';
import useFetch from '../../hooks/useFetch';

const DATE_DISPLAY_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

function SireneUpdateList() {
  const { data, isLoading, error } = useFetch('/sirene/updates');

  if (isLoading) return null;

  const updates = data?.data?.filter((structure) => structure.updates.length > 0);

  return (
    <Bloc isLoading={isLoading} error={error} data={data} forceActionDisplay>
      <BlocTitle as="h1" look="h4">
        Mises à jour Sirene
      </BlocTitle>
      <BlocContent>
        {updates?.map((structure) => (
          <div key={structure.id}>
            <a rel="noreferrer" target="_blank" href={`${structure?.paysageData?.href}/updates`} className="fr-link fr-text--md fr-text--bold fr-mb-0">{structure?.paysageData?.displayName}</a>
            <p className="fr-card__detail fr-mb-0">
              {`Dernière modification repérée dans la base sirene le ${new Date(structure?.lastModificationDate)?.toLocaleDateString('fr', DATE_DISPLAY_OPTIONS)}`}
            </p>
            {structure.type === 'siren' && <p className="fr-card__detail fr-mb-2w">{`Suivi au niveau unité légale: ${structure?.siren}`}</p>}
            {structure.type === 'siret' && <p className="fr-card__detail fr-mb-2w">{`Suivi au niveau établissement ${structure.siret}`}</p>}
            <p className="fr-text--bold fr-text--sm">{structure.updates.map((update) => update.field).join(', ')}</p>
            <hr />
          </div>
        ))}
      </BlocContent>
    </Bloc>
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
