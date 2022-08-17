import { Button, Col, Container, Icon, Row, TextInput, Title } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
// import useFetch from '../../hooks/useFetch';
import fetch from '../../utils/fetch';

export default function DocumentTypesPage() {
  // const { data, error, isLoading } = useFetch('GET', '/document-types');

  const [data, setData] = useState([]);
  const [usualName, setUsualName] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch.get('/document-types');
      setData(response?.data?.data || []);
    };
    getData();
  }, [reload]);

  const onSaveHandler = async () => {
    const body = {
      usualName,
    };
    const response = await fetch.post('/document-types', body);

    if (response.ok) {
      setReload(reload + 1);
    }
  };

  if (!data || data.length === 0) return (<>...</>);
  return (
    <Container>
      <Row>
        <Col>
          <Title as="h3">Ajout d'un type de document</Title>
          <form>
            <TextInput
              label="Valeur"
              value={usualName}
              onChange={(e) => setUsualName(e.target.value)}
            />
            <Button onClick={onSaveHandler}>
              <Icon name="ri-save-line" size="lg" />
              Sauvegarder
            </Button>
          </form>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h3">Liste des type de document existants</Title>
          {data.map((docType) => (
            <div key={docType.id}>{docType.usualName}</div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}
