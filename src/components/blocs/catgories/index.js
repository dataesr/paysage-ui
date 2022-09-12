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
import useToast from '../../../hooks/useToast';
import api from '../../../utils/api';
import CategoryForm from './form';
import DeleteCard from '../../card/delete-card';
import ExpendableListCards from '../../card/expendable-list-cards';
import PaysageSection from '../../sections/section';

export default function NamesComponent({ apiObject, id }) {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [reloader, setReloader] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const response = await api
        .get(`/${apiObject}/${id}/categories`)
        .catch(() => {
          toast({
            toastType: 'error',
            description: "Une erreur s'est produite",
          });
        });
      if (response.ok) setData(response.data);
    };
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiObject, id, reloader]);

  const onSaveHandler = async (body, nameId = null) => {
    let method = 'post';
    let url = `/${apiObject}/${id}/categories`;

    if (nameId) {
      method = 'patch';
      url += `/${nameId}`;
    }

    const response = await api[method](url, body).catch(() => {
      toast({
        toastType: 'error',
        description: "Une erreur s'est produite",
      });
    });

    if (response.ok) {
      setReloader(reloader + 1);
      setShowModal(false);
    }
  };

  const onClickDeleteHandler = async (idCat) => {
    const url = `/${apiObject}/${id}/categories/${idCat}`;
    await api.delete(url).catch((e) => {
      console.log(e);
    });
    setReloader(reloader + 1);
    console.log('delete cat', idCat);
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'une catégorie");
    setModalContent(<CategoryForm onSaveHandler={onSaveHandler} />);
    setShowModal(true);
  };

  const formatDescriptionDates = (startDate = null, endDate = null) => {
    if (!startDate && !endDate) {
      return null;
    }
    if (!startDate && endDate) {
      return `jusqu'au ${endDate}`;
    }
    if (startDate && !endDate) {
      return `depuis le ${startDate}`;
    }
    if (startDate && endDate) {
      return `du ${startDate} au ${endDate}`;
    }
    return null;
  };

  const renderCards = () => {
    const list = data.data.map((el) => (
      <DeleteCard
        title={el.category.usualNameFr}
        description={formatDescriptionDates(el.startDate, el.endDate)}
        onClick={() => onClickDeleteHandler(el.id)}
      />
    ));
    return (
      <ExpendableListCards apiObject={apiObject} list={list} nCol="12 md-4" />
    );
  };

  if (!data?.data) {
    return <PaysageSection dataPaysageMenu="Categories" id="categories" isEmpty />;
  }

  return (
    <PaysageSection dataPaysageMenu="Categories" id="categories">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Catégories
          </Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={onClickAddHandler}
            size="sm"
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter une catégorie
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

NamesComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
