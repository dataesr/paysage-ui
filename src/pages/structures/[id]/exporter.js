import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Badge, BadgeGroup, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import CopyBadgeButton from '../../../components/copy/copy-badge-button';

import StructurePresentationPage from './presentation';
import StructureGouvernancePage from './gouvernance';
import DocumentsOutlet from '../../../components/outlets/documents';
import AgendaOutlet from '../../../components/outlets/evenements';
import StructureCategoriesPage from './categories';
import StructureBudgetPage from './chiffres-cles/budget';
import StructureEtudiantsPage from './chiffres-cles/etudiants';
import StructureImmobilierPage from './chiffres-cles/immobilier';
import StructureOffreDeFormationPage from './chiffres-cles/offre-de-formation';
import StructureInsertionProfessionnellePage from './chiffres-cles/insertion-professionnelle';
import StructurePrixEtRecompensesPage from './prix-et-recompenses';
import StructureProjectsPage from './projets';
import StructureElementLiesPage from './elements-lies';
import OfficialTextOutlet from '../../../components/outlets/textes-officiels';
import ActualitesOutlet from '../../../components/outlets/actualites';
import { PageSpinner, OverlaySpinner } from '../../../components/spinner';
import Error from '../../../components/errors';

export default function StructureExportPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = useFetch(`/structures/${id}`);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `paysage_structure_${data?.currentName?.usualName}_${id}.pdf`,
    onAfterPrint: () => navigate(`/structures/${id}`),
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
              {data.currentName.usualName}
              <BadgeGroup className="fr-pt-1w">
                <Badge type="info" text="structure" />
                <Badge colorFamily="green-emeraude" text={data.structureStatus || 'active'} />
                <CopyBadgeButton colorFamily="yellow-tournesol" text={data.id} lowercase />
              </BadgeGroup>
            </Title>
            {searchParams.get('oeil') && <StructurePresentationPage />}
            {searchParams.get('actualites') && <ActualitesOutlet />}
            {searchParams.get('gouvernance') && <StructureGouvernancePage />}
            {searchParams.get('event') && <AgendaOutlet />}
            {searchParams.get('resources') && <DocumentsOutlet />}
            {searchParams.get('categories') && <StructureCategoriesPage />}
            {searchParams.get('chiffres') && (
              <>
                <StructureBudgetPage />
                <StructureEtudiantsPage />
                <StructureImmobilierPage />
                <StructureOffreDeFormationPage />
                <StructureInsertionProfessionnellePage />
              </>
            )}
            {searchParams.get('textes') && <OfficialTextOutlet />}
            {searchParams.get('prix') && <StructurePrixEtRecompensesPage />}
            {searchParams.get('projets') && <StructureProjectsPage />}
            {searchParams.get('elements') && <StructureElementLiesPage />}
          </Col>
        </Row>
        {loading && (<OverlaySpinner text="Préparation de l'exportation" />)}
      </Container>
    </div>
  );
}
