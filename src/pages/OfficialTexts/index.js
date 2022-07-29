import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Col, Container, Row, Title } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';

export default function OfficialTextsPage() {
  const navigate = useNavigate();
  const [dataAPI, setDataAPI] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get('/official-texts');
      setDataAPI(response.data);
    };
    getData();
  }, []);

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
      {dataAPI.totalCount}
    </Container>
  );
}
