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
import InternalPageForm from './form';

export default function InternalPagesComponent({ apiObject, id }) {
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
      <InternalPageForm
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
      <InternalPageForm onSaveHandler={onSaveHandler} enumKey={enumKey} />,
    );
    setShowModal(true);
  };

  const internalPagesTypes = {
    website: 'Lien web',
    websiteRss: 'Flux RSS',
    websiteOrganizationChart: 'Page sur l\'organisation/organigramme',
    websiteGovernance: 'Page gouvernance',
    websiteGeneralServices: 'Page services généraux',
    websiteCommunication: 'Service communication',
    // Page avec le lien vers l'organigramme
    websiteSocialReport: 'Page bilan social',
    websiteActivityReport: 'Page rapport d\'activité',
    websitePress: 'Espace presse',
    websitenews: 'Actualités',
    websiteDirectory: 'Annuaire en ligne',
    websiteCatForm: 'Catalogue de formations',
    websiteAcademicComponents: 'Page liste des composantes',
    websiteHistory: 'Page histoire',
    websitePhotoLibrary: 'Photothèque',
    websiteNewsCast: 'websiteNewsCast',
  };
  const renderCards = () => {
    const list = data.data.filter((el) => Object.keys(internalPagesTypes).includes(el.type)).map((el) => (
      <WeblinkCard
        downloadUrl={el.url}
        onClick={() => onClickModifyHandler(el)}
        title={internalPagesTypes[el.type]}
        type={el.type}
      />
    ));
    return <ExpendableListCards apiObject={apiObject} list={list} nCol="12 md-4" order={Object.keys(internalPagesTypes)} sortOn="props.type" />;
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
            Pages internes
          </Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={onClickAddHandler}
            size="sm"
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter une page interne
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

InternalPagesComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
