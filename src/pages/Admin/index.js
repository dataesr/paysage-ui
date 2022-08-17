import { Button, Col, Container, Icon, Row, TextInput, Title } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import fetch from '../../utils/fetch';

export default function DocumentTypesPage() {
  const { route } = useParams();

  const [data, setData] = useState([]);
  const [usualName, setUsualName] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch.get(`/${route}`);
      setData(response?.data?.data || []);
    };
    getData();
  }, [reload, route]);

  const onSaveHandler = async () => {
    const body = {
      usualName,
    };
    const response = await fetch.post(`/${route}`, body);

    if (response.ok) {
      setReload(reload + 1);
    }
  };

  const onDeleteHandler = async (id) => {
    const response = await fetch.delete(`/${route}/${id}`);
    setReload(reload + 1);
  };

  return (
    <Container>
      <Title as="h2">{route}</Title>
      <Row
        gutters
        spacing="px-2w"
        alignItems="bottom"
        className="fr-pt-1w fr-pb-2w"
      >
        <Col n="10">
          <TextInput
            label="Ajout"
            value={usualName}
            onChange={(e) => setUsualName(e.target.value)}
          />
        </Col>
        <Col>
          <Button onClick={onSaveHandler}>
            <Icon name="ri-save-line" size="lg" />
            Sauvegarder
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h3">Liste</Title>
          {data?.map((item) => (
            <div key={item.id}>
              {item.usualName}
              <Button
                onClick={() => onDeleteHandler(item.id)}
                size="sm"
                className="bt-delete"
              >
                X
              </Button>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}
