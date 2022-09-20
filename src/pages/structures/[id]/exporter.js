import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Badge, BadgeGroup, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import CopyBadgeButton from '../../../components/copy/copy-badge-button';

import Categories from '../../../components/blocs/catgories';
import Identifiers from '../../../components/blocs/identifiers';

export default function StructureExportPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useFetch(`/structures/${id}`);
  const componentRef = useRef();

  const [loading, setLoading] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'AwesomeFileName',
    // onAfterPrint: () => navigate(`/structures/${id}`),
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (!isLoading && componentRef && componentRef.current) {
      setTimeout(() => handlePrint(), 1000);
    }
  }, [isLoading, componentRef.current]);

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
            {searchParams.get('categories') && <Categories apiObject="structures" id={id} />}
            {searchParams.get('identifiants') && <Identifiers apiObject="structures" id={id} />}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
