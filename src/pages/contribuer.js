import { Link as RouterLink } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Container,
  Icon,
  Row,
  Tile,
  TileBody,
  Title,
} from '@dataesr/react-dsfr';
import CategoryAddPage from './categories/ajouter';
import StructureAddPage from './structures/ajouter';
import TermAddPage from './termes/ajouter';
import OfficialTextAddPage from './textes-officiels/ajouter';
import PersonAddPage from './personnes/ajouter';
import ProjectAddPage from './projets/ajouter';

export default function ContributePage() {
  const data = [
    { type: 'structures', icon: 'ri-building-line', name: 'Ajouter une structure', url: '/structures/ajouter' },
    { type: 'persons', icon: 'ri-user-3-line', name: 'Ajouter une personne', url: '/personnes/ajouter' },
    { type: 'categories', icon: 'ri-price-tag-3-line', name: 'Ajouter une catégorie', url: '/categories/ajouter' },
    { type: 'terms', icon: 'ri-hashtag', name: 'Ajouter un terme', url: '/termes/ajouter' },
    { type: 'projects', icon: 'ri-booklet-line', name: 'Ajouter un projet', url: '/projets/ajouter' },
    { type: 'prices', icon: 'ri-award-line', name: 'Ajouter un prix', url: '/prix/ajouter' },
  ];
  return (
    <Container className="fr-mb-6w">
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>
              Accueil
            </BreadcrumbItem>
            <BreadcrumbItem>Ajouter un nouvel objet</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <div className="fr-notice fr-notice--info fr-mb-2w">
        <div className="fr-container">
          <div className="fr-notice__body">
            <p className="fr-notice__title">
              Etes-vous sur que l'objet n'existe pas ?
            </p>
            <p className="fr-notice__title">
              Vérifiez en utilisant la barre de recherche principale avant d'ajouter un nouvel objet
            </p>
          </div>
        </div>
      </div>
      <Row>
        <Col>
          <Title as="h2" look="h3">Ajouter un nouvel objet Paysage</Title>
        </Col>
      </Row>
      <Row as="ul" gutters>
        {data.map((element) => (
          <Col n="12 md-6 lg-4" as="li" key={element.type}>
            <Tile horizontal color={`var(--${element.type}-color)`}>
              <TileBody
                titleAs="h5"
                title={element.name}
                asLink={<RouterLink to={element.url} />}
                // description="Un attribut eventuel de l'objet paysage qui sera remonté par l'api"
              />
              <div className="fr-tile__img">
                <Icon size="3x" name={element.icon} color={`var(--${element.type}-color)`} />
              </div>
            </Tile>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export {
  ContributePage,
  CategoryAddPage,
  StructureAddPage,
  TermAddPage,
  OfficialTextAddPage,
  PersonAddPage,
  ProjectAddPage,
};
