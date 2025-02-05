import PropTypes from 'prop-types';
import { ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { useState } from 'react';
import Button from '../../../../../components/button';
import Modal from '../../../../../components/modal';
import LocalisationForm from '../../../../../components/forms/localisation';
import DismissButton from './DismissButton';

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

  const paysageValue = getPaysageValue(paysageData);
  const sireneValue = getSireneValue(update);

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
            data={transformAddress(update.value)}
            defaultQuery={transformAddress(update.value).address}
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
