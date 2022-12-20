import { Badge, BadgeGroup, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import { useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import useFetch from '../../../hooks/useFetch';
import CopyBadgeButton from '../../../components/copy/copy-badge-button';
import ProjectPresentationPage from './presentation';
import ProjectPrizes from './prix-et-recompenses';
import AgendaOutlet from '../../../components/blocs/evenements';
import DocumentsOutlet from '../../../components/blocs/documents';
import ProjectCategories from './categories';
import ActualitesOutlet from '../../../components/blocs/actualites';
import OfficialTextOutlet from '../../../components/blocs/textes-officiels';
import { PageSpinner, OverlaySpinner } from '../../../components/spinner';
import Error from '../../../components/errors';

export default function ProjectExportPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = useFetch(`/projects/${id}`);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `paysage_projet_${data?.nameFr}_${id}.pdf`,
    onAfterPrint: () => navigate(`/projets/${id}`),
    removeAfterPrint: true,
  });

  setTimeout(() => {
    setLoading(false);
    handlePrint();
  }, 5000);

  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;
  return (
    <div className="print" ref={componentRef}>
      <Container spacing="pb-6w">
        <Row>
          <Col n="12">
            <Title as="h2">
              {data.nameFr}
              <BadgeGroup className="fr-pt-1w">
                <Badge text="Projet" type="info" />
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
              </BadgeGroup>
            </Title>
            {searchParams.get('oeil') && <ProjectPresentationPage />}
            {searchParams.get('actualites') && <ActualitesOutlet />}
            {searchParams.get('evenements') && <AgendaOutlet />}
            {searchParams.get('ressources') && <DocumentsOutlet />}
            {searchParams.get('categories') && <ProjectCategories />}
            {searchParams.get('prix') && <ProjectPrizes />}
            {searchParams.get('textes') && <OfficialTextOutlet />}
          </Col>
        </Row>
        {loading && (<OverlaySpinner text="Préparation de l'exportation" />)}
      </Container>
    </div>
  );
}
