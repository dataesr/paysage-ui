import {
  Breadcrumb,
  BreadcrumbItem,
  Badge,
  Col,
  Container,
  Row,
  Title,
  TextInput,
  Button,
} from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

export default function TermssPage() {
  const { data, error, isLoading } = useFetch('/terms');

  if (isLoading || !data) return <h1>Loading</h1>;
  if (error) return <h1>Error</h1>;

  return (
    <Container spacing="mb-6w">
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem>Les termes</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Row alignItems="top">
          <Title className="fr-pr-1v" as="h1" look="h2">Les termes</Title>
          <Badge type="info" text={data?.totalCount} />
        </Row>
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
