import { Col, Container, Row, Title, TextInput, Button } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useFetch('/categories');

  if (isLoading || !data) return <h1>Loading</h1>;
  if (error) return <h1>Error</h1>;

  return (
    <Container spacing="mt-5w">
      <Row>
        <Col n="9">
          <Title as="h2">Les catégories Paysage</Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={() => navigate('./ajouter')}
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter une catégorie
          </Button>
        </Col>
      </Row>
      <Row className="fr-pb-5w">
        Nombre de catégories en base :
        {data.totalCount}
      </Row>

      <Row
        gutters
        spacing="px-2w"
        alignItems="bottom"
        className="fr-pt-1w fr-pb-2w bg-categories"
      >
        <Col n="10">
          <TextInput label="Rechercher une catégorie" />
        </Col>
        <Col>
          <Button>Rechercher</Button>
        </Col>
      </Row>

      <Row className="fr-pt-5w">
        <Col>
          <Title as="h3">Catégories les plus utilisées</Title>
        </Col>
      </Row>
      <Row>
        {data.data.map((category) => (
          <Col n="3" className="fr-p-1w">
            <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
              <div className="fr-tile__body">
                <h4 className="fr-tile__title">
                  <a
                    className="fr-tile__link"
                    href={`/categories/${category.id}`}
                  >
                    {category.usualNameFr}
                  </a>
                </h4>
                <p className="fr-tile__desc">Texte MD regular 2 lignes max.</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Row className="fr-pt-5w">
        <Col>
          <Title as="h3">Dernières catégories ajoutées</Title>
        </Col>
      </Row>
      <Row>
        {data.data.map((category) => (
          <Col n="3" className="fr-p-1w">
            <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
              <div className="fr-tile__body">
                <h4 className="fr-tile__title">
                  <a
                    className="fr-tile__link"
                    href={`/categories/${category.id}`}
                  >
                    {category.usualNameFr}
                  </a>
                </h4>
                <p className="fr-tile__desc">Texte MD regular 2 lignes max.</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
