import { useState } from 'react';
import { Col, Icon, ModalContent, ModalTitle, Row, Tab, Tabs } from '@dataesr/react-dsfr';
import Modal from '../../modal';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import api from '../../../utils/api';
import { formatDescriptionDates } from '../../../utils/dates';
import Map from '../../map/auto-bound-map';
import LocalisationForm from '../../forms/localisation';
import Button from '../../button';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../../utils/notice-contents';
import useNotice from '../../../hooks/useNotice';
import CopyButton from '../../copy/copy-button';
import useEditMode from '../../../hooks/useEditMode';

export default function LocalisationsComponent() {
  const { editMode } = useEditMode();
  const { notice } = useNotice();
  const { url, apiObject } = useUrl('localisations');
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const onSaveHandler = async (body, itemId) => {
    const method = itemId ? 'patch' : 'post';
    const saveUrl = itemId ? `${url}/${itemId}` : url;
    await api[method](saveUrl, body)
      .then(() => { notice(saveSuccess); reload(); })
      .catch(() => notice(saveError));
    return setShowModal(false);
  };

  const onDeleteHandler = async (itemId) => {
    await api.delete(`${url}/${itemId}`)
      .then(() => { notice(deleteSuccess); reload(); })
      .catch(() => notice(deleteError));
    return setShowModal(false);
  };

  const handleModalToggle = (item) => {
    setModalTitle(item?.id ? 'Modifier la localisation' : 'Ajouter une localisation');
    setModalContent(
      <LocalisationForm
        id={item?.id}
        data={item}
        onDelete={onDeleteHandler}
        onSave={onSaveHandler}
      />,
    );

    setShowModal(true);
  };

  const renderAdress = (localisation) => (
    <div className={`fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-${apiObject}`}>
      <div className="fr-card__body">
        <div className="fr-card__content">
          <p className="fr-card__title">
            <span className="fr-pr-1w">
              {`${localisation.address || ''}  ${localisation.locality || ''},  ${localisation.postalCode || ''},  ${localisation.country}`}
            </span>
            <CopyButton
              copyText={`${localisation.address || ''}  ${localisation.locality || ''}  ${localisation.postalCode || ''}  ${localisation.country}`}
              size="sm"
            />
          </p>
          <div className="fr-card__start">
            <p className="fr-card__detail fr-text--sm fr-mb-0">
              <Icon name="ri-map-pin-fill" size="1x" />
              Addresse
              {' '}
              {localisation.current ? 'actuelle' : 'historique'}
            </p>
          </div>
          <div className="fr-card__end fr-mt-0 fr-pt-0">
            <p className="fr-card__detail">
              {formatDescriptionDates(localisation.startDate || null, localisation.endDate || null)}
            </p>
          </div>
          {editMode && <Button color="text" size="md" onClick={() => handleModalToggle(localisation)} tertiary borderless rounded icon="ri-edit-line" className="edit-button" />}
        </div>
      </div>
    </div>
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
              <Col n="12" spacing="mb-1w">
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
              <Col n="12">
                {data.totalCount === 1 && currentLocalisation?.country && renderAdress(currentLocalisation)}
              </Col>
            </Row>
          )
        }

        {data.totalCount > 1 && (
          <Tabs>
            <Tab label="Adresse actuelle" className="fr-p-0 fr-pt-1v">
              {currentLocalisation?.coordinates ? (
                <Row>
                  <Col n="12" spacing="mb-1w">
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
                  <Col n="12">
                    {currentLocalisation?.address ? renderAdress(currentLocalisation) : null}
                  </Col>
                </Row>
              ) : null}
            </Tab>
            {(data.totalCount > 1) ? (
              <Tab label="Historique des adresses" className="fr-p-0 fr-pt-1v">
                <Row gutters as="ul">
                  {
                    data.data.map((item) => (
                      <Col n="12" as="li" key={`HistoriqueLocalisation${item.id}`}>
                        {renderAdress(item)}
                      </Col>
                    ))
                  }
                </Row>
              </Tab>
            ) : null}
          </Tabs>
        )}
      </BlocContent>
      <BlocModal>
        <Modal canClose={false} isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalContent>{modalContent}</ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}
