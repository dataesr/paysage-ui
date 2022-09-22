import {
  Col,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  Title,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Button from '../../button';
import ExpendableListCards from '../../card/expendable-list-cards';
import WeblinkCard from '../../card/weblink-card';
import PaysageSection from '../../sections/section';
import { getEnumKey } from '../../../utils';
import api from '../../../utils/api';
import WeblinkForm from './form';

export default function WeblinksComponent({ apiObject, id }) {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [reloader, setReloader] = useState(0);

  const enumKey = getEnumKey(apiObject, 'weblinks');

  useEffect(() => {
    const getData = async () => {
      const response = await api
        .get(`/${apiObject}/${id}/weblinks`)
        .catch((e) => {
          console.log(e);
        });
      if (response.ok) setData(response.data);
    };
    getData();
    return () => {};
  }, [apiObject, id, reloader]);

  const onSaveHandler = async (body, itemId = null) => {
    let method = 'post';
    let url = `/${apiObject}/${id}/weblinks`;

    if (itemId) {
      method = 'patch';
      url += `/${itemId}`;
    }

    const response = await api[method](url, body).catch((e) => {
      console.log(e);
    });

    if (response.ok) {
      setReloader(reloader + 1);
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (itemId) => {
    const url = `/${apiObject}/${id}/weblinks/${itemId}`;
    await api.delete(url).catch((e) => {
      console.log(e);
    });
    setReloader(reloader + 1);
    setShowModal(false);
  };

  const onClickModifyHandler = (oneData) => {
    setModalTitle("Modification d'un lien web");
    setModalContent(
      <WeblinkForm
        data={oneData}
        onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
        enumKey={enumKey}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'un lien web");
    setModalContent(
      <WeblinkForm onSaveHandler={onSaveHandler} enumKey={enumKey} />,
    );
    setShowModal(true);
  };

  const weblinksTypes = {
    Hal: 'Portail HAL',
    Onisep: 'Page Onisep.fr',
    POpenData: 'Plateforme Opendata',
    DataGouvFr: 'Page sur data.gouv.fr',
    scanR: 'Page scanR',
    mooc: 'Compte FUN',
    CanalU: 'Canal-U',
    ServicePublic: 'Annuaire service public',
    // 'Sujet d\'actualités sue le site web du journal Le Monde'
    EdCF: 'Annuaire des écoles doctorales, campus France',
    OE1: 'Editeur chez openedition',
    OE2: 'Revues chez openedition',
    OE3: 'Carnets Hypotheses OpenEdition',
    hceres: 'Page HCERES',
    EducPros: 'EducPros',
    IUF: 'IUF',
    jorfsearch: 'jorfsearch',
    TalentCNRS: 'TalentCNRS',
    TheConversation: 'TheConversation',
  };
  const renderCards = () => {
    const list = data.data.filter((el) => Object.keys(weblinksTypes).includes(el.type)).map((el) => (
      <WeblinkCard
        downloadUrl={el.url}
        onClick={() => onClickModifyHandler(el)}
        title={weblinksTypes[el.type]}
        type={el.type}
      />
    ));
    return <ExpendableListCards apiObject={apiObject} list={list} nCol="12 md-4" order={Object.keys(weblinksTypes)} sortOn="props.type" />;
  };

  if (!data?.data) {
    return (
      <PaysageSection dataPaysageMenu="Liens web" id="weblinks" isEmpty />
    );
  }

  return (
    <PaysageSection dataPaysageMenu="Liens web" id="weblinks">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Liens web
          </Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={onClickAddHandler}
            size="sm"
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter un lien web
          </Button>
        </Col>
      </Row>
      {renderCards()}
      <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
        <ModalTitle>{modalTitle}</ModalTitle>
        <ModalContent>{modalContent}</ModalContent>
      </Modal>
    </PaysageSection>
  );
}

WeblinksComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
