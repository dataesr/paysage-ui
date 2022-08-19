import {
  Col,
  Container,
  Row,
  Title,
  TextInput,
  Button,
} from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

export default function TermssPage() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useFetch('GET', '/terms');

  if (isLoading || !data) return <h1>Loading</h1>;
  if (error) return <h1>Error</h1>;

  return (
    <Container spacing="mt-5w" as="main">
      <Row>
        <Col n="9">
          <Title as="h2">Les termes Paysage</Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={() => navigate('./ajouter')}
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter un terme
          </Button>
        </Col>
      </Row>
      <Row className="fr-pb-5w">
        Nombre de termes en base :
        {data.totalCount}
      </Row>

      <Row
        gutters
        spacing="px-2w"
        alignItems="bottom"
        className="fr-pt-1w fr-pb-2w bg-terms"
      >
        <Col n="10">
          <TextInput label="Rechercher un terme" />
        </Col>
        <Col>
          <Button>Rechercher</Button>
        </Col>
      </Row>

      <Row className="fr-pt-5w">
        <Col>
          <Title as="h3">Termes les plus utilisés</Title>
        </Col>
      </Row>
      <Row>
        {data.data.map((term) => (
          <Col n="3" className="fr-p-1w">
            <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
              <div className="fr-tile__body">
                <h4 className="fr-tile__title">
                  <a className="fr-tile__link" href={`/terms/${term.id}`}>
                    {term.usualNameFr}
                  </a>
                </h4>
                <p className="fr-tile__desc">{term.descriptionFr}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
