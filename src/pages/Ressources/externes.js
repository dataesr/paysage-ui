import { Col, Container, Row, Title } from '@dataesr/react-dsfr';

export default function RessourcesPage() {
  return (
    <Container spacing="mt-5w" as="main">
      <Title as="h2">Les ressources EXTERNES Paysage</Title>

      <Row>
        <Col n="3" className="fr-p-1w">
          <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
            <div className="fr-tile__body">
              <h4 className="fr-tile__title">
                <a
                  className="fr-tile__link"
                  href="https://data.enseignementsup-recherche.gouv.fr/explore/"
                >
                  OpenData
                </a>
              </h4>
              <p className="fr-tile__desc">...</p>
            </div>
          </div>
        </Col>
        <Col n="3" className="fr-p-1w">
          <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
            <div className="fr-tile__body">
              <h4 className="fr-tile__title">
                <a
                  className="fr-tile__link"
                  href="https://curiexplore.enseignementsup-recherche.gouv.fr/"
                >
                  CurieXplore
                </a>
              </h4>
              <p className="fr-tile__desc">...</p>
            </div>
          </div>
        </Col>
        <Col n="3" className="fr-p-1w">
          <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
            <div className="fr-tile__body">
              <h4 className="fr-tile__title">
                <a
                  className="fr-tile__link"
                  href="https://scanr.enseignementsup-recherche.gouv.fr/"
                >
                  scanR
                </a>
              </h4>
              <p className="fr-tile__desc">...</p>
            </div>
          </div>
        </Col>
        <Col n="3" className="fr-p-1w">
          <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
            <div className="fr-tile__body">
              <h4 className="fr-tile__title">
                <a
                  className="fr-tile__link"
                  href="https://www.enseignementsup-recherche.gouv.fr/fr/eesr"
                >
                  Etat du sup
                </a>
              </h4>
              <p className="fr-tile__desc">...</p>
            </div>
          </div>
        </Col>
        <Col n="3" className="fr-p-1w">
          <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
            <div className="fr-tile__body">
              <h4 className="fr-tile__title">
                <a className="fr-tile__link" href="/termes">
                  Offre de services
                </a>
              </h4>
              <p className="fr-tile__desc">...</p>
            </div>
          </div>
        </Col>
        <Col n="3" className="fr-p-1w">
          <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
            <div className="fr-tile__body">
              <h4 className="fr-tile__title">
                <a className="fr-tile__link" href="/termes">
                  Publications statistiques
                </a>
              </h4>
              <p className="fr-tile__desc">...</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
