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

export default function StructureExportPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = useFetch(`/structures/${id}`);
  const componentRef = useRef();

  // const [loading, setLoading] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'AwesomeFileName',
    onAfterPrint: () => navigate(`/structures/${id}`),
    removeAfterPrint: true,
  });

  setTimeout(() => {
    setLoading(false);
    handlePrint();
  }, 3000);

  if (isLoading) return <>Chargement...</>;
  if (error) return <>Erreur...</>;
  return (
    <div className="print" ref={componentRef}>
      <Container spacing="pb-6w">
        <Row>
          <Col n="12">
            <Title as="h2">
              {data.currentName.usualName}
              <BadgeGroup>
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
                <Badge
                  colorFamily="green-emeraude"
                  text={data.active || 'active'}
                />
              </BadgeGroup>
            </Title>
            {searchParams.get('oeil') && <StructurePresentationPage />}
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
            {searchParams.get('prix') && <StructurePrixEtRecompensesPage />}
            {searchParams.get('projets') && <StructureProjectsPage />}
            {searchParams.get('elements') && <StructureElementLiesPage />}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
