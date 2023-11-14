import { useState } from 'react';
import { Col, Icon, ModalContent, ModalTitle, Row, Tab, Tabs, Text } from '@dataesr/react-dsfr';

import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import Button from '../../button';
import CopyButton from '../../copy/copy-button';
import LocalisationForm from '../../forms/localisation';
import Map from '../../map';
import Modal from '../../modal';
import useFetch from '../../../hooks/useFetch';
import useEditMode from '../../../hooks/useEditMode';
import useNotice from '../../../hooks/useNotice';
import useUrl from '../../../hooks/useUrl';
import api from '../../../utils/api';
import { formatDescriptionDates } from '../../../utils/dates';
import { deleteError, deleteSuccess, saveError, saveSuccess } from '../../../utils/notice-contents';
import GeographicalTags from '../geographical-tags';
import { PageSpinner } from '../../spinner';

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

  const renderAddress = (localisation) => {
    const elements = [
      localisation.distributionStatement,
      localisation.address,
      localisation.place,
      localisation.postOfficeBoxNumber,
      localisation.postalCode,
      localisation.locality,
      localisation.country,
    ];

    const addressText = elements
      .filter((element) => element)
      .map((element) => element.split(' ').join('\n'))
      .filter((element) => element)
      .join(', ');

    return (
      <div className="fr-card fr-card--grey fr-card--no-border">
        <div className="fr-card__content ">
          <p className="fr-card__title">
            {addressText && (
              <span className="fr-pr-1w">
                {addressText}
                <CopyButton
                  copyText={addressText}
                  size="sm"
                />
              </span>
            )}
          </p>
          {localisation.phonenumber && (
            <Text className="fr-card__title">
              <Icon name="ri-phone-line" size="xl" />
              <span className="fr-pr-1w">
                {localisation.phonenumber.replace(/\s/g, '')}
              </span>
              <CopyButton
                copyText={localisation.phonenumber.replace(/\s/g, '')}
                size="sm"
              />
            </Text>
          )}
          <div className="fr-card__start">
            <p className="fr-card__detail fr-text--sm fr-mb-0">
              <Icon name="ri-map-pin-fill" size="1x" />
              {localisation.current ? 'Dernière adresse connue' : 'Adresse historique'}
            </p>
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
  };

  if (error) return <div>Erreur</div>;
  if (isLoading) {
    return (
      <Row className="flex--space-between">
        <Col>
          <PageSpinner />
        </Col>
      </Row>
    );
  }

  const currentLocalisation = data.data.find((item) => item.current === true);
  const inactives = data.data.filter((el) => (el.current === false)).sort((a, b) => a.startDate - b.startDate);
  const actives = data.data.filter((el) => (el.current !== false));
  const orderedList = [...actives, ...inactives].filter((address) => !address.current);

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Localisations</BlocTitle>
      <BlocActionButton onClick={() => handleModalToggle()}>
        Ajouter une adresse
      </BlocActionButton>
      <BlocContent>
        <Row gutters>
          <Col n="12">
            <Tabs>
              {data && (
                <Tab
                  className={`fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-${apiObject}`}
                  label="Adresse actuelle"
                >
                  <Row gutters>
                    <Col n="8">
                      {currentLocalisation.coordinates && (
                        <Map
                          lat={currentLocalisation?.coordinates?.lat}
                          lng={currentLocalisation?.coordinates?.lng}
                          markers={[
                            {
                              address: `${currentLocalisation?.address || ''}, ${currentLocalisation?.postalCode || ''} ${currentLocalisation?.locality || ''}, ${currentLocalisation?.country}`,
                              latLng: [
                                currentLocalisation?.coordinates?.lat,
                                currentLocalisation?.coordinates?.lng,
                              ],
                            },
                          ]}
                        />
                      )}
                    </Col>
                    <Col n="4">
                      {currentLocalisation?.country
                        ? renderAddress(currentLocalisation) : null}
                    </Col>
                    {data && (
                      <Row className="fr-mt-3w">
                        <Col>
                          <BlocTitle as="h3" look="h6">Catégories géographiques de l'adresse actuelle</BlocTitle>
                          <GeographicalTags data={currentLocalisation?.geoCategories} />
                        </Col>
                      </Row>
                    )}
                  </Row>
                </Tab>
              )}
              {data.totalCount > 1 && (
                <Tab
                  className={`fr-card fr-card--grey fr-card--no-border card-${apiObject}`}
                  label="Historique des adresses"
                >
                  <Row style={{ overflowY: 'scroll' }}>
                    <style>
                      {`
                        ::-webkit-scrollbar {
                          width: 8px;
                        }
                        ::-webkit-scrollbar-vertical {
                          width: 8px;
                        }
                        ::-webkit-scrollbar-thumb:vertical {
                          background-color: gray;
                        }
                        
                        ::-webkit-scrollbar-track:vertical {
                          background-color: transparent;
                        }
                      `}
                    </style>

                    {orderedList.length > 2 && (
                      <Text style={{ textAlign: 'center', color: 'gray' }}>
                        Défiler pour voir plus de contenu
                      </Text>
                    )}
                    {orderedList.map((item) => (
                      <Col n="12" key={`HistoriqueLocalisation${item.id}`}>
                        {renderAddress(item)}
                      </Col>
                    ))}
                  </Row>
                </Tab>
              )}
            </Tabs>
          </Col>
        </Row>
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
