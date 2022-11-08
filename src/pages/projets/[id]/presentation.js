import { Col, Icon, Row, Title } from '@dataesr/react-dsfr';
import { useParams } from 'react-router-dom';

import Identifiers from '../../../components/blocs/identifiers';
import Localisations from '../../../components/blocs/localisations';
import RelationsByTag from '../../../components/blocs/relations-by-tag';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import Wiki from '../../../components/blocs/wiki';
import KeyValueCard from '../../../components/card/key-value-card';
import Spinner from '../../../components/spinner';
import useFetch from '../../../hooks/useFetch';
import useHashScroll from '../../../hooks/useHashScroll';
import { dateOptions } from '../../../utils/dates';
import { PROJET_CONTACT, PROJET_PARTICIPATION } from '../../../utils/relations-tags';

export default function ProjectPresentationPage() {
  useHashScroll();
  const { id } = useParams();
  const { data, isLoading, error } = useFetch(`/projects/${id}`);

  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <>Erreur...</>;
  return (
    <>
      <Row>
        <Title as="h2" look="h3">
          En un coup d’œil
          <Icon className="ri-eye-2-line fr-ml-1w" />
        </Title>
      </Row>
      <Row gutters spacing="mb-5w">
        <Col n="12 md-6">
          <Row gutters>
            <Col n="12">
              <KeyValueCard
                className="card-projects"
                cardKey="Date de début"
                cardValue={data?.startDate && new Date(data.startDate).toLocaleDateString('fr-FR', dateOptions)}
                icon="ri-calendar-line"
              />
            </Col>
            <Col n="12">
              <KeyValueCard
                className="card-projects"
                cardKey="Date de fin"
                cardValue={data?.endDate && new Date(data.endDate).toLocaleDateString('fr-FR', dateOptions)}
                icon="ri-calendar-line"
              />
            </Col>
            <Col n="12">
              <KeyValueCard
                titleAsText
                className="card-projects"
                cardKey="Description"
                cardValue={data?.descriptionFr || data?.descriptionEn}
                icon="ri-align-left"
              />
            </Col>
            <Col n="12">
              <KeyValueCard
                className="card-projects"
                cardKey="Montant du financement"
                cardValue={data?.funding && `${data.funding.toLocaleString('fr-FR') }€`}
                icon="ri-bank-line"
              />
            </Col>
          </Row>
        </Col>
        <Col n="12 md-6">
          <Localisations />
        </Col>
      </Row>
      <RelationsByTag
        tag={PROJET_PARTICIPATION}
        blocName="Participations"
        resourceType="projects"
        relatedObjectTypes={['structures', 'persons']}
      />
      <RelationsByTag
        tag={PROJET_CONTACT}
        blocName="Contact"
        resourceType="projects"
        relatedObjectTypes={['persons']}
        noRelationType
      />
      <Title as="h3" look="h4">
        Présence sur le web
      </Title>
      <Row gutters spacing="mb-5w">
        <Col n="12 md-6">
          <Weblinks />
        </Col>
        <Col n="12 md-6">
          <SocialMedias />
        </Col>
        <Col n="12">
          <Wiki />
        </Col>
      </Row>
      <Identifiers />
    </>
  );
}
