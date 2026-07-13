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

const toExternalUrl = (account) => (account && !account.startsWith('https://') ? `https://${account}` : (account || ''));
const openLink = (url) => { if (url) window.open(url, '_blank', 'noopener,noreferrer'); };

export default function IdentifiersStep({
  identifiers, identifierOptions,
  onAdd, onRemove, onChangeType, onChangeValue,
  isExisting, existingPersonName,
  socialMedias, socialMediaOptions,
  onAddSocialMedia, onRemoveSocialMedia, onChangeSocialMediaType, onChangeSocialMediaAccount,
}) {
  const [valErrors, setValErrors] = useState({});
  const [smErrors, setSmErrors] = useState({});

  const setErr = (key, msg) => setValErrors((p) => ({ ...p, [key]: msg }));
  const clearErr = (key) => setValErrors((p) => { const n = { ...p }; delete n[key]; return n; });

  const handleChangeValue = (key, value) => {
    onChangeValue(key, value);
    const row = identifiers.find((r) => r._key === key);
    if (row?.type) {
      const [regexp, error] = regexpValidateIdentifiers(row.type);
      if (regexp && value && !regexp.test(sanitizeIdentifierValue(row.type, value))) setErr(key, error);
      else clearErr(key);
    }
  };

  const handleChangeType = (key, type) => {
    onChangeType(key, type);
    clearErr(key);
    const row = identifiers.find((r) => r._key === key);
    if (row?.value && type) {
      const [regexp, error] = regexpValidateIdentifiers(type);
      if (regexp && !regexp.test(sanitizeIdentifierValue(type, row.value))) setErr(key, error);
    }
  };

  const handleChangeSMAccount = (key, account, type) => {
    onChangeSocialMediaAccount(key, account);
    const [regexp, error] = regexpValidateSocialMedia(type);
    if (regexp && account && !regexp.test(toExternalUrl(account))) {
      setSmErrors((p) => ({ ...p, [key]: `Format attendu : ${error}` }));
    } else {
      setSmErrors((p) => { const n = { ...p }; delete n[key]; return n; });
    }
  };

  const handleChangeSMType = (key, type) => {
    onChangeSocialMediaType(key, type);
    setSmErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  };

  // Split identifiers into two sections
  const existingIds = identifiers.filter((r) => r.fromExisting && r.type !== 'ark');
  const newIds = identifiers.filter((r) => !r.fromExisting && r.type !== 'ark');

  // Map existing paysage identifiers by type for conflict detection
  const existingByType = new Map(
    existingIds.filter((r) => r.type).map((r) => [r.type, { key: r._key, value: r.value }]),
  );

  const renderIdRow = (row, fromPaysage) => {
    // Prevent duplicate types WITHIN the same section only
    const siblingTypes = new Set(
      identifiers
        .filter((r) => r._key !== row._key && Boolean(r.fromExisting) === fromPaysage && r.type)
        .map((r) => r.type),
    );
    const filteredOptions = identifierOptions.filter(
      (o) => !o.value || o.value === row.type || !siblingTypes.has(o.value),
    );

    const normalized = sanitizeIdentifierValue(row.type, row.value || '');
    const link = (row.type && row.value) ? getLink({ type: row.type, value: normalized }) : '';

    let sourceBadge = null;
    if (fromPaysage) sourceBadge = { label: 'Paysage', cls: 'fr-badge--blue-cumulus' };
    else if (row.fromPydref) sourceBadge = { label: 'IdRef', cls: 'fr-badge--blue-ecume' };
    else if (row.fromWikidata) sourceBadge = { label: row.via ? `Wikidata · ${row.via}` : 'Wikidata', cls: 'fr-badge--green-emeraude' };

    // Conflict: a new identifier has the same type as a paysage one
    const conflict = !fromPaysage && row.type ? existingByType.get(row.type) : null;
    const isSameValue = conflict
      && sanitizeIdentifierValue(row.type, row.value || '') === sanitizeIdentifierValue(row.type, conflict.value || '');

    return (
      <div key={row._key} style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 190px' }}>
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
              message={valErrors[row._key] || null}
              messageType={valErrors[row._key] ? 'error' : ''}
            />
          </div>
          <div style={{ paddingTop: '28px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {sourceBadge && (
              <span className={`fr-badge fr-badge--sm ${sourceBadge.cls}`}>{sourceBadge.label}</span>
            )}
            {!fromPaysage && (
              <Button size="sm" secondary icon="ri-delete-bin-line" title="Supprimer" onClick={() => onRemove(row._key)} />
            )}
            {!!link && (
              <Button size="sm" tertiary borderless icon="ri-external-link-line" title="Vérifier" onClick={() => openLink(link)}>
                Vérifier
              </Button>
            )}
          </div>
        </div>

        {conflict && !isSameValue && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '8px 12px',
            marginTop: '6px',
            background: 'var(--warning-950-100)',
            borderLeft: '3px solid var(--warning-425-625)',
            borderRadius: '0 4px 4px 0',
          }}
          >
            <p className="fr-text--xs fr-mb-0">
              ⚠&nbsp; Ce type existe déjà dans Paysage avec la valeur&nbsp;
              <strong>{conflict.value}</strong>
              &nbsp;— un seul identifiant par type sera conservé.
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Button size="sm" onClick={() => { onChangeValue(conflict.key, row.value); onRemove(row._key); }}>
                Utiliser cette valeur
              </Button>
              <Button size="sm" secondary onClick={() => onRemove(row._key)}>
                Ignorer
              </Button>
            </div>
          </div>
        )}

        {/* Conflit : même type, même valeur */}
        {conflict && isSameValue && (
          <p className="fr-text--xs fr-hint-text fr-mt-1v">
            <span className="fr-badge fr-badge--sm fr-badge--success fr-mr-1w">Déjà présent</span>
            Même valeur que dans Paysage — ne sera pas re-soumis.
          </p>
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
              {existingPersonName ? `Identifiants de ${existingPersonName}` : 'Identifiants de la fiche existante'}
            </p>
            <p className="fr-notice__desc fr-text--sm fr-mb-0">
              Vous pouvez modifier les identifiants existants ou en ajouter de nouveaux.
            </p>
          </div>
        </div>
      ) : (
        <p className="fr-text--sm fr-hint-text fr-mb-3w">
          Étape optionnelle. Les identifiants permettent de lier la fiche à des référentiels externes (IdRef, ORCID, Wikidata…).
        </p>
      )}

      {existingIds.length > 0 && (
        <div className="fr-mb-3w">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <p className="fr-text--sm fr-mb-0" style={{ fontWeight: 600 }}>Dans Paysage</p>
            <span className="fr-badge fr-badge--sm fr-badge--blue-cumulus">{existingIds.length}</span>
          </div>
          {existingIds.map((row) => renderIdRow(row, true))}
          <hr className="fr-mt-1w fr-mb-3w" />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <p className="fr-text--sm fr-mb-0" style={{ fontWeight: 600 }}>
          {newIds.length === 0 ? 'Aucun nouvel identifiant' : `${newIds.length} nouvel${newIds.length > 1 ? 's' : ''} identifiant${newIds.length > 1 ? 's' : ''}`}
        </p>
        <Button size="sm" tertiary borderless icon="ri-add-circle-line" iconPosition="left" onClick={onAdd}>
          Ajouter un identifiant
        </Button>
      </div>

      {newIds.length === 0 && existingIds.length === 0 && (
        <div className="fr-p-3w" style={{ background: 'var(--grey-975-75)', borderRadius: '4px', textAlign: 'center' }}>
          <p className="fr-text--sm fr-hint-text fr-mb-0">Aucun identifiant renseigné.</p>
        </div>
      )}

      {newIds.map((row) => renderIdRow(row, false))}

      <hr className="fr-mt-3w fr-mb-3w" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <p className="fr-text--sm fr-mb-0" style={{ fontWeight: 600 }}>
          {socialMedias.length === 0
            ? 'Aucun réseau social'
            : `${socialMedias.length} réseau${socialMedias.length > 1 ? 'x' : ''} social${socialMedias.length > 1 ? 'x' : ''}`}
        </p>
        <Button size="sm" tertiary borderless icon="ri-add-circle-line" iconPosition="left" onClick={onAddSocialMedia}>
          Ajouter un réseau social
        </Button>
      </div>

      {socialMedias.length === 0 && (
        <div className="fr-p-3w" style={{ background: 'var(--grey-975-75)', borderRadius: '4px', textAlign: 'center' }}>
          <p className="fr-text--sm fr-hint-text fr-mb-0">Aucun réseau social renseigné.</p>
        </div>
      )}

      {socialMedias.map((row) => {
        const smLink = toExternalUrl(row.account);
        return (
          <div key={row._key} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ flex: '0 0 190px' }}>
              <Select
                label="Réseau"
                options={socialMediaOptions}
                selected={row.type}
                onChange={(e) => handleChangeSMType(row._key, e.target.value)}
              />
            </div>
            <div style={{ flex: '1 1 auto' }}>
              <TextInput
                label="URL / Compte"
                value={row.account}
                onChange={(e) => handleChangeSMAccount(row._key, e.target.value, row.type)}
                message={smErrors[row._key] || null}
                messageType={smErrors[row._key] ? 'error' : ''}
              />
            </div>
            <div style={{ paddingTop: '28px', display: 'flex', gap: '6px' }}>
              <Button size="sm" secondary icon="ri-delete-bin-line" title="Supprimer" onClick={() => onRemoveSocialMedia(row._key)} />
              {!!row.account && !smErrors[row._key] && (
                <Button size="sm" tertiary borderless icon="ri-external-link-line" title="Vérifier" onClick={() => openLink(smLink)}>
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

IdentifiersStep.propTypes = {
  identifiers: PropTypes.arrayOf(PropTypes.shape({
    _key: PropTypes.string,
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
  existingPersonName: PropTypes.string,
  socialMedias: PropTypes.arrayOf(PropTypes.shape({
    _key: PropTypes.string,
    type: PropTypes.string,
    account: PropTypes.string,
  })).isRequired,
  socialMediaOptions: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })).isRequired,
  onAddSocialMedia: PropTypes.func.isRequired,
  onRemoveSocialMedia: PropTypes.func.isRequired,
  onChangeSocialMediaType: PropTypes.func.isRequired,
  onChangeSocialMediaAccount: PropTypes.func.isRequired,
};
IdentifiersStep.defaultProps = { existingPersonName: null };
