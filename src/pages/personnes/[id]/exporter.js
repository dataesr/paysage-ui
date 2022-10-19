import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Badge, BadgeGroup, Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import CopyBadgeButton from '../../../components/copy/copy-badge-button';

import PersonPresentationPage from './presentation';
import PersonMandats from './mandats';
import AgendaOutlet from '../../../components/outlets/evenements';
import DocumentsOutlet from '../../../components/outlets/documents';
import PersonCategories from './categories';
import PersonPrices from './prix-et-recompenses';
import PersonsRelatedElements from './elements-lies';
import ActualitesOutlet from '../../../components/outlets/actualites';
import OfficialTextOutlet from '../../../components/outlets/textes-officiels';
import Spinner from '../../../components/spinner';

export default function PersonExportPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = useFetch(`/persons/${id}`);
  const componentRef = useRef();

  // const [loading, setLoading] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `paysage_personne_${data && `${data.firstName} ${data.lastName}`.trim()}_${id}.pdf`,
    onAfterPrint: () => navigate(`/personnes/${id}`),
    removeAfterPrint: true,
  });

  setTimeout(() => {
    setLoading(false);
    handlePrint();
  }, 5000);

  if (isLoading) return <>Chargement...</>;
  if (error) return <>Erreur...</>;
  if (!data) return null;
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
            <div className="pagebreak" />
            {searchParams.get('actualites') && <ActualitesOutlet />}
            <div className="pagebreak" />
            {searchParams.get('mandats') && <PersonMandats />}
            <div className="pagebreak" />
            {searchParams.get('evenements') && <AgendaOutlet />}
            <div className="pagebreak" />
            {searchParams.get('ressources') && <DocumentsOutlet />}
            <div className="pagebreak" />
            {searchParams.get('categories') && <PersonCategories />}
            <div className="pagebreak" />
            {searchParams.get('textes') && <OfficialTextOutlet />}
            <div className="pagebreak" />
            {searchParams.get('prix') && <PersonPrices />}
            <div className="pagebreak" />
            {searchParams.get('elements') && <PersonsRelatedElements />}
          </Col>
        </Row>
        {loading && (
          <Row alignItems="center" justifyContent="middle" className="overlay">
            <Spinner />
            <Text size="lead" bold>Préparation de l'exportation</Text>
          </Row>
        )}
      </Container>
    </div>
  );
}
