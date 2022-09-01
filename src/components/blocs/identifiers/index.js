import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Col,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  Title,
} from '@dataesr/react-dsfr';
import PaysageSection from '../../sections/section';
import EmptySection from '../../sections/empty';
import IdentifierForm from './form';
import api from '../../../utils/api';
import { getEnumKey } from '../../../utils';
import TripleDotCard from '../../card/triple-dot-card';
import ClipboardCopy from '../../../utils/clipboard-copy';

export default function IdentifiersComponent({ apiObject, id }) {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [reloader, setReloader] = useState(0);

  const enumKey = getEnumKey(apiObject, 'identifiers');

  useEffect(() => {
    const getData = async () => {
      const response = await api
        .get(`/${apiObject}/${id}/identifiers`)
        .catch((e) => {
          console.log(e);
        });
      if (response.ok) setData(response.data);
    };
    getData();
    return () => {};
  }, [apiObject, id, reloader]);

  const onSaveHandler = async (body, identifierId = null) => {
    let method = 'post';
    let url = `/${apiObject}/${id}/identifiers`;

    if (identifierId) {
      method = 'patch';
      url += `/${identifierId}`;
    }

    const response = await api[method](url, body).catch((e) => {
      console.log(e);
    });

    if (response.ok) {
      setReloader(reloader + 1);
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (emailId) => {
    const url = `/${apiObject}/${id}/identifiers/${emailId}`;
    await api.delete(url).catch((e) => {
      console.log(e);
    });
    setReloader(reloader + 1);
    setShowModal(false);
  };

  const onClickModifyHandler = (genericEmail) => {
    setModalTitle("Modification d'un identifiant");
    setModalContent(
      <IdentifierForm
        data={genericEmail}
        onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
        enumKey={enumKey}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'un identifiant");
    setModalContent(<IdentifierForm onSaveHandler={onSaveHandler} enumKey={enumKey} />);
    setShowModal(true);
  };

  if (!data?.data) {
    return <PaysageSection dataPaysageMenu="Identifiants" id="identifiers" isEmpty />;
  }

  return (
    <PaysageSection dataPaysageMenu="Identifiants" id="identifiers">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Identifiants
          </Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={onClickAddHandler}
            size="sm"
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter un identifiant
          </Button>
        </Col>
      </Row>
      <Row>
        {data.data.length === 0 ? <EmptySection apiObject={apiObject} /> : null}
        {data.data.map((ident) => (
          <Col n="3" key={ident.id}>
            <TripleDotCard
              title={ident.type}
              description={<ClipboardCopy copyText={ident.value} />}
              onClick={() => onClickModifyHandler(ident)}
            />
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

IdentifiersComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
