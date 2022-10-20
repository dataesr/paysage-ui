import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Badge, BadgeGroup, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import CopyBadgeButton from '../../../components/copy/copy-badge-button';

import CategoriesPresentationPage from './presentation';
import AgendaOutlet from '../../../components/outlets/evenements';
import DocumentsOutlet from '../../../components/outlets/documents';
import CategoriesCategories from './categories';
import ActualitesOutlet from '../../../components/outlets/actualites';
import OfficialTextOutlet from '../../../components/outlets/textes-officiels';
import OverlaySpinner from '../../../components/spinner/overlay-spinner';

export default function CategoriesExportPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = useFetch(`/categories/${id}`);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `paysage_categorie_${data?.usualNameFr}_${id}.pdf`,
    onAfterPrint: () => navigate(`/categories/${id}`),
    removeAfterPrint: true,
  });

  setTimeout(() => {
    setLoading(false);
    handlePrint();
  }, 5000);

  if (isLoading) return <>Chargement...</>;
  if (error) return <>Erreur...</>;
  if (!data) return null;
  return (
    <div className="print" ref={componentRef}>
      <Container spacing="pb-6w">
        <Row>
          <Col n="12">
            <Title as="h2">
              {data.usualNameFr}
              <BadgeGroup className="fr-pt-1w">
                <Badge text="categorie" type="info" />
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
              </BadgeGroup>
            </Title>
            {searchParams.get('oeil') && <CategoriesPresentationPage />}
            {searchParams.get('actualites') && <ActualitesOutlet />}
            {searchParams.get('evenements') && <AgendaOutlet />}
            {searchParams.get('ressources') && <DocumentsOutlet />}
            {searchParams.get('categories') && <CategoriesCategories />}
            {searchParams.get('textes') && <OfficialTextOutlet />}
          </Col>
        </Row>
        {loading && (<OverlaySpinner text="Préparation de l'exportation" />)}
      </Container>
    </div>
  );
}
