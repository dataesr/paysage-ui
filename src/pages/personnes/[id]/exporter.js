import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Badge, BadgeGroup, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import CopyBadgeButton from '../../../components/copy/copy-badge-button';

import PersonPresentationPage from './presentation';
import PersonMandats from './mandats';
import AgendaOutlet from '../../../components/blocs/evenements';
import DocumentsOutlet from '../../../components/blocs/documents';
import PersonCategories from './categories';
import PersonPrizes from './prix-et-recompenses';
import PersonsRelatedElements from './elements-lies';
import ActualitesOutlet from '../../../components/blocs/actualites';
import OfficialTextOutlet from '../../../components/blocs/textes-officiels';
import { OverlaySpinner, PageSpinner } from '../../../components/spinner';
import Error from '../../../components/errors';

export default function PersonExportPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = useFetch(`/persons/${id}`);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `paysage_personne_${data && `${data.firstName}-${data.lastName}`.trim()}_${id}.pdf`,
    onAfterPrint: () => navigate(`/personnes/${id}`),
    removeAfterPrint: true,
  });

  setTimeout(() => {
    setLoading(false);
    handlePrint();
  }, 5000);

  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;
  const personName = `${data.firstName} ${data.lastName}`.trim();
  const genreIcon = (data.gender === 'Homme') ? 'ri-men-line' : 'ri-women-line';
  return (
    <div className="print" ref={componentRef}>
      <Container spacing="pb-6w">
        <Row>
          <Col n="12">
            <Title as="h2">
              {personName}
              <BadgeGroup className="fr-pt-1w">
                <Badge text="personne" type="info" />
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
                {data.gender && <Badge type="success" text={data.gender} icon={(data.gender === 'Autre') ? '' : genreIcon} />}
              </BadgeGroup>
            </Title>
            {searchParams.get('oeil') && <PersonPresentationPage />}
            {searchParams.get('actualites') && <ActualitesOutlet />}
            {searchParams.get('mandats') && <PersonMandats />}
            {searchParams.get('evenements') && <AgendaOutlet />}
            {searchParams.get('ressources') && <DocumentsOutlet />}
            {searchParams.get('categories') && <PersonCategories />}
            {searchParams.get('textes') && <OfficialTextOutlet />}
            {searchParams.get('prix') && <PersonPrizes />}
            {searchParams.get('elements') && <PersonsRelatedElements />}
          </Col>
        </Row>
        {loading && (<OverlaySpinner text="Préparation de l'exportation" />)}
      </Container>
    </div>
  );
}
