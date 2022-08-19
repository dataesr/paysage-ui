import { Col, Container, Row, Title } from '@dataesr/react-dsfr';
import useFetch from '../../hooks/useFetch';

export default function RessourcesPage() {
  const dataCategories = useFetch('GET', '/categories');
  const dataTextOff = useFetch('GET', '/official-texts');
  const dataTerms = useFetch('GET', '/terms');

  return (
    <Container spacing="mt-5w" as="main">
      <Title as="h2">Les ressources Paysage</Title>

      <Row>
        <Col n="3" className="fr-p-1w">
          <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
            <div className="fr-tile__body">
              <h4 className="fr-tile__title">
                <a className="fr-tile__link" href="/categories">
                  Les catégories
                </a>
              </h4>
              <p className="fr-tile__desc">
                {dataCategories?.data?.totalCount}
              </p>
            </div>
          </div>
        </Col>
        <Col n="3" className="fr-p-1w">
          <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
            <div className="fr-tile__body">
              <h4 className="fr-tile__title">
                <a className="fr-tile__link" href="/textes-officiels">
                  Les textes officiels
                </a>
              </h4>
              <p className="fr-tile__desc">{dataTextOff?.data?.totalCount}</p>
            </div>
          </div>
        </Col>
        <Col n="3" className="fr-p-1w">
          <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
            <div className="fr-tile__body">
              <h4 className="fr-tile__title">
                <a className="fr-tile__link" href="/termes">
                  Les termes
                </a>
              </h4>
              <p className="fr-tile__desc">{dataTerms?.data?.totalCount}</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
