import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import useEditMode from '../../../hooks/useEditMode';
import useFetch from '../../../hooks/useFetch';
import useNotice from '../../../hooks/useNotice';

import api from '../../../utils/api';
import { saveError, saveSuccess, deleteError, deleteSuccess } from '../../../utils/notice-contents';

import { Bloc, BlocContent, BlocActionButton, BlocTitle, BlocModal } from '../../bloc';
import { Timeline } from '../../timeline';
import OfficialTextForm from './components/official-text-form';
import OfficialTextTimelineItem from './components/official-text-timeline-item';

export default function ObjectsOfficialTexts() {
  const { editMode } = useEditMode();
  const { id: resourceId } = useParams();
  const url = `/official-texts?filters[relatesTo]=${resourceId}&sort=-publicationDate&limit=500`;
  const { data, isLoading, error, reload } = useFetch(url);
  const { notice } = useNotice();
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const onSave = async (body, id) => {
    const method = id ? 'patch' : 'post';
    const saveUrl = id ? `/official-texts/${id}` : '/official-texts';
    await api[method](saveUrl, body)
      .then(() => { reload(); notice(saveSuccess); setIsOpen(false); })
      .catch(() => notice(saveError));
  };

  const onDelete = (id) => api.delete(`/official-texts/${id}`)
    .then(() => { reload(); notice(deleteSuccess); setIsOpen(false); })
    .catch(() => notice(deleteError));

  const onOpenForm = (element) => {
    const relatedObjects = element?.relatedObjects?.length
      ? element?.relatedObjects.filter((rel) => rel.id !== resourceId)
      : [];
    setModalTitle(element?.id ? 'Modifier le document' : 'Ajouter un document');
    setModalContent(
      <OfficialTextForm
        id={element?.id}
        data={element?.id ? { ...element, relatedObjects, currentObjectId: resourceId } : { currentObjectId: resourceId }}
        onDelete={onDelete}
        onSave={onSave}
      />,
    );
    setIsOpen(true);
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h2" look="h6">Texte officiel</BlocTitle>
      <BlocActionButton onClick={() => onOpenForm()}>
        Ajouter un texte officiel
      </BlocActionButton>
      <BlocContent>
        {data?.data?.length && (
          <Timeline>
            {data.data.map((text) => (
              <OfficialTextTimelineItem data={text} key={text.id} onEdit={editMode ? onOpenForm : null} />
            ))}
          </Timeline>
        )}
      </BlocContent>
      <BlocModal>
        <Modal isOpen={isOpen} size="lg" hide={() => setIsOpen(false)}>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalContent>{modalContent}</ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}
