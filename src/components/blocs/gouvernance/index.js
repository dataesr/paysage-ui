import { useState } from 'react';
import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import api from '../../../utils/api';
import ModifyCard from '../../card/modify-card';
import ExpendableListCards from '../../card/expendable-list-cards';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import GovernanceForm from './form';
import useFetch from '../../../hooks/useFetch';
import useBlocUrl from '../../../hooks/useBlocUrl';

export default function Gouvernance({ governanceGroupId }) {
  const url = useBlocUrl('relations-groups');
  const { data, isLoading, error, reload } = useFetch(`${url}/${governanceGroupId}/relations`);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const onSaveHandler = async (body, id = null) => {
    const method = id ? 'patch' : 'post';
    const saveUrl = id ? `${ url }/${governanceGroupId}/relations/${id}` : `${url}/${governanceGroupId}/relations`;
    const response = await api[method](saveUrl, body).catch((e) => { console.log(e); });
    if (response.ok) {
      reload();
      setShowModal(false);
    }
  };

  // const onDeleteHandler = async (id) => {
  //   await api.delete(`${url}/${id}`).catch((e) => { console.log(e); });
  //   reload();
  //   setShowModal(false);
  // };

  // const onClickModifyHandler = () => {
  //   setModalTitle('Modification de gouvernance');
  //   setModalContent(
  //     <GovernanceForm
  //       data={genericEmail}
  //       onDeleteHandler={onDeleteHandler}
  //       onSaveHandler={onSaveHandler}
  //     />,
  //   );
  //   setShowModal(true);
  // };

  const onClickAddHandler = () => {
    setModalTitle('Ajout de gouvernant');
    setModalContent(<GovernanceForm onSaveHandler={onSaveHandler} />);
    setShowModal(true);
  };

  const renderCards = () => {
    if (!data && !data?.data?.length) return null;
    const list = data.data.map((el) => (
      <ModifyCard
        title={el.id}
        description={(
          <pre alignItems="middle">
            {JSON.stringify(el, null, 2)}
          </pre>
        )}
        // onClick={() => onClickModifyHandler(el)}
      />
    ));
    return <ExpendableListCards list={list} nCol="12 md-6" />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Gouvernance</BlocTitle>
      <BlocActionButton onClick={onClickAddHandler}>Ajouter un gouvernant</BlocActionButton>
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
