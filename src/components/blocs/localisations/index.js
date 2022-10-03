import { useState } from 'react';
import { Col, Container, Icon, ModalContent, ModalTitle, Row, Tab, Tabs, Tile } from '@dataesr/react-dsfr';
import Modal from '../../modal';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import api from '../../../utils/api';
import { formatDescriptionDates } from '../../../utils/dates';
import Map from '../../map';
import LocalisationForm from './form';
import Button from '../../button';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useToast from '../../../hooks/useToast';

import styles from './styles.module.scss';

export default function LocalisationsComponent() {
  const { toast } = useToast();
  const { url: route } = useUrl('localisations');
  const { data, isLoading, error, reload } = useFetch(route);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const handleSave = async (localisationId, body) => {
    const method = localisationId ? 'patch' : 'post';
    const url = localisationId ? `${route}/${localisationId}` : route;
    const response = await api[method](url, body)
      .catch(() => {
        toast({
          toastType: 'error',
          description: "Une erreur s'est produite",
        });
      });
    if (response.ok) {
      toast({
        toastType: 'success',
        description: "L'adresse a été ajoutée",
      });
      reload();
      setShowModal(false);
    }
  };

  const handleDelete = async (localisationId) => {
    if (!localisationId) return;
    const response = await api.delete(`${route}/${localisationId}`);
    if (response.ok) {
      toast({
        toastType: 'success',
        description: "L'adresse a été supprimée",
      });
      reload();
      setShowModal(false);
    }
  };

  const handleModalToggle = (item = {}) => {
    setModalTitle(item?.id ? 'Modifier' : 'Ajouter');
    setModalContent(
      <LocalisationForm
        data={item}
        onDeleteHandler={handleDelete}
        onSaveHandler={handleSave}
      />,
    );

    setShowModal(true);
  };

  const renderAdress = (localisation) => (
    <Tile className={`${styles.Tile} show-bt-on-over`}>
      <Container fluid>
        <Row>
          <Col className="fr-p-2w">
            <p>
              <b><i>{formatDescriptionDates(localisation.startDate || null, localisation.endDate || null)}</i></b>
              <div>
                <Icon className="ri-map-pin-fill fr-pr-1w" />
                {`${localisation.address || ''}  ${localisation.locality || ''}  ${localisation.postalCode || ''}  ${localisation.country}`}
              </div>
            </p>
          </Col>
          <Col className="text-right fr-pt-2w fr-pr-2w">
            <Button
              className="bt-visible-on-over"
              size="sm"
              onClick={() => handleModalToggle(localisation)}
              color="text"
              tertiary
              borderless
              rounded
              icon="ri-edit-line"
            />
          </Col>
        </Row>
      </Container>
    </Tile>

  );

  if (error) return <div>Erreur</div>;
  if (isLoading) return <div>Chargement</div>;

  const currentLocalisation = data.data.find((item) => item.current === true);

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Localisations</BlocTitle>
      <BlocActionButton onClick={() => handleModalToggle()}>Ajouter une adresse</BlocActionButton>
      <BlocContent>
        {
          data.totalCount === 1 && currentLocalisation?.coordinates && (
            <Row>
              <Col>
                <Map
                  lat={currentLocalisation?.coordinates.lat}
                  lng={currentLocalisation?.coordinates.lng}
                  markers={[
                    {
                      address: currentLocalisation.address,
                      latLng: [
                        currentLocalisation?.coordinates.lat,
                        currentLocalisation?.coordinates.lng,
                      ],
                    },
                  ]}
                />
              </Col>
            </Row>
          )
        }
        {data.totalCount === 1 && currentLocalisation?.country && renderAdress(currentLocalisation)}

        {data.totalCount > 1 && (
          <Tabs>
            <Tab label="Adresse actuelle" className="fr-p-2w">
              {currentLocalisation?.coordinates ? (
                <Row>
                  <Col>
                    <Map
                      lat={currentLocalisation?.coordinates.lat}
                      lng={currentLocalisation?.coordinates.lng}
                      markers={[
                        {
                          address: currentLocalisation.address,
                          latLng: [
                            currentLocalisation?.coordinates.lat,
                            currentLocalisation?.coordinates.lng,
                          ],
                        },
                      ]}
                    />
                  </Col>
                </Row>
              ) : null}
              {currentLocalisation?.address ? renderAdress(currentLocalisation) : null}
            </Tab>
            {(data.totalCount > 1) ? (
              <Tab label="Historique des adresses" className="fr-p-2w">
                <ul>
                  {
                    data.data.map((item) => (
                      <li key={`HistoriqueLocalisation${item.id}`}>
                        {renderAdress(item)}
                      </li>
                    ))
                  }
                </ul>
              </Tab>
            ) : null}
          </Tabs>
        )}
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
