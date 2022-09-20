import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Icon,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  Title,
} from '@dataesr/react-dsfr';
import Button from '../../button';
import useToast from '../../../hooks/useToast';
import DocumentCard from '../../card/document-card';
import DocumentForm from './form';
import ExpendableListCards from '../../card/expendable-list-cards';
import PaysageSection from '../../sections/section';
import api from '../../../utils/api';

export default function DocumentsComponent({ apiObject, id }) {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [reloader, setReloader] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const response = await api
        .get(
          `/documents?filters[relatesTo]=${id}`,
        )
        .catch(() => {
          toast({
            toastType: 'error',
            description: "Une erreur s'est produite",
          });
        });
      if (response.ok) setData(response.data);
    };
    getData();
    return () => {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiObject, id, reloader]);

  const onSaveHandler = async (
    body,
    // itemId = null,
  ) => {
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
      setReloader(reloader + 1);
      setShowModal(false);
    }
  };

  // const onDeleteHandler = async (itemId) => {
  //   const url = `/documents/${apiObject}/${id}/social-medias/${itemId}`;
  //   await api.delete(url).catch((e) => {
  //     console.log(e);
  //   });
  //   setReloader(reloader + 1);
  //   setShowModal(false);
  // };

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
    return <ExpendableListCards apiObject={apiObject} list={list} nCol="12 md-6" />;
  };

  if (!data?.data) {
    return (
      <PaysageSection dataPaysageMenu="Documents" id="documents" isEmpty />
    );
  }

  return (
    <PaysageSection dataPaysageMenu="Documents" id="documents">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Documents
          </Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={onClickAddHandler}
            size="sm"
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter un document
          </Button>
        </Col>
      </Row>
      <Row>
        {renderCards()}
      </Row>
      <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
        <ModalTitle>{modalTitle}</ModalTitle>
        <ModalContent>{modalContent}</ModalContent>
      </Modal>
    </PaysageSection>
  );
}

DocumentsComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
