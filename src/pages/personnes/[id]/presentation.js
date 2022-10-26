import { useEffect, useState } from 'react';
import { Row, Title, Col, Icon } from '@dataesr/react-dsfr';
import Identifiers from '../../../components/blocs/identifiers';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import Spinner from '../../../components/spinner';
import useFetch from '../../../hooks/useFetch';
import useHashScroll from '../../../hooks/useHashScroll';
import useUrl from '../../../hooks/useUrl';
import PersonCurrentMandates from '../../../components/blocs/current-mandates';

export default function PersonPresentationPage() {
  useHashScroll();
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);
  const { data: wikidata } = useFetch(`${url}/identifiers?filters[type]=Wikidata`);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const getActivity = async (wikiId) => fetch(`https://www.wikidata.org/w/api.php?format=json&origin=*&action=wbgetentities&ids=${wikiId}&languages=fr`)
      .then((response) => response.json())
      .then((json) => setActivity(json?.entities?.[wikiId]?.descriptions?.fr?.value))
      .catch(() => null);

    if (wikidata?.data?.length) {
      getActivity(wikidata.data[0]?.value);
    }
  }, [wikidata]);

  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <Row className="fr-my-2w flex--space-around">Erreur...</Row>;
  return (
    <>
      {(data?.otherNames?.length > 0) && (
        <>
          <Row>
            <Col n="12">
              <Title as="h3" look="h4">En un coup d'oeil</Title>
            </Col>
          </Row>
          <Row gutters spacing="mb-5w">
            {(data.otherNames.length > 0) && (
              <Col n="12 md-6">
                <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-persons">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <p className="fr-card__title">
                        <span className="fr-text fr-text--regular fr-text--md fr-pr-1w">{data.otherNames.join(', ')}</span>
                      </p>
                      <div className="fr-card__start">
                        <p className="fr-card__detail fr-text--sm fr-mb-0">
                          <Icon name="ri-contacts-line" size="1x" />
                          Autres dénomination connue
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            )}
            {(activity) && (
              <Col n="12 md-6">
                <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-persons">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <p className="fr-card__title">
                        <span className="fr-text fr-text--regular fr-text--md fr-pr-1w">{activity}</span>
                      </p>
                      <div className="fr-card__start">
                        <p className="fr-card__detail fr-text--sm fr-mb-0">
                          <Icon name="ri-global-line" size="1x" />
                          Description wikipedia
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </>
      )}
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
