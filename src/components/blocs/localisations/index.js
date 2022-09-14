import { useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Col, Container, Modal, ModalContent, ModalTitle, Row, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import api from '../../../utils/api';
import Map from '../../map';
import LocalisationForm from './form';
import PaysageSection from '../../sections/section';
import EmptySection from '../../sections/empty';
import Button from '../../button';
import HistoriqueLocalisation from './historique-localisation';

export default function LocalisationsComponent({ id, apiObject, currentLocalisation }) {
  const route = `/${apiObject}/${id}/localisations`;
  const { data, isLoading, error, reload } = useFetch(route);
  const [isOpen, setIsOpen] = useState();
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const handleSave = async (localisationId, body) => {
    const method = id ? 'patch' : 'post';
    const url = id ? `${route}/${localisationId}` : route;
    const response = await api[method](url, body);
    if (response.ok) {
      reload();
      setIsOpen(false);
    }
    console.log('save', localisationId, body);
  };

  const handleDelete = async (localisationId) => {
    // if (!id) return;
    // const response = await api.delete(`${route}/${id}`);
    // if (response.ok) {
    //   reload();
    //   setIsOpen(false);
    // }
    console.log('delete', localisationId);
  };

  const handleModalToggle = (item = {}, target = 'localisationForm') => {
    console.log('handleModalToggle', item);

    if (target === 'historique') {
      setModalTitle('Historiques des adresses');
      setModalContent(
        <HistoriqueLocalisation
          currentLocalisationId={currentLocalisation.id || null}
          data={data}
        />,
      );
    } else {
      setModalTitle(item?.id ? 'Modifier' : 'Ajouter');
      setModalContent(
        <LocalisationForm
          data={item}
          onDeleteHandler={handleDelete}
          onSaveHandler={handleSave}
        />,
      );
    }
    setIsOpen(true);
  };

  if (error) return <div>Erreur</div>;
  if (isLoading) return <div>Chargement</div>;
  return (
    <PaysageSection dataPaysageMenu="Localisation" id="localisations">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Localisation
          </Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={() => handleModalToggle()}
            size="sm"
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter une adresse
          </Button>
        </Col>
      </Row>
      {Object.keys(currentLocalisation).length === 0 ? (
        <EmptySection apiObject={apiObject} />
      ) : null}
      {currentLocalisation?.geometry?.coordinates ? (
        <Row>
          <Col>
            <Map
              lat={currentLocalisation?.geometry?.coordinates[1]}
              lng={currentLocalisation?.geometry?.coordinates[0]}
              markers={[
                {
                  address: currentLocalisation.address,
                  latLng: [
                    currentLocalisation?.geometry?.coordinates[1],
                    currentLocalisation?.geometry?.coordinates[0],
                  ],
                },
              ]}
            />
          </Col>
        </Row>
      ) : null}
      {currentLocalisation?.address ? (
        <Container fluid>
          <Row>
            <Col>
              {currentLocalisation.address}
              {`${currentLocalisation.locality} - ${currentLocalisation.postalCode}`}
            </Col>
            <Col className="text-right">
              <Row className="fr-pt-2w">
                <ButtonGroup size="sm" isInlineFrom="md">
                  <Button className="fr-mr-1w" secondary onClick={() => handleModalToggle(currentLocalisation)}>
                    Corriger l'adresse actuelle
                  </Button>
                  <Button secondary color="text" onClick={() => handleModalToggle(null, 'historique')}>
                    Voir l'historique
                  </Button>
                </ButtonGroup>
              </Row>
            </Col>
          </Row>
        </Container>
      ) : null}
      <Modal size="lg" isOpen={isOpen} hide={() => setIsOpen(false)}>
        <ModalTitle>
          {modalTitle}
        </ModalTitle>
        <ModalContent>
          {modalContent}
        </ModalContent>
      </Modal>
    </PaysageSection>
  );
}

LocalisationsComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  currentLocalisation: PropTypes.object.isRequired,
};
