import { useState } from 'react';
import {
  Col,
  Container,
  Icon,
  ModalContent,
  ModalTitle,
  Row,
  Text,
} from '@dataesr/react-dsfr';
import HistoDatesForm from './form';
import api from '../../../utils/api';
import Modal from '../../modal';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useBlocUrl from '../../../hooks/useBlocUrl';
import ModifyCard from '../../card/modify-card';
import { formatDescriptionDates } from '../../../utils/dates';

export default function HistoriqueEtDates() {
  const url = useBlocUrl('');
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const onSaveHandler = async (body) => {
    const response = await api.patch(url, body).catch((e) => { console.log(e); });
    if (response.ok) {
      reload();
      setShowModal(false);
    }
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'une donnée historique");
    setModalContent(<HistoDatesForm onSaveHandler={onSaveHandler} />);
    setShowModal(true);
  };

  const onClickModifyHandler = () => {
    setModalTitle("Modification d'une donnée historique");
    const body = {
      creationDate: data.creationDate || null,
      creationReason: data.creationReason || null,
      creationOfficialTextId: data.creationOfficialTextId || null,
      creationOfficialText: data.creationOfficialText || null,
      closureDate: data.closureDate || null,
      closureReason: data.closureReason || null,
      closureOfficialTextId: data.closureOfficialTextId || null,
      closureOfficialText: data.closureOfficialText || null,
    };
    setModalContent(
      <HistoDatesForm
        data={body}
        onSaveHandler={onSaveHandler}
      />,
    );
    setShowModal(true);
  };

  if (data?.creationDate || data?.closureDate) {
    data.totalCount = 1; // Pour la gestion de l'affichage dans "Bloc"
  }

  const renderCreationCard = () => {
    if (data?.creationDate) {
      return (
        <Col n="6">
          <ModifyCard
            title="Date de création"
            description={(
              <Row>
                <Col n="8">
                  <Text>
                    {formatDescriptionDates(data.creationDate)}
                    {(data.creationOfficialTextId) ? <Icon className="ri-medal-line fr-pl-2w" /> : null}
                  </Text>
                </Col>
                <Col>
                  <Text>{data.creationReason}</Text>
                </Col>
              </Row>
            )}
            onClick={() => onClickModifyHandler()}
          />
        </Col>
      );
    }
    return null;
  };

  const renderClosureCard = () => {
    if (data?.closureDate) {
      return (
        <Col n="6">
          <ModifyCard
            title="Date de fermeture"
            description={(
              <Row alignItems="middle">
                <Col n="8">
                  <Text>
                    {formatDescriptionDates(data.closureDate)}
                    {(data.closureOfficialTextId) ? <Icon className="ri-medal-line fr-pl-2w" /> : null}
                  </Text>
                </Col>
                <Col>
                  <Text>{data.closureReason}</Text>
                </Col>
              </Row>
            )}
            onClick={() => onClickModifyHandler()}
          />
        </Col>
      );
    }
    return null;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Historique & dates</BlocTitle>
      <BlocActionButton onClick={onClickAddHandler}>Ajouter une donnée historique</BlocActionButton>
      <BlocContent>
        <Container fluid>
          <Row gutters>
            {renderCreationCard()}
            {renderClosureCard()}
          </Row>
        </Container>
      </BlocContent>
      <BlocModal>
        <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalContent>{modalContent}</ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}

// creationReason
// creationDate
// creationOfficialTextId

// closureReason
// closureDate
// closureOfficialTextId

// descriptionEn
// descriptionFr
// structureStatus
