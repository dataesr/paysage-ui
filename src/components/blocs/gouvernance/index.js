import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import api from '../../../utils/api';
import ModifyCard from '../../card/modify-card';
import ExpendableListCards from '../../card/expendable-list-cards';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import GovernanceForm from './form';
import useFetch from '../../../hooks/useFetch';
import useBlocUrl from '../../../hooks/useBlocUrl';
import useNotice from '../../../hooks/useNotice';

export default function Gouvernance({ governanceGroupId }) {
  const { notice } = useNotice();
  const url = useBlocUrl(`relations-groups/${governanceGroupId}/relations`);
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const onSaveHandler = async (body, id = null) => {
    const method = id ? 'patch' : 'post';
    const saveUrl = id ? `${url}/${id}` : url;
    const response = await api[method](saveUrl, body)
      .catch(() => { notice({ content: "Une erreur s'est produite.", autoDismissAfter: 10000, type: 'error' }); });
    if (response.ok) {
      notice({ content: 'La relation a été ajoutée avec succès.', autoDismissAfter: 10000, type: 'success' });
      reload();
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (id) => {
    await api.delete(`${url}/${id}`).catch((e) => { console.log(e); });
    reload();
    setShowModal(false);
  };

  const onClickModifyHandler = (element) => {
    setModalTitle('Modification de gouvernance');
    setModalContent(
      <GovernanceForm
        data={element}
        onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    if (!governanceGroupId) { setModalTitle('Ajouter un gouvernant'); }
    setModalContent(<GovernanceForm onSaveHandler={onSaveHandler} />);
    setShowModal(true);
  };

  const renderCards = () => {
    if (!data && !data?.data?.length) return null;
    const list = data.data.map((element) => (
      <ModifyCard
        title={element.id}
        description={(
          <pre alignItems="middle">
            {JSON.stringify(element, null, 2)}
          </pre>
        )}
        onClick={() => onClickModifyHandler(element)}
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

Gouvernance.propTypes = {
  governanceGroupId: PropTypes.string,
};

Gouvernance.defaultProps = {
  governanceGroupId: null,
};
