import PropTypes from 'prop-types';
import { ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { useState } from 'react';
import Button from '../../../../../components/button';
import Modal from '../../../../../components/modal';
import LocalisationForm from '../../../../../components/forms/localisation';
import DismissButton from './DismissButton';
import api from '../../../../../utils/api';
import useNotice from '../../../../../hooks/useNotice';

function transformAddress(input, startDate = null) {
  const address = [
    input.numeroVoieEtablissement,
    input.typeVoieEtablissement?.toLowerCase(),
    input.libelleVoieEtablissement,
  ].filter(Boolean).join(' ');

  return {
    cityId: input.codeCommuneEtablissement || '',
    city: input.libelleCommuneEtablissement || '',
    address,
    postalCode: input.codePostalEtablissement || '',
    locality: input.libelleCommuneEtablissement || '',
    country: 'France',
    iso3: 'FRA',
    active: true,
    startDate,
  };
}

export function formatAddress(address) {
  if (!address) return <p>Adresse non renseignée</p>;

  return (
    <div className="fr-text--sm">
      <div>{address.address}</div>
      <div>{`${address.postalCode} ${address.city}`}</div>
      <div>{address.country}</div>
    </div>
  );
}

const getPaysageValue = (paysageData) => <pre className="fr-text--xs">{formatAddress(paysageData.currentLocalisation)}</pre>;

const getSireneValue = (update) => <pre className="fr-text--xs">{formatAddress(transformAddress(update.value, update.changeEffectiveDate))}</pre>;

export function AdresseUpdate({ update, paysageData, reload }) {
  const [showModal, setShowModal] = useState(false);
  const { notice } = useNotice();

  const paysageValue = getPaysageValue(paysageData);
  const sireneValue = getSireneValue(update);

  const sirenAdress = transformAddress(update.value, update.changeEffectiveDate);
  const sireneQuery = `${sirenAdress.address} ${sirenAdress.city}`;

  return (
    <>
      <div style={{ width: '100%', display: 'flex', gap: '2rem' }}>
        <p style={{ flex: '0 1 100%' }}>
          <i className="fr-text--sm">
            Nouvelle valeur sirene:
          </i>
          <br />
          <span className="fr-text--bold">{sireneValue}</span>
        </p>
        <p style={{ flex: '0 1 100%' }}>
          <i className="fr-text--sm">
            Valeur paysage actuelle:
            {' '}
          </i>
          <br />
          <span className="fr-text--bold">{paysageValue || 'Non renseigné'}</span>
        </p>
      </div>
      <div className="fr-my-2w fr-btns-group fr-btns-group--inline-sm fr-btns-group--sm">
        <Button
          size="sm"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Ajouter
        </Button>
        <DismissButton id={update._id} reload={reload} />
      </div>

      <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
        <ModalTitle>
          Modifier le SIRET
          <br />
          <span className="fr-text--sm fr-text-mention--grey fr-text--regular">
            Cette action mettra une date de fin au SIRET actuel
          </span>
        </ModalTitle>
        <ModalContent>
          <LocalisationForm
            data={sirenAdress}
            defaultQuery={sireneQuery}
            onSave={async (body) => {
              try {
                await api.patch(
                  `/structures/${update.paysage}/localisations/${paysageData.currentLocalisation.id}`,
                  { active: false, endDate: update.changeEffectiveDate },
                );
                await api.post(`/structures/${update.paysage}/localisations`, body);
                await api.patch(`/sirene/updates/${update._id}`, { status: 'ok' });
                reload();
                notice({ content: 'OK', autoDismissAfter: 6000, type: 'success' });
              } catch {
                notice({ content: 'KO', autoDismissAfter: 6000, type: 'error' });
              }
              setShowModal(false);
            }}
          />
        </ModalContent>
      </Modal>
    </>
  );
}

AdresseUpdate.propTypes = {
  update: PropTypes.object.isRequired,
  paysageData: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired,
};
