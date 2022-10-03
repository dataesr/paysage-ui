import { useState } from 'react';
import { Modal, ModalContent, ModalTitle, Row, Text } from '@dataesr/react-dsfr';
import EmailForm from './form';
import api from '../../../utils/api';
import ModifyCard from '../../card/modify-card';
import ExpendableListCards from '../../card/expendable-list-cards';
import CopyButton from '../../copy/copy-button';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useBlocUrl from '../../../hooks/useBlocUrl';
import useToast from '../../../hooks/useToast';

export default function EmailsComponent() {
  const { toast } = useToast();
  const { url } = useBlocUrl('emails');
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const onSaveHandler = async (body, id = null) => {
    const method = id ? 'patch' : 'post';
    const saveUrl = id ? `${url}/${id}` : url;
    const response = await api[method](saveUrl, body)
      .catch(() => {
        toast({
          toastType: 'error',
          description: "Une erreur s'est produite",
        });
      });
    if (response.ok) {
      toast({
        toastType: 'success',
        description: "L'adresse email à été ajoutée",
      });
      reload();
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (id) => {
    await api.delete(`${url}/${id}`)
      .catch(() => {
        toast({
          toastType: 'error',
          description: "Une erreur s'est produite",
        });
      });
    reload();
    setShowModal(false);
  };

  const onClickModifyHandler = (genericEmail) => {
    setModalTitle("Modification d'une boite email générique");
    setModalContent(
      <EmailForm
        data={genericEmail}
        onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'une boite email générique");
    setModalContent(<EmailForm onSaveHandler={onSaveHandler} />);
    setShowModal(true);
  };

  const renderCards = () => {
    if (!data) return null;
    const list = data.data.map((el) => (
      <ModifyCard
        title={el.emailType.usualName}
        description={(
          <Row alignItems="middle">
            <Text spacing="mr-1v mb-0">{el.email}</Text>
            <CopyButton title="Copier l'identifiant" copyText={el.email} />
          </Row>
        )}
        onClick={() => onClickModifyHandler(el)}
      />
    ));
    return <ExpendableListCards list={list} nCol="12 md-6" />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Boites emails génériques</BlocTitle>
      <BlocActionButton onClick={onClickAddHandler}>Ajouter un email générique</BlocActionButton>
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
