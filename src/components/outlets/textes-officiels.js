import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, BadgeGroup, Modal, ModalContent, ModalTitle, Row, Tag, Text } from '@dataesr/react-dsfr';
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
import TagList from '../tag-list';

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
            {editMode && <Button onClick={() => onOpenModalHandler(event)} icon="ri-edit-line" title="Editer l'évènement" tertiary borderless rounded className="edit-button" />}
            <Row className="flex--last-baseline">
              <BadgeGroup isInlineFrom="xs" size="sm">
                <Badge text={event.nature} colorFamily="purple-glycine" />
                <Badge text={event.type} />
              </BadgeGroup>
            </Row>
            <Text spacing="mb-1w">
              <Text as="span" spacing="mr-1w" size="lead" bold>
                {event.title}
                <Button title="Afficher la page Paysage du texte officiel" onClick={() => navigate(`/textes-officiels/${event.id}`)} rounded borderless icon="ri-arrow-right-line" />
                <Button title="Accéder à la page du texte officiel" onClick={() => { window.open(event.pageUrl, '_blank'); }} rounded borderless icon="ri-external-link-line" />
              </Text>
            </Text>
            {event.description && <Text spacing="mb-1w">{event.description}</Text>}
            <TagList maxTags={3}>
              {event.relatedObjects.map(
                (related) => (<Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>),
              )}
            </TagList>
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
