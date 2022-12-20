import {
  Card,
  CardDescription,
  CardImage,
  CardTitle,
  Col,
  Container,
  Row,
  Title,
  CardHeader,
} from '@dataesr/react-dsfr';
import usePageTitle from '../hooks/usePageTitle';

export default function RessourcesPage() {
  usePageTitle('Ressources');
  return (
    <Container spacing="mt-5w">
      <Title as="h2">Les ressources externes</Title>
      <Row>
        <Col n="12 sm-6 md-4" spacing="p-3w">
          <Card
            asLink={<a className="flex flex--baseline" href="https://curiexplore.enseignementsup-recherche.gouv.fr" target="_blank" rel="noreferrer">CurieXplore</a>}
            isGrey
            hasBorder={false}
          >
            <CardHeader>
              <CardImage
                src="https://curiexplore.enseignementsup-recherche.gouv.fr/static/media/logo-curiexplore.94b2a1be.svg"
                alt="curieXplore logo"
              />
            </CardHeader>
            <CardTitle>CurieXplore</CardTitle>
            <CardDescription as="div">
              La plateforme d'exploration des systèmes d'enseignement supérieur,
              de recherche et d'innovation à l'international.
              Réalisé en collaboration avec le ministère de l'Europe et des affaires étrangères.
            </CardDescription>
          </Card>
        </Col>
        <Col n="12 sm-6 md-4" spacing="p-3w">
          <Card
            asLink={<a className="flex flex--baseline" href="https://scanr.enseignementsup-recherche.gouv.fr/" target="_blank" rel="noreferrer">ScanR</a>}
            isGrey
            hasBorder={false}
          >
            <CardHeader>
              <CardImage
                src="https://paysage.mesri.fr/images/logos/W3SuU.svg"
                alt="logo"
              />
            </CardHeader>
            <CardTitle>scanR</CardTitle>
            <CardDescription as="div">
              Explorez le monde de la Recherche et de l'Innovation française avec scanR
            </CardDescription>
          </Card>
        </Col>
        <Col n="12 sm-6 md-4" spacing="p-3w">
          <Card
            asLink={<a className="flex flex--baseline" href="https://www.enseignementsup-recherche.gouv.fr/fr/eesr" target="_blank" rel="noreferrer">L'état de l'enseignement supérieur</a>}
            isGrey
            hasBorder={false}
          >
            <CardHeader>
              <CardImage
                src="https://publication.enseignementsup-recherche.gouv.fr/eesr2/images/EESR15_TITRE_FR.svg"
                alt="logo"
              />
            </CardHeader>
            <CardTitle>L'état de l'enseignement supérieur</CardTitle>
            <CardDescription as="div">État de l'enseignement supérieur, de la recherche et de l'innovation</CardDescription>
          </Card>
        </Col>
        <Col n="12 sm-6 md-4" spacing="p-3w">
          <Card
            asLink={<a className="flex flex--baseline" href="https://data.esr.gouv.fr/FR/" target="_blank" rel="noreferrer">#dataesr</a>}
            isGrey
            hasBorder={false}
          >
            <CardHeader>
              <CardImage
                src="https://dataesr.enseignementsup-recherche.pro/images/dataESR.svg"
                alt="logo"
              />
            </CardHeader>
            <CardTitle>#dataesr</CardTitle>
            <CardDescription as="div">
              #dataESR vous aide à trouver les ressources en données sur
              l'enseignement supérieur, la recherche et l'innovation
            </CardDescription>
          </Card>
        </Col>
        <Col n="12 sm-6 md-4" spacing="p-3w">
          <Card
            asLink={<a className="flex flex--baseline" href="https://data.esr.gouv.fr/FR/" target="_blank" rel="noreferrer">OpenData</a>}
            isGrey
            hasBorder={false}
          >
            <CardHeader>
              <CardImage
                src="https://data.enseignementsup-recherche.gouv.fr/assets/theme_image/opendataesr.png"
                alt="logo"
              />
            </CardHeader>
            <CardTitle>OpenData</CardTitle>
            <CardDescription as="div">
              Découvrez les jeux de données ouvertes relatives à l'enseignement
              supérieur et à la recherche.
            </CardDescription>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
