import { useNavigate, useParams } from 'react-router-dom';
import { Badge, BadgeGroup, Col, Row, Tag, Text } from '@dataesr/react-dsfr';
import useFetch from '../../hooks/useFetch';
import useHashScroll from '../../hooks/useHashScroll';
import { Bloc, BlocContent, BlocTitle } from '../bloc';
import TagList from '../tag-list';
import Button from '../button';

export default function ActualitesOutlet() {
  const { id: resourceId } = useParams();
  const navigate = useNavigate();
  const url = `/press?filters[relatesTo]=${resourceId}&sort=-publicationDate&limit=500`;
  const { data, isLoading, error } = useFetch(url);
  useHashScroll();

  const renderContent = () => {
    if (!data || !data.data.length) return null;
    return (
      <Row gutters>
        {data.data.map((event) => (
          <Col n="12" key={event.id}>
            <div className="fr-card fr-card--xs fr-card--shadow">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <div className="fr-card__start">
                    <Row className="flex--space-between">
                      <BadgeGroup>
                        <Badge type="new" text={event.publicationDate} />
                      </BadgeGroup>
                    </Row>
                  </div>
                  <p className="fr-card__title">
                    {event.title}
                    <Button title="Voir la dépeche" onClick={() => { window.open(event.sourceUrl, '_blank'); }} rounded borderless icon="ri-external-link-line" />
                  </p>
                  <Row className="fr-card__desc">
                    {event?.sourceName && <BadgeGroup className="fr-mt-1v"><Badge text={event.sourceName} /></BadgeGroup>}
                  </Row>
                  {event.summary && <div className="fr-card__desc">{event.summary}</div>}
                  <div className="fr-card__end">
                    {(event.relatedObjects.length > 1) && <Text spacing="mb-1w" bold>Autres objets associés :</Text>}
                    {event.relatedObjects && (
                      <TagList>
                        {event.relatedObjects
                          .filter((related) => (related.id !== resourceId))
                          .map((related) => <Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>)}
                      </TagList>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h2" look="h6">Actualité</BlocTitle>
      <BlocContent>{renderContent()}</BlocContent>
    </Bloc>
  );
}
