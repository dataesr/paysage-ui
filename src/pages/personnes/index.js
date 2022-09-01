import {
  Col,
  Container,
  Row,
  Title,
  TextInput,
  Button,
} from '@dataesr/react-dsfr';
import useFetch from '../../hooks/useFetch';

export default function StructuresPage() {
  const { data, error, isLoading } = useFetch('/persons');
  if (isLoading || !data) return <h1>Loading</h1>;
  if (error) return <h1>Error</h1>;

  return (
    <Container spacing="mt-5w" as="main">
      <Title as="h2">Les personnes Paysage</Title>
      <Row className="fr-pb-5w">
        Nombre de personnes en base :
        {data.totalCount}
      </Row>

      <Row
        gutters
        spacing="px-2w"
        alignItems="bottom"
        className="fr-pt-1w fr-pb-2w bg-persons"
      >
        <Col n="10">
          <TextInput label="Rechercher une personne" />
        </Col>
        <Col>
          <Button>Rechercher</Button>
        </Col>
      </Row>

      <Row className="fr-pt-5w">
        <Col>
          <Title as="h3">Dernières personnes ajoutées/modifiées</Title>
        </Col>
      </Row>
      <Row>
        {data.data.map((person) => (
          <Col n="4" className="fr-p-1w">
            <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
              <div className="fr-tile__body">
                <h4 className="fr-tile__title">
                  <a
                    className="fr-tile__link"
                    href={`/personnes/${person.id}`}
                  >
                    {`${person.lastName} ${person.firstName}`}
                  </a>
                </h4>
                {/* <p className="fr-tile__desc">
                  {getLocalisation(person?.currentLocalisation)}
                </p> */}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
