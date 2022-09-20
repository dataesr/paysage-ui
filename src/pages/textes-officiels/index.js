import {
  Col,
  Container,
  Row,
  Title,
  TextInput,
} from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/button';
import useFetch from '../../hooks/useFetch';

export default function OfficialTextsPage() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useFetch('/official-texts');

  if (isLoading || !data) return <h1>Loading</h1>;
  if (error) return <h1>Error</h1>;

  return (
    <Container spacing="mt-5w" as="main">
      <Row>
        <Col n="9">
          <Title as="h2">Les textes officiels Paysage</Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={() => navigate('./ajouter')}
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter un texte officiel
          </Button>
        </Col>
      </Row>
      <Row className="fr-pb-5w">
        Nombre de textes officiels en base :
        {data.totalCount}
      </Row>

      <Row
        gutters
        spacing="px-2w"
        alignItems="bottom"
        className="fr-pt-1w fr-pb-2w bg-textes-officiels"
      >
        <Col n="10">
          <TextInput label="Rechercher un texte officiel" />
        </Col>
        <Col>
          <Button>Rechercher</Button>
        </Col>
      </Row>

      <Row className="fr-pt-5w">
        <Col>
          <Title as="h3">Derniers textes officiels ajoutés</Title>
        </Col>
      </Row>
      <Row>
        {data.data.map((ot) => (
          <Col n="3" className="fr-p-1w">
            <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
              <div className="fr-tile__body">
                <h4 className="fr-tile__title">
                  <a
                    className="fr-tile__link"
                    href={`/textes-officiels/${ot.id}`}
                  >
                    {ot.title}
                  </a>
                </h4>
                <p className="fr-tile__desc">
                  {`publié le ${ot.publicationDate}`}
                </p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
