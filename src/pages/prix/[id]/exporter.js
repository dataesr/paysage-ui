import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Badge, BadgeGroup, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import CopyBadgeButton from '../../../components/copy/copy-badge-button';

import PrixPresentationPage from './presentation';
import AgendaOutlet from '../../../components/blocs/evenements';
import DocumentsOutlet from '../../../components/blocs/documents';
import PrixCategories from './categories';
import ActualitesOutlet from '../../../components/blocs/actualites';
import OfficialTextOutlet from '../../../components/blocs/textes-officiels';
import { OverlaySpinner, PageSpinner } from '../../../components/spinner';
import Error from '../../../components/errors';

export default function PriceExportPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = useFetch(`/prices/${id}`);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `paysage_prix_${data?.nameFr}_${id}.pdf`,
    onAfterPrint: () => navigate(`/prix/${id}`),
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
                <Badge text="prix" type="info" />
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
              </BadgeGroup>
            </Title>
            {searchParams.get('oeil') && <PrixPresentationPage />}
            {searchParams.get('actualites') && <ActualitesOutlet />}
            {searchParams.get('evenements') && <AgendaOutlet />}
            {searchParams.get('ressources') && <DocumentsOutlet />}
            {searchParams.get('categories') && <PrixCategories />}
            {searchParams.get('textes') && <OfficialTextOutlet />}
          </Col>
        </Row>
        {loading && (<OverlaySpinner text="Préparation de l'exportation" />)}
      </Container>
    </div>
  );
}
