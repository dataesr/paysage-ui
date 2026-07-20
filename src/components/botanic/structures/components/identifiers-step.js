/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import { Select, TextInput } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import Button from '../../../button';
import { regexpValidateIdentifiers } from '../../../../utils/regexpForIdentifiers';
import getLink from '../../../../utils/get-links';
import { sanitizeIdentifierValue } from '../../utils';

const regexpValidateSocialMedia = (type) => {
  const validator = {
    Bluesky: [/^(https:\/\/)?(www.)?bsky.app\/profile\/[A-Za-z0-9/:%_+.,#?!@&=-]+$/, 'https://bsky.app/profile/<compte>'],
    Facebook: [/^(https:\/\/)?(www.)?facebook.com\/[A-Za-z0-9/:%_+.,#?!@&=-]+$/, 'https://www.facebook.com/<compte>'],
    Github: [/^(https:\/\/)?(www.)?github.com\/[A-Za-z0-9/:%_+.,#?!@&=-]+$/, 'https://github.com/<compte>'],
    Instagram: [/^(https:\/\/)?(www.)?instagram.com\/[A-Za-z0-9/:%_+.,#?!@&=-]+$/, 'https://www.instagram.com/<compte>/'],
    Linkedin: [/^(https:\/\/)?(www.)?(fr.)?linkedin.com\/.+[A-Za-z0-9/:%_+.,#?!@&=-]+$/, 'https://www.linkedin.com/<profil>'],
    Twitter: [/^(https:\/\/)?(www.)?(twitter\.com|x\.com)\/[0-9A-Za-z_]{1,15}$/, 'https://twitter.com/<compte> ou https://x.com/<compte>'],
    Youtube: [/^(https:\/\/)?(www.)?youtube.com\/[A-Za-z0-9/:%_+.,#?!@&=-]+$/, 'https://www.youtube.com/channel/<chaine>'],
  };
  return validator[type] || [null, null];
};

const openExternalLink = (url) => {
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export default function StructureIdentifiersStep({
  identifiers,
  identifierOptions,
  onAdd,
  onRemove,
  onChangeType,
  onChangeValue,
  isExisting,
  existingStructureName,
  socialMedias,
  socialMediaOptions,
  onAddSocialMedia,
  onRemoveSocialMedia,
  onChangeSocialMediaType,
  onChangeSocialMediaAccount,
}) {
  const [validationErrors, setValidationErrors] = useState({});
  const [smErrors, setSmErrors] = useState({});

  const fromExisting = identifiers.filter((r) => r.fromExisting);
  const newRows = identifiers.filter((r) => !r.fromExisting);

  // Conflict detection: new row has same type as existing row
  const conflicts = {};
  newRows.forEach((newRow) => {
    if (!newRow.type) return;
    const existing = fromExisting.find((ex) => ex.type === newRow.type);
    if (!existing) return;
    conflicts[newRow._key] = existing.value === newRow.value
      ? { kind: 'same', existing }
      : { kind: 'different', existing };
  });

  const handleChangeValue = (key, value) => {
    onChangeValue(key, value);
    const row = identifiers.find((r) => r._key === key);
    if (row?.type) {
      const [regexp, error] = regexpValidateIdentifiers(row.type);
      if (regexp && value && !regexp.test(sanitizeIdentifierValue(row.type, value))) {
        setValidationErrors((prev) => ({ ...prev, [key]: error }));
      } else {
        setValidationErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
      }
    }
  };

  const handleChangeType = (key, type) => {
    onChangeType(key, type);
    const row = identifiers.find((r) => r._key === key);
    if (row?.value) {
      const [regexp, error] = regexpValidateIdentifiers(type);
      if (regexp && !regexp.test(sanitizeIdentifierValue(type, row.value))) {
        setValidationErrors((prev) => ({ ...prev, [key]: error }));
      } else {
        setValidationErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
      }
    }
  };

  const handleChangeSocialMediaAccount = (key, account, type) => {
    onChangeSocialMediaAccount(key, account);
    const [regexp, error] = regexpValidateSocialMedia(type);
    if (regexp && account && !regexp.test(account.startsWith('https://') ? account : `https://${account}`)) {
      setSmErrors((prev) => ({ ...prev, [key]: `Format attendu : ${error}` }));
    } else {
      setSmErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
    }
  };

  const handleChangeSocialMediaType = (key, type) => {
    onChangeSocialMediaType(key, type);
    setSmErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const renderIdentifierRow = (row, section) => {
    const siblingRows = section === 'existing'
      ? fromExisting.filter((r) => r._key !== row._key)
      : newRows.filter((r) => r._key !== row._key);
    const usedTypes = new Set(siblingRows.map((r) => r.type).filter(Boolean));
    const filteredOptions = identifierOptions.filter(
      (o) => !o.value || o.value === row.type || !usedTypes.has(o.value),
    );
    const normalizedValue = sanitizeIdentifierValue(row.type, row.value || '');
    const verificationLink = (row.type && row.value) ? getLink({ type: row.type, value: normalizedValue }) : '';

    let sourceBadge = null;
    if (row.fromExisting) {
      sourceBadge = { label: 'Paysage', cls: 'fr-badge--blue-ecume' };
    } else if (row.fromRor) {
      sourceBadge = { label: row.via ? `ROR (via ${row.via})` : 'ROR', cls: 'fr-badge--purple-glycine' };
    } else if (row.fromWikidata) {
      sourceBadge = { label: row.via ? `Wikidata (via ${row.via})` : 'Wikidata', cls: 'fr-badge--green-emeraude' };
    }

    const conflict = conflicts[row._key];

    return (
      <div key={row._key} style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 220px' }}>
            <Select
              label="Type"
              options={filteredOptions}
              selected={row.type}
              onChange={(e) => handleChangeType(row._key, e.target.value)}
            />
          </div>
          <div style={{ flex: '1 1 auto' }}>
            <TextInput
              label="Valeur"
              value={row.value}
              onChange={(e) => handleChangeValue(row._key, e.target.value)}
              message={validationErrors[row._key] || null}
              messageType={validationErrors[row._key] ? 'error' : ''}
            />
          </div>
          <div style={{ paddingTop: '28px', display: 'flex', gap: '4px' }}>
            {!row.fromExisting && (
              <Button size="sm" secondary icon="ri-delete-bin-line" title="Supprimer" onClick={() => onRemove(row._key)} />
            )}
            {!!verificationLink && (
              <Button size="sm" tertiary borderless icon="ri-external-link-line" title="Vérifier" onClick={() => openExternalLink(verificationLink)}>
                Vérifier
              </Button>
            )}
          </div>
        </div>

        {sourceBadge && !conflict && (
          <p className="fr-mb-0 fr-mt-1v" style={{ paddingLeft: '4px' }}>
            <span className={`fr-badge fr-badge--sm ${sourceBadge.cls}`}>{sourceBadge.label}</span>
            {!row.fromExisting && (
              <span className="fr-text--xs fr-ml-1w" style={{ color: 'var(--grey-425-625)' }}>
                {`Sera ajouté — importé depuis ${sourceBadge.label}, pas encore en base`}
              </span>
            )}
          </p>
        )}

        {conflict?.kind === 'same' && (
          <p className="fr-mb-0 fr-mt-1v" style={{ paddingLeft: '4px' }}>
            <span className="fr-badge fr-badge--sm fr-badge--success">Déjà présent</span>
            <span className="fr-text--xs fr-ml-1w" style={{ color: 'var(--grey-425-625)' }}>Valeur identique déjà dans Paysage.</span>
          </p>
        )}

        {conflict?.kind === 'different' && (
          <div style={{
            background: 'var(--background-contrast-orange-terre-battue)',
            borderLeft: '3px solid var(--border-plain-orange-terre-battue)',
            padding: '8px 12px',
            marginTop: '6px',
            borderRadius: '0 4px 4px 0',
          }}
          >
            <p className="fr-text--xs fr-mb-1w">
              <strong>Conflit :</strong>
              {' Paysage a déjà '}
              <code>{conflict.existing.value}</code>
              {' pour ce type.'}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="sm" onClick={() => { onChangeValue(conflict.existing._key, row.value); onRemove(row._key); }}>
                Utiliser cette valeur
              </Button>
              <Button size="sm" secondary onClick={() => onRemove(row._key)}>Ignorer</Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {isExisting ? (
        <div className="fr-notice fr-notice--info fr-mb-3w">
          <div className="fr-notice__body">
            <p className="fr-notice__title">
              {existingStructureName ? `Identifiants de ${existingStructureName}` : 'Identifiants de la structure existante'}
            </p>
            <p className="fr-notice__desc fr-text--sm">
              Vous pouvez modifier les identifiants existants ou en ajouter de nouveaux.
            </p>
          </div>
        </div>
      ) : (
        <p className="fr-text--sm fr-hint-text fr-mb-3w">
          Étape optionnelle. Les identifiants permettent de lier la fiche à des référentiels externes (SIRET, ROR, Wikidata…).
        </p>
      )}

      {fromExisting.length > 0 && (
        <div className="fr-mb-3w" style={{ background: 'var(--grey-975-75)', borderRadius: '4px', padding: '12px 16px' }}>
          <p className="fr-text--sm fr-mb-2w" style={{ fontWeight: '600' }}>Dans Paysage</p>
          {fromExisting.map((row) => renderIdentifierRow(row, 'existing'))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <p className="fr-text--sm fr-mb-0" style={{ fontWeight: '600' }}>
          {newRows.length === 0 ? 'Nouveaux identifiants' : `Nouveaux identifiants (${newRows.length})`}
        </p>
        <Button size="sm" tertiary borderless icon="ri-add-circle-line" iconPosition="left" onClick={onAdd}>
          Ajouter
        </Button>
      </div>

      {newRows.length === 0 && (
        <div className="fr-p-3w" style={{ background: 'var(--grey-975-75)', borderRadius: '4px', textAlign: 'center' }}>
          <p className="fr-text--sm fr-hint-text fr-mb-0">Aucun nouvel identifiant renseigné.</p>
        </div>
      )}

      {newRows.map((row) => renderIdentifierRow(row, 'new'))}

      <hr className="fr-mt-3w fr-mb-3w" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p className="fr-text--sm fr-mb-0" style={{ fontWeight: '600' }}>
          {socialMedias.length === 0
            ? 'Réseaux sociaux'
            : `${socialMedias.length} réseau${socialMedias.length > 1 ? 'x' : ''} social${socialMedias.length > 1 ? 'x' : ''}`}
        </p>
        <Button size="sm" tertiary borderless icon="ri-share-line" iconPosition="left" onClick={onAddSocialMedia}>
          Ajouter un réseau social
        </Button>
      </div>

      {socialMedias.length === 0 && (
        <div className="fr-p-3w" style={{ background: 'var(--grey-975-75)', borderRadius: '4px', textAlign: 'center' }}>
          <p className="fr-text--sm fr-hint-text fr-mb-0">Aucun réseau social renseigné.</p>
        </div>
      )}

      {socialMedias.map((row) => {
        const socialMediaLink = row.account
          ? (row.account.startsWith('https://') ? row.account : `https://${row.account}`)
          : '';
        return (
          <div key={row._key} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ flex: '0 0 220px' }}>
              <Select
                label="Réseau"
                options={socialMediaOptions}
                selected={row.type}
                onChange={(e) => handleChangeSocialMediaType(row._key, e.target.value)}
              />
            </div>
            <div style={{ flex: '1 1 auto' }}>
              <TextInput
                label="URL / Compte"
                value={row.account}
                onChange={(e) => handleChangeSocialMediaAccount(row._key, e.target.value, row.type)}
                message={smErrors[row._key] || null}
                messageType={smErrors[row._key] ? 'error' : ''}
              />
            </div>
            <div style={{ paddingTop: '28px', display: 'flex', gap: '4px' }}>
              <Button size="sm" secondary icon="ri-delete-bin-line" title="Supprimer" onClick={() => onRemoveSocialMedia(row._key)} />
              {!!row.account && !smErrors[row._key] && (
                <Button
                  size="sm"
                  tertiary
                  borderless
                  icon="ri-external-link-line"
                  title="Vérifier"
                  onClick={() => openExternalLink(socialMediaLink)}
                >
                  Vérifier
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

StructureIdentifiersStep.propTypes = {
  identifiers: PropTypes.arrayOf(PropTypes.shape({
    _key: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.string,
    fromExisting: PropTypes.bool,
  })).isRequired,
  identifierOptions: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })).isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onChangeType: PropTypes.func.isRequired,
  onChangeValue: PropTypes.func.isRequired,
  isExisting: PropTypes.bool.isRequired,
  existingStructureName: PropTypes.string,
  socialMedias: PropTypes.arrayOf(PropTypes.shape({ _key: PropTypes.string.isRequired, type: PropTypes.string, account: PropTypes.string })).isRequired,
  socialMediaOptions: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })).isRequired,
  onAddSocialMedia: PropTypes.func.isRequired,
  onRemoveSocialMedia: PropTypes.func.isRequired,
  onChangeSocialMediaType: PropTypes.func.isRequired,
  onChangeSocialMediaAccount: PropTypes.func.isRequired,
};
StructureIdentifiersStep.defaultProps = { existingStructureName: null };
