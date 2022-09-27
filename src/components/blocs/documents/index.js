import { useState } from 'react';
import {
  Icon,
  Modal,
  ModalContent,
  ModalTitle,
} from '@dataesr/react-dsfr';
import { useParams } from 'react-router-dom';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useToast from '../../../hooks/useToast';
import DocumentCard from '../../card/document-card';
import DocumentForm from './form';
import ExpendableListCards from '../../card/expendable-list-cards';
import api from '../../../utils/api';
import useFetch from '../../../hooks/useFetch';

export default function DocumentsComponent() {
  const { toast } = useToast();
  const { id } = useParams();
  const { data, isLoading, error, reload } = useFetch(`/documents?filters[relatesTo]=${id}`);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const onSaveHandler = async (body) => {
    const formData = new FormData();
    formData.append('documentTypeId', body.type);
    if (body.title) formData.append('title', body.title);
    if (body.description) formData.append('description', body.description);
    formData.append('file', body.file);
    formData.append('relatesTo[]', id);
    if (body.startDate) formData.append('startDate', body.startDate);
    if (body.endDate) formData.append('endDate', body.endDate);

    const response = await api.post('/documents', formData, { 'Content-Type': 'multipart/form-data' })
      .catch(() => {
        toast({
          toastType: 'error',
          description: "Une erreur s'est produite",
        });
      });

    if (response.ok) {
      toast({
        toastType: 'success',
        description: 'Le document à été ajouté',
      });
      reload();
      setShowModal(false);
    }
  };

  const onClickModifyHandler = (oneData) => {
    setModalTitle("Modification d'un document");
    setModalContent(
      <DocumentForm
        data={oneData}
        // onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'un document");
    setModalContent(
      <DocumentForm onSaveHandler={onSaveHandler} />,
    );
    setShowModal(true);
  };

  const renderIcon = (mimeType) => {
    let iconName = 'ri-file-fill';
    let color = '--grey-main-525';

    switch (mimeType) {
    case 'image/png':
    case 'image/jpeg':
      iconName = 'ri-image-fill';
      color = 'var(--green-archipel-main-557)';
      break;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      iconName = 'ri-file-word-fill';
      color = 'var(--blue-ecume-main-400)';
      break;
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      iconName = 'ri-file-excel-fill';
      color = 'var(--green-emeraude-main-632)';
      break;
    case 'application/pdf':
      iconName = 'ri-file-pdf-fill';
      color = 'var(--error-main-525)';
      break;

    default:
      break;
    }
    return <Icon name={iconName} size="4x" color={color} />;
  };

  const renderCards = () => {
    const list = data.data.map((doc) => (
      <DocumentCard
        title={doc.documentType?.usualName}
        onClick={() => onClickModifyHandler(doc)}
        descriptionElement={doc.title}
        iconElement={renderIcon(doc.mimetype)}
        downloadUrl={doc.url}
      />
    ));
    return <ExpendableListCards list={list} nCol="12 md-6" />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Documents</BlocTitle>
      <BlocActionButton onClick={onClickAddHandler}>Ajouter un document</BlocActionButton>
      <BlocContent>{renderCards()}</BlocContent>
      <BlocModal>
        <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalContent>{modalContent}</ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}
