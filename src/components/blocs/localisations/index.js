import { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Icon, Modal, ModalContent, ModalTitle, Row, Tab, Tabs, Tile, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import api from '../../../utils/api';
import { formatDescriptionDates } from '../../../utils/dates';
import Map from '../../map';
import LocalisationForm from './form';
import PaysageSection from '../../sections/section';
import EmptySection from '../../sections/empty';
import Button from '../../button';

import styles from './styles.module.scss';

export default function LocalisationsComponent({ id, apiObject, currentLocalisationId }) {
  const route = `/${apiObject}/${id}/localisations`;
  const { data, isLoading, error, reload } = useFetch(route);
  const [isOpen, setIsOpen] = useState();
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const handleSave = async (localisationId, body) => {
    const method = localisationId ? 'patch' : 'post';
    const url = localisationId ? `${route}/${localisationId}` : route;
    const response = await api[method](url, body);
    if (response.ok) {
      reload();
      setIsOpen(false);
    }
  };

  const handleDelete = async (localisationId) => {
    if (!localisationId) return;
    const response = await api.delete(`${route}/${localisationId}`);
    if (response.ok) {
      reload();
      setIsOpen(false);
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

    setIsOpen(true);
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
                {`${localisation.address} - ${localisation.locality} - ${localisation.postalCode}`}
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

  const currentLocalisation = data.data.find((item) => item.id === currentLocalisationId);

  return (
    <PaysageSection dataPaysageMenu="Localisation" id="localisations">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Localisations
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
      ) : (
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
  currentLocalisationId: PropTypes.string.isRequired,
};
