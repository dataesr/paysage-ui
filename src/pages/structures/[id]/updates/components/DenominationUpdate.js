import PropTypes from 'prop-types';
import { ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { useState } from 'react';
import Button from '../../../../../components/button';
import Modal from '../../../../../components/modal';
import NameForm from '../../../../../components/forms/names';
import DismissButton from './DismissButton';
import api from '../../../../../utils/api';
import useNotice from '../../../../../hooks/useNotice';

export const getPaysageValue = (paysageData) => (
  <>
    <span>{paysageData.displayName}</span>
    <br />
    <span className="fr-text--sm">{paysageData.currentName?.officialName}</span>
  </>
);

export const getSireneValue = (update) => update.value;
export const getSirenePrevValue = (update) => update.previousValue;

export const getForm = (update) => ({
  offcialName: update.value,
  usualName: update.value,
  startDate: update.changeEffectiveDate,
});

export function DenominationUpdate({ update, paysageData, reload }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { notice } = useNotice();

  const paysageValue = getPaysageValue(paysageData);
  const sireneValue = getSireneValue(update);
  const sirenePrevValue = getSirenePrevValue(update);

  return (
    <>
      <div style={{ width: '100%', display: 'flex', gap: '2rem' }}>
        <p style={{ flex: '0 1 100%' }}>
          <i className="fr-text--sm">
            Nouvelle valeur sirene:
          </i>
          <br />
          <span className="fr-text--bold  fr-text--sm">{sireneValue}</span>
          <br className="fr-mb-2w" />
          <i className="fr-text--sm">
            Ancienne valeur sirene:
          </i>
          <br />
          <span className="fr-text--bold fr-text--sm">{sirenePrevValue}</span>
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
      {(update.status === 'pending') && (
        <div className="fr-my-2w fr-btns-group fr-btns-group--inline-sm fr-btns-group--sm">
          <Button
            size="sm"
            type="button"
            onClick={() => setShowCreateModal(true)}
          >
            Ajouter un nouveau nom
          </Button>
          <Button
            size="sm"
            type="button"
            onClick={() => setShowUpdateModal(true)}
          >
            Modifier le nom actuel
          </Button>
          <DismissButton id={update._id} reload={reload} />
        </div>
      )}

      <Modal isOpen={showUpdateModal} size="lg" hide={() => setShowUpdateModal(false)}>
        <ModalTitle>
          Modifier le nom actuel
        </ModalTitle>
        <ModalContent>
          <NameForm
            id={paysageData.currentName.id}
            data={paysageData.currentName}
            onSave={async (body) => {
              try {
                await api.patch(
                  `/structures/${update.paysage}/names/${paysageData.currentName.id}`,
                  body,
                );
                await api.patch(`/sirene/updates/${update._id}`, { status: 'ok' });
                reload();
                notice({ content: 'OK', autoDismissAfter: 6000, type: 'success' });
              } catch {
                notice({ content: 'KO', autoDismissAfter: 6000, type: 'error' });
              }
              setShowUpdateModal(false);
            }}
          />
        </ModalContent>
      </Modal>
      <Modal isOpen={showCreateModal} size="lg" hide={() => setShowCreateModal(false)}>
        <ModalTitle>
          Ajouter un nouveau nom
          <br />
          <span className="fr-text--sm fr-text-mention--grey fr-text--regular">
            Cette action mettra une date de fin au Nom actuel
          </span>
        </ModalTitle>
        <ModalContent>
          <NameForm
            id={update.id}
            data={getForm(update)}
            onSave={async (body) => {
              try {
                await api.patch(
                  `/structures/${update.paysage}/names/${paysageData.currentSiret.id}`,
                  { endDate: update.changeEffectiveDate },
                );
                await api.post(`/structures/${update.paysage}/names`, body);
                await api.patch(`/sirene/updates/${update._id}`, { status: 'ok' });
                reload();
                notice({ content: 'OK', autoDismissAfter: 6000, type: 'success' });
              } catch {
                notice({ content: 'KO', autoDismissAfter: 6000, type: 'error' });
              }
              setShowUpdateModal(false);
            }}
          />
        </ModalContent>
      </Modal>
    </>
  );
}
DenominationUpdate.propTypes = {
  update: PropTypes.object.isRequired,
  paysageData: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired,
};
