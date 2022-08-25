import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Breadcrumb, BreadcrumbItem, Col, Container, Icon, Row, Tag, TextInput, Title } from '@dataesr/react-dsfr';
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import api from '../../utils/api';

export default function Nomenclatures({ route, title }) {
  const { data, isLoading, error, reload } = useFetch('GET', `/${route}`);
  const [usualName, setUsualName] = useState('');

  const onSaveHandler = async () => {
    const body = {
      usualName,
    };
    const response = await api.post(`/${route}`, body);

    if (response.ok) {
      reload();
      setUsualName('');
    }
  };

  const onDeleteHandler = async (id) => {
    await api.delete(`/${route}/${id}`);
    reload();
  };

  if (error) return <div>Erreur</div>;
  if (isLoading) return <div>Chargement</div>;
  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Acceuil</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
            <BreadcrumbItem>{title}</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2" look="h3">{title}</Title>
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
              <Button onClick={onSaveHandler} disabled={isLoading || error}>
                <Icon name="ri-save-line" size="lg" />
                Sauvegarder
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Title as="h3">Liste</Title>
              {data.data?.map((item) => (
                <Tag key={item.id} closable onClick={() => onDeleteHandler(item.id)}>
                  {item.usualName}
                </Tag>
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

Nomenclatures.propTypes = {
  route: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
