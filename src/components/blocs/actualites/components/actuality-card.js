import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Badge, BadgeGroup, Col, Row, Tag, Text } from '@dataesr/react-dsfr';
import TagList from '../../../tag-list';
import Button from '../../../button';

export default function ActualityCard({ data, resourceId }) {
  const navigate = useNavigate();
  const { publicationDate, title, sourceUrl, sourceName, summary, relatedObjects } = data;
  return (
    <Col n="12">
      <div className="fr-card fr-card--xs fr-card--shadow">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div className="fr-card__start">
              <Row className="flex--space-between">
                <BadgeGroup>
                  <Badge type="new" text={publicationDate} />
                </BadgeGroup>
              </Row>
            </div>
            <p className="fr-card__title">
              {title}
              <Button title="Voir la dépeche" onClick={() => { window.open(sourceUrl, '_blank'); }} rounded borderless icon="ri-external-link-line" />
            </p>
            <Row className="fr-card__desc">
              {sourceName && <BadgeGroup className="fr-mt-1v"><Badge text={sourceName} /></BadgeGroup>}
            </Row>
            {summary && <div className="fr-card__desc">{summary}</div>}
            <div className="fr-card__end">
              {(relatedObjects.length > 1) && <Text spacing="mb-1w" bold>Autres objets associés :</Text>}
              {relatedObjects && (
                <TagList>
                  {relatedObjects
                    .filter((related) => (related.id !== resourceId))
                    .map((related) => <Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>)}
                </TagList>
              )}
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
}
ActualityCard.propTypes = {
  data: PropTypes.object,
  resourceId: PropTypes.object,
};
ActualityCard.defaultProps = {
  data: null,
  resourceId: null,
};
