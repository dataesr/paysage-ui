import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardDescription,
  Col,
  Icon,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  Text,
  Title,
} from '@dataesr/react-dsfr';
import PaysageSection from '../../Sections/section';
import EmptySection from '../../Sections/empty';
import DocumentForm from './form';
import api from '../../../utils/api';

export default function DocumentsComponent({ apiObject, id }) {
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
        .catch((e) => {
          console.log(e);
        });
      if (response.ok) setData(response.data);
    };
    getData();
    return () => {};
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
    if (body.eEndDate) formData.append('endDate', body.eEndDate);

    const response = await api.post('/documents', formData, { 'Content-Type': 'multipart/form-data' })
      .catch((e) => {
        console.log(e);
      });

    console.log('response', response);

    if (response.ok) {
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
      color = '--green-archipel-main-557';
      break;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      iconName = 'ri-file-word-fill';
      color = '--blue-ecume-main-400';
      break;
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      iconName = 'ri-file-excel-fill';
      color = '--green-emeraude-main-632';
      break;
    case 'application/pdf':
      iconName = 'ri-file-pdf-fill';
      color = '--error-main-525';
      break;

    default:
      break;
    }

    return <Icon name={iconName} size="5x" color={color} />;
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
        {data.data.length === 0 ? <EmptySection apiObject={apiObject} /> : null}
        {data.data.map((doc) => (
          <Col n="6" key={doc.id}>
            <Card hasArrow={false} onClick={() => onClickModifyHandler(doc)}>
              <CardDescription>
                <Row>
                  <Col n="4">
                    <div>{renderIcon(document.mimetype)}</div>
                    <div>
                      <a
                        href={document.url}
                        target="_blank"
                        title={`téléchargement du fichier : ${document.title}`}
                        rel="noreferrer"
                      >
                        Télécharger
                      </a>
                    </div>
                  </Col>
                  <Col>
                    <h3>{document.documentType.usualName}</h3>
                    {document.startDate ? `${document.startDate}` : null}
                    {document.endDate ? ` - ${document.endDate}` : null}
                    <Text size="md">{document.title}</Text>
                    <Text size="sm">{document.description}</Text>
                  </Col>
                </Row>
              </CardDescription>
            </Card>
          </Col>
        ))}
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
