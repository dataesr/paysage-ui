import {
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  Text,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';

import IdentifierForm from './form';
import ExpendableListCards from '../../card/expendable-list-cards';
import ModifyCard from '../../card/modify-card';
import CopyButton from '../../copy/copy-button';
import { getEnumKey } from '../../../utils';
import api from '../../../utils/api';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useBlocUrl from '../../../hooks/useBlocUrl';

export default function IdentifiersComponent({ apiObject }) {
  const url = useBlocUrl('identifiers');
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const enumKey = getEnumKey(apiObject, 'identifiers');

  const onSaveHandler = async (body) => {
    const method = body.id ? 'patch' : 'post';
    const saveUrl = body.id ? `${url}/${body.id}` : url;
    const response = await api[method](saveUrl, body).catch((e) => { console.log(e); });
    if (response.ok) {
      reload();
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (itemId) => {
    await api.delete(`${url}/${itemId}`).catch((e) => { console.log(e); });
    reload();
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
    if (!data) return null;
    const list = data.data.map((el) => (
      <ModifyCard
        title={el.type}
        description={(
          <Row alignItems="middle">
            <Text spacing="mr-1v mb-0">{el.value}</Text>
            <CopyButton title="Copier l'identifiant" copyText={el.value} />
          </Row>
        )}
        onClick={() => onClickModifyHandler(el)}
      />
    ));
    return <ExpendableListCards apiObject={apiObject} list={list} />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Identifiants</BlocTitle>
      <BlocActionButton onClick={onClickAddHandler}>Ajouter un identifiant</BlocActionButton>
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

IdentifiersComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
};
