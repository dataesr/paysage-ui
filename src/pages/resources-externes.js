import { Badge, BadgeGroup, Card, CardDetail, CardDescription, CardImage, CardTitle, Col, Container, Row, Title, CardHeader } from '@dataesr/react-dsfr';

export default function RessourcesPage() {
  return (
    <Container spacing="mt-5w">
      <Title as="h2">Les ressources externes</Title>
      <Row>
        <Col n="12 sm-6 md-4" spacing="p-3w">
          <Card href="https://curiexplore.enseignementsup-recherche.gouv.fr" hasBorder={false}>
            <CardHeader>
              <CardImage src="https://curiexplore.enseignementsup-recherche.gouv.fr/static/media/logo-curiexplore.94b2a1be.svg" alt="curieXplore logo" width="200px" />
            </CardHeader>
            <CardDetail>
              <BadgeGroup>
                <Badge text="Badge #1" />
                <Badge text="Badge #2" />
              </BadgeGroup>
            </CardDetail>
            <CardTitle>
              CurieXplore
            </CardTitle>
            <CardDescription as="div">
              CurieXplore est ...
            </CardDescription>
          </Card>
        </Col>
        <Col n="12 sm-6 md-4" spacing="p-3w">
          <Card href="https://scanr.enseignementsup-recherche.gouv.fr/" hasBorder={false}>
            <CardHeader>
              <CardImage src="https://curiexplore.enseignementsup-recherche.gouv.fr/static/media/logo-curiexplore.94b2a1be.svg" alt="logo" />
            </CardHeader>
            <CardDetail>
              <BadgeGroup>
                <Badge text="Badge #1" />
                <Badge text="Badge #2" />
              </BadgeGroup>
            </CardDetail>
            <CardTitle>
              scanR
            </CardTitle>
            <CardDescription as="div">
              Moteur de la recherche et de l'innovation
            </CardDescription>
          </Card>
        </Col>
        <Col n="12 sm-6 md-4" spacing="p-3w">
          <Card href="https://www.enseignementsup-recherche.gouv.fr/fr/eesr" hasBorder={false}>
            <CardHeader>
              <CardImage src="https://publication.enseignementsup-recherche.gouv.fr/eesr2/images/EESR15_TITRE_FR.svg" alt="logo" />
            </CardHeader>
            <CardDetail>
              <BadgeGroup>
                <Badge text="Badge #1" />
                <Badge text="Badge #2" />
              </BadgeGroup>
            </CardDetail>
            <CardTitle>
              L'état de l'enseignement supérieur
            </CardTitle>
            <CardDescription as="div">
              Découvrez ...
            </CardDescription>
          </Card>
        </Col>
        <Col n="12 sm-6 md-4" spacing="p-3w">
          <Card href="https://data.esr.gouv.fr/FR/" hasBorder={false}>
            <CardHeader>
              <CardImage src="https://dataesr.enseignementsup-recherche.pro/images/dataESR.svg" alt="logo" />
              <BadgeGroup>
                <Badge text="Badge #1" />
                <Badge text="Badge #2" />
              </BadgeGroup>
            </CardHeader>
            <CardTitle>
              #dataesr
            </CardTitle>
            <CardDescription as="div">
              Découvrez l'offre de service #dataesr
            </CardDescription>
          </Card>
        </Col>
        <Col n="12 sm-6 md-4" spacing="p-3w">
          <Card href="https://data.enseignementsup-recherche.gouv.fr/pages/home/" hasBorder={false}>
            <CardHeader>
              <CardImage src="https://data.enseignementsup-recherche.gouv.fr/assets/theme_image/opendataesr.png" alt="logo" />
            </CardHeader>
            <CardDetail>
              <BadgeGroup>
                <Badge text="Badge #1" />
                <Badge text="Badge #2" />
              </BadgeGroup>
            </CardDetail>
            <CardTitle>
              OpenData
            </CardTitle>
            <CardDescription as="div">
              Découvrez les jeux de données ouvertes relatives à l'enseignement supérieur et à la recherche.
            </CardDescription>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
