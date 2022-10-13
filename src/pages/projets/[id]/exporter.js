import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Badge, BadgeGroup, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import CopyBadgeButton from '../../../components/copy/copy-badge-button';

import StructurePresentationPage from './presentation';

export default function StructureExportPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useFetch(`/structures/${id}`);
  const componentRef = useRef();

  // const [loading, setLoading] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'AwesomeFileName',
    onAfterPrint: () => navigate(`/structures/${id}`),
    removeAfterPrint: true,
  });

  setTimeout(() => handlePrint(), 1000);

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
          </Col>
        </Row>
      </Container>
    </div>
  );
}
