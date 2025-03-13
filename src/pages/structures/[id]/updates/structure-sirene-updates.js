import PropTypes from 'prop-types';
import { NicSiegeUpdate } from './components/NicSiegeUpdate';
import { AdresseUpdate } from './components/AdresseUpdate';
import { CategorieJuridiqueUpdate } from './components/CategorieJuridiqueUpdate';
import { EtatAdministratifUpdate } from './components/EtatAdministratifUpdate';
import { DenominationUpdate } from './components/DenominationUpdate';

const UPDATE_COMPONENTS = {
  changementNicSiegeUniteLegale: NicSiegeUpdate,
  changementAdresseSiegeUniteLegale: AdresseUpdate,
  changementCategorieJuridiqueUniteLegale: CategorieJuridiqueUpdate,
  changementEtatAdministratifUniteLegale: EtatAdministratifUpdate,
  changementDenominationUniteLegale: DenominationUpdate,
  changementEtatAdministratifEtablissement: EtatAdministratifUpdate,
};

const FIELD_DISPLAY_NAMES = {
  changementNicSiegeUniteLegale: 'NIC du siège',
  changementAdresseSiegeUniteLegale: 'Adresse',
  changementCategorieJuridiqueUniteLegale: 'Catégorie juridique',
  changementEtatAdministratifUniteLegale: 'Etat administratif',
  changementDenominationUniteLegale: 'Dénomination',
  changementEtatAdministratifEtablissement: 'Etat administratif',
};

const DATE_DISPLAY_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export default function StructureSireneUpdates({ structure, reload }) {
  const { updates } = structure;
  const lastUpdate = updates.map((u) => u.createdAt).sort().reverse()[0];
  const treatedUpdates = updates.filter((update) => update.status === 'ok');
  const newUpdates = updates.filter((update) => update.status === 'pending');
  const url = structure.type === 'establishment'
    ? `https://annuaire-entreprises.data.gouv.fr/etablissement/${structure.siret}`
    : `https://annuaire-entreprises.data.gouv.fr/entreprise/${structure.siren}`;

  return (
    <div key={structure.id}>
      <p style={{ marginTop: '-1.25rem' }} className="fr-card__detail fr-mb-0">
        Dernière modification repérée dans la base sirene le
        {' '}
        {new Date(lastUpdate)?.toLocaleDateString('fr', DATE_DISPLAY_OPTIONS)}
      </p>
      <a className="fr-btn fr-btn--sm" target="_blank" rel="noopener noreferrer" href={url}>
        Voir sur l'annuaire entreprise
      </a>
      {newUpdates.sort((a, b) => b.changeEffectiveDate - a.changeEffectiveDate).map((update) => {
        const UpdateComponent = UPDATE_COMPONENTS[update.field];

        return UpdateComponent ? (
          <div key={update.id}>
            <hr />
            <p className={` fr-mb-1w fr-badge fr-badge--icon-left fr-badge--${update.status === 'pending' ? 'new' : 'success'} fr-badge--sm`}>
              {update.status === 'pending' ? 'nouveau' : 'traité'}
            </p>
            <div className="fr-mb-2w">
              <span className="fr-text--bold">{FIELD_DISPLAY_NAMES?.[update.field] ?? update.field}</span>
              <br />
              <i className="fr-card__detail">
                au
                {' '}
                {new Date(update?.changeEffectiveDate)?.toLocaleDateString('fr', DATE_DISPLAY_OPTIONS)}
              </i>
            </div>
            <UpdateComponent
              update={update}
              reload={reload}
              paysageData={structure.paysageData}
            />
          </div>
        ) : null;
      })}
      <hr />
      <hr />
      {treatedUpdates.sort((a, b) => b.changeEffectiveDate - a.changeEffectiveDate).map((update) => {
        const UpdateComponent = UPDATE_COMPONENTS[update.field];

        return UpdateComponent ? (
          <div key={update.id}>
            <hr />
            <p className={` fr-mb-1w fr-badge fr-badge--icon-left fr-badge--${update.status === 'pending' ? 'new' : 'success'} fr-badge--sm`}>
              {update.status === 'pending' ? 'nouveau' : 'traité'}
            </p>
            <div className="fr-mb-2w">
              <span className="fr-text--bold">{FIELD_DISPLAY_NAMES?.[update.field] ?? update.field}</span>
              <br />
              <i className="fr-card__detail">
                au
                {' '}
                {new Date(update?.changeEffectiveDate)?.toLocaleDateString('fr', DATE_DISPLAY_OPTIONS)}
              </i>
            </div>
            <UpdateComponent
              update={update}
              reload={reload}
              paysageData={structure.paysageData}
            />
          </div>
        ) : null;
      })}
    </div>
  );
}

StructureSireneUpdates.propTypes = {
  structure: PropTypes.object,
  reload: PropTypes.func.isRequired,
};

StructureSireneUpdates.defaultProps = {
  structure: {},
};
