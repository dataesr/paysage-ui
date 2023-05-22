import { ButtonGroup, Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ReactComponent as TechErrorSVG } from '../../assets/technical-error.svg';

function Error500() {
  return (
    <>
      <Title as="h1" look="h1">Erreur inattendue</Title>
      <Text size="sm" className="fr-mb-3w">Erreur 500</Text>
      <Text size="lead" className="fr-mb-3w">Essayez de rafraîchir la page ou bien réessayez plus tard.</Text>
      <Text size="sm" className="fr-mb-5w">
        Désolé, le service rencontre un problème, nous travaillons pour le résoudre le plus rapidement possible.
      </Text>
    </>
  );
}
function Error404() {
  return (
    <>
      <Title as="h1" look="h1">Page non trouvée</Title>
      <Text size="sm" className="fr-mb-3w">Erreur 404</Text>
      <Text size="lead" className="fr-mb-3w">La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.</Text>
      <Text size="sm" className="fr-mb-5w">
        Si vous avez tapé l'adresse web dans le navigateur, vérifiez qu'elle est correcte. La page n'est peut-être plus disponible.
        <br />
        Dans ce cas, pour continuer votre visite, vous pouvez consulter notre page d'accueil, ou effectuer une recherche avec notre moteur de recherche en haut de page.
        <br />
        Sinon contactez-nous pour que l'on puisse vous rediriger vers la bonne information.
      </Text>
    </>
  );
}

export default function Error({ status }) {
  return (
    <Container>
      <Row gutters alignItems="middle" justifyContent="center" spacing="my-7w mt-md-12w mb-md-10w">
        <Col spacing="py-0" n="12 md-6">
          {['400', '404', '403', '401'].includes(status) ? <Error404 /> : <Error500 />}
          <ButtonGroup isInlineFrom="sm">
            <li>
              <Link className="fr-btn fr-btn--primary" to="/">
                Retour à l'accueil
              </Link>
            </li>
            <li>
              <Link className="fr-btn fr-btn--secondary" to="/nous-contacter">
                Contactez-nous
              </Link>
            </li>
          </ButtonGroup>
        </Col>
        <Col spacing="px-6w px-md-0 py-0" offset="md-1" n="12 md-3">
          <TechErrorSVG />
        </Col>
      </Row>
    </Container>
  );
}

Error.propTypes = {
  status: PropTypes.string.isRequired,
};
