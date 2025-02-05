import PropTypes from 'prop-types';
import { useState } from 'react';
import { ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import Button from '../../../../../components/button';
import Modal from '../../../../../components/modal';
import RelationForm from '../../../../../components/forms/relations';
import DismissButton from './DismissButton';

export const getPaysageValue = (paysageData) => paysageData?.legalcategory?.inseeCode;

export const getSireneValue = (update) => update.value;
export const getSirenePrevValue = (update) => update.previousValue;

export const getForm = (update) => ({
  inseeCode: update.value,
  startDate: update.changeEffectiveDate,
});

export function CategorieJuridiqueUpdate({ update, paysageData, reload }) {
  const [showModal, setShowModal] = useState(false);

  const paysageValue = getPaysageValue(paysageData);
  const sireneValue = getSireneValue(update);
  const sirenePrevValue = getSirenePrevValue(update);

  return (
    <>
      <div style={{ width: '100%', display: 'flex', gap: '2rem' }}>
        <p style={{ flex: '0 1 30%' }}>
          <i className="fr-text--sm">
            Nouvelle valeur sirene:
          </i>
          <br />
          <span className="fr-text--bold">{sireneValue}</span>
        </p>
        <p style={{ flex: '0 1 30%' }}>
          <i className="fr-text--sm">
            Ancienne valeur sirene:
          </i>
          <br />
          <span className="fr-text--bold">{sirenePrevValue}</span>
        </p>
        <p style={{ flex: '0 1 30%' }}>
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
          Modifier la catégorie juridique
          <br />
          <span className="fr-text--sm fr-text-mention--grey fr-text--regular">
            Cette action mettra une date de fin à la catégorie juridique actuelle
          </span>
        </ModalTitle>
        <ModalContent>
          <RelationForm
            data={getForm(update)}
            resourceType="structures"
            relatedObjectType={['legalcategories']}
            noRelationType
            onSave={() => {
              console.log('save');
              setShowModal(false);
            }}
          />
        </ModalContent>
      </Modal>
    </>
  );
}

CategorieJuridiqueUpdate.propTypes = {
  update: PropTypes.object.isRequired,
  paysageData: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired,
};
