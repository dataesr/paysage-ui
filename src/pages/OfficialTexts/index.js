import { Button, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

export default function OfficialTextsPage() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useFetch('GET', '/official-texts');
  if (isLoading || !data) return <h1>Loading</h1>;
  if (error) return <h1>Error</h1>;
  return (
    <Container as="main">
      <Row>
        <Col n="10">
          <Title as="h2">Page des textes officiels test</Title>
        </Col>
        <Col>
          <Button onClick={() => navigate('./ajouter')}>
            Ajouter un text officiel
          </Button>
        </Col>
      </Row>
      {data.totalCount}
    </Container>
  );
}
