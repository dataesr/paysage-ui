import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Badge, BadgeGroup, Row, Tag, Text } from '@dataesr/react-dsfr';
import Button from '../../../button';
import { TimelineItem } from '../../../timeline';
import TagList from '../../../tag-list';

export default function OfficialTextTimelineItem({ data, onEdit }) {
  const navigate = useNavigate();
  console.log(data);
  if (!data) return null;
  const { publicationDate, nature, type, title, id, pageUrl, description, relatedObjects } = data;
  return (
    <TimelineItem date={publicationDate}>
      {onEdit && <Button onClick={() => onEdit(data)} icon="ri-edit-line" title="Editer l'évènement" tertiary borderless rounded className="edit-button" />}
      <Row className="flex--last-baseline">
        <BadgeGroup isInlineFrom="xs" size="sm">
          <Badge text={nature} colorFamily="purple-glycine" />
          <Badge text={type} />
        </BadgeGroup>
      </Row>
      <Text spacing="mb-1w">
        <Text as="span" spacing="mr-1w" size="lead" bold>
          {title}
          <Button title="Afficher la page Paysage du texte officiel" onClick={() => navigate(`/textes-officiels/${id}`)} rounded borderless icon="ri-arrow-right-line" />
          <Button title="Accéder à la page du texte officiel" onClick={() => { window.open(pageUrl, '_blank'); }} rounded borderless icon="ri-external-link-line" />
        </Text>
      </Text>
      {description && <Text spacing="mb-1w">{description}</Text>}
      <TagList maxTags={3}>
        {relatedObjects.map(
          (related) => (<Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>),
        )}
      </TagList>
    </TimelineItem>
  );
}
OfficialTextTimelineItem.propTypes = {
  data: PropTypes.object,
  onEdit: PropTypes.func,
};
OfficialTextTimelineItem.defaultProps = {
  data: null,
  onEdit: null,
};
