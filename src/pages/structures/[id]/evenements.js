import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, BadgeGroup, Modal, ModalContent, ModalTitle, Row, Tag, TagGroup, Text } from '@dataesr/react-dsfr';
import useEditMode from '../../../hooks/useEditMode';
import useFetch from '../../../hooks/useFetch';
import useHashScroll from '../../../hooks/useHashScroll';
import useNotice from '../../../hooks/useNotice';

import api from '../../../utils/api';
import { saveError, saveSuccess, deleteError, deleteSuccess } from '../../../utils/notice-contents';
import { parseRelatedObject } from '../../../utils/parse-related-element';

import {
  Bloc, BlocContent, BlocActionButton, BlocTitle, BlocModal,
} from '../../../components/bloc';
import Button from '../../../components/button';
import { Download } from '../../../components/download';
import EventForm from '../../../components/forms/event';
import { Timeline, TimelineItem } from '../../../components/timeline';

export default function StructureEvenementsPage() {
  const { editMode } = useEditMode();
  const { id: resourceId } = useParams();
  const navigate = useNavigate();
  const url = `/follow-ups?filters[relatesTo]=${resourceId}&sort=-eventDate&limit=50`;
  const { data, isLoading, error, reload } = useFetch(url);
  const { notice } = useNotice();
  useHashScroll();
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const saveEvent = (body, id = null) => {
    const method = id ? 'patch' : 'post';
    const saveUrl = id ? `/follow-ups/${id}` : '/follow-ups';
    api[method](saveUrl, body)
      .then(() => { reload(); notice(saveSuccess); setIsOpen(false); })
      .catch(() => notice(saveError));
  };

  const deleteEvent = (id) => api.delete(`/follow-ups/${id}`)
    .then(() => { reload(); notice(deleteSuccess); setIsOpen(false); })
    .catch(() => notice(deleteError));

  const onOpenModalHandler = (element) => {
    // Transform relatedObjects to use as managment value inside the form
    const relatedObjects = element?.relatedObjects?.length
      ? element?.relatedObjects.filter((rel) => rel.id !== resourceId).map((rel) => parseRelatedObject(rel))
      : [];
    setModalTitle(element?.id ? "Modifier l'évènement" : 'Ajouter un évènement');
    setModalContent(
      <EventForm
        id={element?.id}
        initialForm={element?.id ? { ...element, relatedObjects, currentObjectId: resourceId } : { type: 'suivi', currentObjectId: resourceId }}
        onDelete={deleteEvent}
        onSave={saveEvent}
      />,
    );
    setIsOpen(true);
  };

  const renderContent = () => {
    if (!data || !data.data.length) return null;
    return (
      <Timeline>
        {data.data.map((event) => (
          <TimelineItem date={event.eventDate} key={event.id}>
            <Row className="flex--space-between">
              <BadgeGroup><Badge text={event.type} /></BadgeGroup>
              {editMode && <Button onClick={() => onOpenModalHandler(event)} size="sm" icon="ri-edit-line" title="Editer l'évènement" tertiary borderless rounded />}
            </Row>
            <Text spacing="mb-1w" size="lead" bold>{event.title}</Text>
            {event.description && <Text spacing="mb-1w">{event.description}</Text>}
            {event.relatedObjects && (
              <TagGroup>
                {event.relatedObjects.map((related) => {
                  const { name: relatedName, url: relatedUrl, id: relatedId } = parseRelatedObject(related);
                  return <Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(relatedUrl)} key={relatedId}>{relatedName}</Tag>;
                })}
              </TagGroup>
            )}
            {(event?.files?.length > 0) && (
              <>
                <Text spacing="mb-1w" bold>Documents associés à l'évènement : </Text>
                <Row>{event.files.map((file) => (<Download key={file.url} file={file} />))}</Row>
              </>
            )}
          </TimelineItem>
        ))}
      </Timeline>
    );
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Évènements</BlocTitle>
      <BlocActionButton onClick={() => onOpenModalHandler()}>
        Ajouter un évènement
      </BlocActionButton>
      <BlocContent>{renderContent()}</BlocContent>
      <BlocModal>
        <Modal isOpen={isOpen} size="lg" hide={() => setIsOpen(false)}>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalContent>{modalContent}</ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}
