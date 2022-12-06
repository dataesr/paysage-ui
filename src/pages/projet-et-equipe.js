/* eslint-disable max-len */
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Card, CardDescription, CardHeader, CardImage, CardTitle, Col, Container, Highlight, Icon, Row, Text, Title } from '@dataesr/react-dsfr';
import image1 from '../assets/paysage-image-1.png';
import { Timeline, TimelineItem } from '../components/timeline';

export default function ProjetEtEquipe() {
  useEffect(() => { document.title = 'Paysage · Projet & équipe'; }, []);
  return (
    <Container spacing="pb-6w">
      <Breadcrumb>
        <BreadcrumbItem asLink={<RouterLink to="/" />}>
          Accueil
        </BreadcrumbItem>
        <BreadcrumbItem>
          L'équipe et son projet
        </BreadcrumbItem>
      </Breadcrumb>
      <Row>
        <Col>
          <Title as="h1">
            Paysage
          </Title>
          <Highlight size="lg">
            capitalisons sur les connaissances de chacun pour la connaissance de tous
          </Highlight>
        </Col>
      </Row>
      <Row spacing="my-4w">
        <Col>
          <Card
            isHorizontal
            hasArrow={false}
          >
            <CardHeader>
              <CardImage src={image1} />
            </CardHeader>

            <CardDescription>
              <p>
                Paysage est une plateforme collaborative de partage de connaissances. Elle permet le suivi des établissements, organismes, regroupements, réseaux et projets qui composent le paysage de l'enseignement supérieur, de la recherche et de l'innovation (ESRI). Elle est accessible sur le web sur tout support (ordinateur, tablette, smartphone). Elle permet à ses utilisateurs de partager leurs connaissances sur ces acteurs et les liens qu'ils ont tissés entre eux.
              </p>
              <p>
                Paysage permet de retracer leur histoire (fusion, scission, succession, changement de statut juridique...), de consolider et de partager au même endroit toutes les informations, documents et événements marquants les concernant (décrets, arrêtés, documents préparatoires, synthèses, contrats...).
              </p>
              <p>
                Paysage permet aussi de suivre le déroulement de différents processus métiers. Paysage propose un ensemble de cartes et des listes prêtes à l'emploi mises à jour en continu et facilement imprimables ou exportables. Son administration est facilitée.
              </p>
            </CardDescription>
          </Card>
        </Col>
      </Row>
      <Row spacing="my-4w">
        <Col>
          <Card
            isHorizontal
            hasArrow={false}
          >
            <CardTitle>
              <Icon name="ri-check-fill" size="lg" />
              A l'origine du projet
            </CardTitle>
            <CardDescription>
              <Text>
                Les différents services du ministère de l'Enseignement supérieur et de la Recherche (MESR) gèrent ou suivent de nombreux établissements publics et privés, partenaires, dispositifs ou réseaux, plus ou moins imbriqués les uns dans les autres. Toutes ces structures constituent le paysage de l'enseignement supérieur, de la recherche et de l'innovation. Ce paysage est en constant mouvement. L'ordonnance n° 2018-1131 relative à l'expérimentation de nouvelles formes de rapprochement, de regroupement ou de fusion des établissements d'enseignement supérieur et de recherche offre par exemple de nouvelles possibilités qui ont fortement modifié ce paysage.
              </Text>
              <Text>
                Jusqu'à présent, faute d'outil commun, le suivi de la mise en œuvre d'une nouvelle réforme se faisait indépendamment dans chaque service interne ou externe au MESR. L'information est ainsi éparpillée, et pas forcément à jour partout. De même, aucun outil ne permettait jusqu'alors d'avoir une vue consolidée de ce paysage, de voir comment ce paysage évolue ou va évoluer puisque chaque dispositif avait son propre outil de suivi.
              </Text>
              <Text>
                A partir du besoin de cartographier dynamiquement et en temps réel la mise en œuvre de cette ordonnance est née l'idée de Paysage, un outil plus global ayant vocation à réunir au même endroit toutes les informations nécessaires à ce suivi.
              </Text>
            </CardDescription>
          </Card>
        </Col>
      </Row>
      <Row spacing="my-4w">
        <Col>
          <Card
            isHorizontal
            hasArrow={false}
          >
            <CardTitle>
              <Icon name="ri-arrow-right-up-line" size="lg" />
              Un projet en constante évolution
            </CardTitle>
            <CardDescription>
              <Text>
                À l'origine du projet, la construction d'une carte dynamique sur la mise en œuvre de l'Ordonnance n° 2018-1131.
              </Text>
              <Text>
                Très vite le besoin s'est exprimé de proposer une gestion du workflow et de concentrer au même endroit les différentes informations et documents relatifs aux actuels et futurs regroupements et leur composition pour un meilleur partage de ces informations auprès des différents services en charge du suivi de ces expérimentations.
              </Text>
              <Text>
                Ce besoin étant générique, à la demande de différents services du MESRI, l'application s'est progressivement étendue à d’autres structures suivies par le ministère ou composant le paysage de l’ESR en France et même de par le monde. Paysage couvre ainsi plus de 10&nbsp;000 structure (décembre 2022).
              </Text>
              <Text>
                Paysage s'appuie sur les expertises des départements métiers pour proposer des outils adaptés pour faciliter leur quotidien et directement intégrés dans l'application. Les informations sont ainsi centralisées au même endroit, partagées avec le plus grand nombre.
              </Text>
            </CardDescription>
          </Card>
        </Col>
      </Row>
      <Row spacing="my-4w">
        <Col spacing="pr-2w">
          <Card hasArrow={false}>
            <CardTitle>
              <Icon name="ri-questionnaire-line" size="lg" />
              Pour qui ?
            </CardTitle>
            <CardDescription>
              <Text>
                L'application a vocation à être partagée le plus largement possible au sein de la communauté des professionnels de l'ESRI.
              </Text>
              <Text>
                En interne, Paysage outille les services dans le suivi et l'administration des structures dont ils ont la charge pour faciliter leurs tâches de tous les jours.
              </Text>
              <Text>
                L'information, concentrée en un espace unique, devient exploitable par tous les acteurs ayant accès à Paysage, mais pourra aussi être diffusée partiellement au grand public sur le site institutionnel du MESR et sur sa plateforme open data.
              </Text>
              <Text>
                Paysage est déjà ouvert en interne au MESR/MENJ y compris les services déconcentrés et le sera prochainement aux partenaires extérieurs (Hcéres, Igesr, ...).
              </Text>
            </CardDescription>
          </Card>
        </Col>
        <Col spacing="pl-2w">
          <Card hasArrow={false}>
            <CardTitle>
              <Icon name="ri-questionnaire-line" size="lg" />
              Pour quoi ?
            </CardTitle>
            <CardDescription>
              <Text>
                <Icon name="ri-check-fill" />
                Paysage facilite la gestion et le suivi des différentes catégories de structures du paysage de l'ESRI.
              </Text>
              <Text>
                <Icon name="ri-check-fill" />
                Simplifier le travail au quotidien des gestionnaires en leur donnant accès à un outil performant de gestion et de structuration de l’information permettant de consolider le patrimoine commun de données de qualité du MESR
              </Text>
              <Text>
                <Icon name="ri-check-fill" />
                Aider au diagnostic et à la prise de décision en proposant une vision panoramique des structures du paysage de l’ESR par la concentration de l’ensemble de l’information disponible dans une application partagée et unique (connaissances locales des gestionnaires, systèmes d’information locaux ou distants, notes d’analyses, rapports, …).
              </Text>
              <Text>
                <Icon name="ri-check-fill" />
                Générer des gains de productivité pour les services, mais aussi leur proposer de nouveaux outils innovants et agréables d'emploi.
              </Text>
            </CardDescription>
          </Card>
        </Col>
      </Row>
      <Row spacing="my-4w">
        <Col spacing="pr-2w">
          <Card hasArrow={false}>
            <CardTitle>
              <Icon name="ri-calendar-check-line" size="lg" />
              Chronologie
            </CardTitle>
            <CardDescription>
              <Timeline>
                <TimelineItem date="2018-12-12">
                  {/* <Row className="flex--space-between">
                    <BadgeGroup><Badge text="badge" /></BadgeGroup>
                  </Row>
                  <Text spacing="mb-1w" size="lead" bold>Titre</Text> */}
                  <Text spacing="mb-1w">Publication de l'ordonnance n° 2018- 1131 relative à l'expérimentation de nouvelles formes de rapprochement, de regroupement ou de fusion des établissements d'enseignement supérieur et de recherche</Text>
                </TimelineItem>
                <TimelineItem date="2019-01" approximate>
                  <Text spacing="mb-1w">Début du projet de cartographie de la mise en oeuvre de l'ordonnance</Text>
                </TimelineItem>
                <TimelineItem date="2019-02" approximate>
                  <Text spacing="mb-1w">Première version de Paysage</Text>
                </TimelineItem>
                <TimelineItem date="2019-03" approximate>
                  <Text spacing="mb-1w">Ouverture officielle de Paysage</Text>
                </TimelineItem>
                <TimelineItem date="2021-09" approximate>
                  <Text spacing="mb-1w">Mise en production de Paysage V1 (5 000 structures décrites)</Text>
                </TimelineItem>
                <TimelineItem date="2022-12" approximate>
                  <Text spacing="mb-1w">Mise en production de Paysage V2. Ergonomie repensée et conforme au design system de l’état, nouvelle architecture technique (10 000 structures décrites)</Text>
                </TimelineItem>
              </Timeline>
            </CardDescription>
          </Card>
        </Col>
        <Col spacing="pl-2w">
          <Card hasArrow={false}>
            <CardTitle>
              <Icon name="ri-team-line" size="lg" />
              L'équipe
            </CardTitle>
            <CardDescription>
              <Text>
                Impulsée et soutenue successivement par Brigitte Plateau et Anne-Sophie Barthez, Directrices générales de l’enseignement supérieur et de l’insertion professionnelle au ministère de l’enseignement supérieur et de la recherche, Paysage est conçue, développée et administrée par l'équipe du département des outils d'aide à la décision (DGESIP/DGRI-SIES).
                <br />
                Tout au long du projet, Tiphanie Pons a veillé, pour la DGESIP, à l’épanouissement du projet. Elle a partagé sa connaissance du fonctionnement du ministère et son expertise sur le paysage de l’ESRI.
                <br />
                Yann Caradec et Emmanuel Weisenburger ont été à l’origine du projet. Yann Caradec a en développé les deux premières versions notamment en s’appuyant sur l’expertise de Jean-Louis Billoët.
                <br />
                <br />
                Alexandra Bounyavath a construit une communauté, formé et informé sans relâche les utilisateurs sur le projet et identifié pour l’équipe de conception les besoins des utilisateurs. Pauline Gaudet-Chardonnet a été à l’origine d’une première esquisse de Design.
                <br />
                Anne L’Hôte, Frédéric Olland et Jeremy Peglion ont imaginé une architecture technique à l’état de l’art. Associés à Mihoub Debache, ils ont développé l’interface de Paysage. Alexandra Bounyavath, Yann Caradec, Julia Grandhay, Isabelle Paulin, Mialy Rakondrazaka et Emmanuel Weisenburger ont travaillé à l’enrichissement et à la fiabilisation des données de Paysage.
              </Text>
              <Text>
                Paysage s'appuie également sur de nombreux contributeurs de la Direction générale de l'enseignement supérieur et de l'insertion professionnelle (DGESIP) et de la Direction générale de la recherche et de l'innovation (DGRI). Un grand merci à eux.
              </Text>
            </CardDescription>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
