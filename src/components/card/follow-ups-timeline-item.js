import PropTypes from 'prop-types';
import { Badge, BadgeGroup, Download, Row, Tag, Text } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import useEditMode from '../../hooks/useEditMode';
import { getComparableNow } from '../../utils/dates';
import Button from '../button';
import TagList from '../tag-list';
import { TimelineItem } from '../timeline';

export default function FollowUpTimelineItem({ event, onEdit }) {
  const { editMode } = useEditMode();
  const navigate = useNavigate();
  const { eventDate, type, title, description, relatedObjects, files } = event;
  return (
    <TimelineItem date={eventDate}>
      <Row className="flex--space-between">
        <BadgeGroup>
          <Badge text={type} />
          {eventDate < getComparableNow() ? (
            <div className="fr-card__start ">
              <Badge text="terminé" colorFamily="brown-opera" />
            </div>
          ) : (
            <div>
              <Badge text="A venir" type="info" />
            </div>
          )}
        </BadgeGroup>
        {(editMode && onEdit) && <Button onClick={() => onEdit(event)} size="sm" icon="ri-edit-line" title="Editer l'évènement" tertiary borderless rounded />}
      </Row>
      <Text spacing="mb-1w" size="lead" bold>{title}</Text>
      {description && <Text spacing="mb-1w">{description}</Text>}
      {relatedObjects && (
        <TagList>
          {relatedObjects.map((related) => <Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>)}
        </TagList>
      )}
      {(event?.files?.length > 0) && (
        <>
          <Text spacing="mb-1w" bold>Fichiers associés à l'évènement : </Text>
          <Row>{files.map((file) => (<Download key={file.url} file={file} />))}</Row>
        </>
      )}
    </TimelineItem>
  );
}

FollowUpTimelineItem.propTypes = {
  event: PropTypes.shape.isRequired,
  onEdit: PropTypes.func,
};

FollowUpTimelineItem.defaultProps = {
  onEdit: null,
};
