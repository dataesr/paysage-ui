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
import IdentifierForm from './form';
import api from '../../../utils/api';
import { getEnumKey } from '../../../utils';
import ModifyCard from '../../card/modify-card';
import ClipboardCopy from '../../../utils/clipboard-copy';
import ExpendableListCards from '../../card/expendable-list-cards';

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

  const renderCards = () => {
    const list = data.data.map((ident) => (
      <ModifyCard
        title={ident.type}
        description={<ClipboardCopy copyText={ident.value} />}
        onClick={() => onClickModifyHandler(ident)}
      />
    ));
    return <ExpendableListCards apiObject={apiObject} list={list} />;
    // if (data.data.length === 0) return <EmptySection apiObject={apiObject} />;
    // if (data.data.length === max) {
    //   return data.data.map((ident) => (
    //     <Col n="12 md-4" key={ident.id} className="fr-p-1w">
    //       <ModifyCard
    //         title={ident.type}
    //         description={<ClipboardCopy copyText={ident.value} />}
    //         onClick={() => onClickModifyHandler(ident)}
    //       />
    //     </Col>
    //   ));
    // }
    // return (
    //   <>
    //     {data.data.slice(0, max - 1).map((ident) => (
    //       <Col n="12 md-4" key={ident.id} className="fr-p-1w">
    //         <ModifyCard
    //           title={ident.type}
    //           description={<ClipboardCopy copyText={ident.value} />}
    //           onClick={() => onClickModifyHandler(ident)}
    //         />
    //       </Col>
    //     ))}
    //     <Col n="12 md-4" className="fr-p-1w">
    //       voir les autres
    //     </Col>
    //   </>
    // );
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
        {renderCards()}
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
