import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, BadgeGroup, Modal, ModalContent, ModalTitle, Row, Tag, TagGroup, Text } from '@dataesr/react-dsfr';
import useEditMode from '../../hooks/useEditMode';
import useFetch from '../../hooks/useFetch';
import useHashScroll from '../../hooks/useHashScroll';
import useNotice from '../../hooks/useNotice';

import api from '../../utils/api';
import { saveError, saveSuccess, deleteError, deleteSuccess } from '../../utils/notice-contents';

import {
  Bloc, BlocContent, BlocActionButton, BlocTitle, BlocModal,
} from '../bloc';
import Button from '../button';
import OfficialTextForm from '../forms/official-text';
import { Timeline, TimelineItem } from '../timeline';

export default function OfficialTextOutlet() {
  const { editMode } = useEditMode();
  const { id: resourceId } = useParams();
  const navigate = useNavigate();
  const url = `/official-texts?filters[relatesTo]=${resourceId}&sort=-publicationDate&limit=50`;
  const { data, isLoading, error, reload } = useFetch(url);
  const { notice } = useNotice();
  useHashScroll();
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const saveOfficialText = async (body, id) => {
    const method = id ? 'patch' : 'post';
    const saveUrl = id ? `/official-texts/${id}` : '/official-texts';
    await api[method](saveUrl, body)
      .then(() => { reload(); notice(saveSuccess); setIsOpen(false); })
      .catch(() => notice(saveError));
  };

  const deleteOfficialText = (id) => api.delete(`/official-texts/${id}`)
    .then(() => { reload(); notice(deleteSuccess); setIsOpen(false); })
    .catch(() => notice(deleteError));

  const onOpenModalHandler = (element) => {
    // Transform relatedObjects to use as managment value inside the form
    const relatedObjects = element?.relatedObjects?.length
      ? element?.relatedObjects.filter((rel) => rel.id !== resourceId)
      : [];
    setModalTitle(element?.id ? 'Modifier le document' : 'Ajouter un document');
    setModalContent(
      <OfficialTextForm
        id={element?.id}
        data={element?.id ? { ...element, relatedObjects, currentObjectId: resourceId } : { currentObjectId: resourceId }}
        onDelete={deleteOfficialText}
        onSave={saveOfficialText}
      />,
    );
    setIsOpen(true);
  };

  const renderContent = () => {
    if (!data || !data.data.length) return null;
    return (
      <Timeline>
        {data.data.map((event) => (
          <TimelineItem date={event.publicationDate} key={event.id}>
            <Row className="flex--space-between">
              <BadgeGroup><Badge text={event.type} /></BadgeGroup>
              {editMode && <Button onClick={() => onOpenModalHandler(event)} size="sm" icon="ri-edit-line" title="Editer l'évènement" tertiary borderless rounded />}
            </Row>
            <Text spacing="mb-1w" size="lead" bold>{event.title}</Text>
            {event.description && <Text spacing="mb-1w">{event.description}</Text>}
            {event.relatedObjects && (
              <TagGroup>
                {event.relatedObjects.map((related) => <Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>)}
              </TagGroup>
            )}
          </TimelineItem>
        ))}
      </Timeline>
    );
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h2" look="h6">Texte officiel</BlocTitle>
      <BlocActionButton onClick={() => onOpenModalHandler()}>
        Ajouter un texte officiel
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
