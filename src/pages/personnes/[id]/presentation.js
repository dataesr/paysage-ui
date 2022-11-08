import { Row, Title, Col, Icon } from '@dataesr/react-dsfr';
import Identifiers from '../../../components/blocs/identifiers';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import Spinner from '../../../components/spinner';
import useFetch from '../../../hooks/useFetch';
import useHashScroll from '../../../hooks/useHashScroll';
import useUrl from '../../../hooks/useUrl';
import PersonCurrentMandates from '../../../components/blocs/current-mandates';
import Wiki from '../../../components/blocs/wiki';

export default function PersonPresentationPage() {
  useHashScroll();
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);

  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <Row className="fr-my-2w flex--space-around">Erreur...</Row>;
  return (
    <>
      <Row>
        <Col n="12">
          <Title as="h3" look="h4">En un coup d'oeil</Title>
        </Col>
      </Row>
      <Row gutters spacing="mb-5w">
        <Wiki />
        <Col n="12">
          <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-persons">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <p className="fr-card__title">
                  <span className="fr-text fr-text--regular fr-text--md fr-pr-1w">{data?.otherNames?.length > 0 ? data.otherNames.join(', ') : 'Aucune autre dénomination connue'}</span>
                </p>
                <div className="fr-card__start">
                  <p className="fr-card__detail fr-text--sm fr-mb-0">
                    <Icon name="ri-contacts-line" size="1x" />
                    Autres dénominations connues
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <PersonCurrentMandates />
      <Title as="h3" look="h4">Présence sur le web</Title>
      <Row gutters>
        <Col n="12 md-6">
          <Weblinks />
        </Col>
        <Col n="12 md-6">
          <SocialMedias />
        </Col>
      </Row>
      <Identifiers />
    </>
  );
}
