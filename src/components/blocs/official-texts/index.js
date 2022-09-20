import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card, CardDescription, CardTitle, Col, Row, Title } from '@dataesr/react-dsfr';
import PaysageSection from '../../sections/section';
import Button from '../../button';
import EmptySection from '../../sections/empty';
import api from '../../../utils/api';
import { getRoute } from '../../../utils';

export default function OfficialTextsComponent({ id, apiObject }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const response = await api
        .get(`/official-texts?filters[relatesTo]=${id}`)
        .catch((e) => {
          console.log(e);
        });
      if (response.ok) setData(response.data);
    };
    getData();
    return () => {};
  }, [id]);

  if (!data?.data) {
    return (
      <PaysageSection dataPaysageMenu="Textes officiels" id="officialTexts" isEmpty />
    );
  }

  return (
    <PaysageSection dataPaysageMenu="Textes officiels" id="officialTexts">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Textes officiels
          </Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={() => navigate(`/textes-officiels/ajouter/${getRoute(apiObject)}/${id}`)}
            size="sm"
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter un texte officiel
          </Button>
        </Col>
      </Row>
      <Row>
        {data.data.length === 0 ? <EmptySection apiObject={apiObject} /> : null}
        {data.data.map((item) => (
          <Col n="4" key={item.id}>
            <Card
              hasArrow
              href={`/textes-officiels/${item.id}/${getRoute(apiObject)}/${id}`}
            >
              <CardTitle>{item.type}</CardTitle>
              <CardDescription>
                {item.title}
                <p className="mt-2 italic">{`publié le ${item.publicationDate}`}</p>
              </CardDescription>
            </Card>
          </Col>
        ))}
      </Row>
    </PaysageSection>
  );
}

OfficialTextsComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
