import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';

export default function MentionsLegales() {
  return (
    <Container className="fr-my-5w">
      <Row>
        <Col n="12">
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>
              Accueil
            </BreadcrumbItem>
            <BreadcrumbItem>Mentions légales</BreadcrumbItem>
          </Breadcrumb>
        </Col>
        <Col n="12 md-8">
          <Title as="h1">Mentions légales</Title>
          <Title as="h2" look="h6">Editeur</Title>
          <Text>
            Sous-direction des systèmes d’information et des études statistiques (SIES),
            Direction générale de l’enseignement supérieur et de l’insertion
            professionnelle/Direction générale de la recherche et de l’innovation.
          </Text>
          <Title as="h2" look="h6">Directrice de la publication</Title>
          <Text>
            Mme Anne-Sophie BARTHEZ, Directrice générale de l’enseignement supérieur et de l’insertion professionnelle (DGESIP)
          </Text>
          <Title as="h2" look="h6">Prestataire d’hébergement</Title>
          <Text>
            OVH
          </Text>
          <Text>
            RCS Roubaix – Tourcoing 424 761 419 00045
          </Text>
          <Text>
            Code APE 6202A
          </Text>
          <Text>
            N° TVA : FR 22 424 761 419
          </Text>
          <Text>
            Siège social : 2 rue Kellermann - 59100 Roubaix - France.
          </Text>
        </Col>
      </Row>
    </Container>
  );
}
