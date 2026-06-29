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

const toExternalUrl = (account) => {
  if (!account) return '';
  return account.startsWith('https://') ? account : `https://${account}`;
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

  return (
    <div>
      {isExisting ? (
        <div className="fr-notice fr-notice--info fr-mb-3w">
          <div className="fr-notice__body">
            <p className="fr-notice__title">
              {existingStructureName ? `Identifiants de ${existingStructureName}` : 'Identifiants de la structure existante'}
            </p>
            <p className="fr-notice__desc fr-text--sm">
              Les identifiants existants sont affichés ci-dessous. Vous pouvez modifier le type ou la valeur de chacun, ou en ajouter de nouveaux.
            </p>
          </div>
        </div>
      ) : (
        <p className="fr-text--sm fr-hint-text fr-mb-3w">
          Étape optionnelle. Les identifiants permettent de lier la fiche à des référentiels externes (SIRET, ROR, Wikidata…).
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p className="fr-text--sm fr-mb-0" style={{ fontWeight: '600' }}>
          {identifiers.length === 0 ? 'Aucun identifiant' : `${identifiers.length} identifiant${identifiers.length > 1 ? 's' : ''}`}
        </p>
        <Button size="sm" tertiary borderless icon="ri-add-circle-line" iconPosition="left" onClick={onAdd}>
          Ajouter un identifiant
        </Button>
      </div>

      {identifiers.length === 0 && (
        <div className="fr-p-3w" style={{ background: 'var(--grey-975-75)', borderRadius: '4px', textAlign: 'center' }}>
          <p className="fr-text--sm fr-hint-text fr-mb-0">Aucun identifiant renseigné.</p>
        </div>
      )}

      {identifiers.map((row) => {
        const usedTypes = new Set(identifiers.filter((r) => r._key !== row._key).map((r) => r.type).filter(Boolean));
        const filteredOptions = identifierOptions.filter(
          (o) => !o.value || o.value === row.type || !usedTypes.has(o.value),
        );
        const normalizedValue = sanitizeIdentifierValue(row.type, row.value || '');
        const verificationLink = (row.type && row.value) ? getLink({ type: row.type, value: normalizedValue }) : '';
        let sourceBadge = null;
        if (row.fromRor) {
          const label = row.via ? `ROR (via ${row.via})` : 'ROR';
          sourceBadge = { label, cls: 'fr-badge--purple-glycine' };
        } else if (row.fromWikidata) {
          const label = row.via ? `Wikidata (via ${row.via})` : 'Wikidata';
          sourceBadge = { label, cls: 'fr-badge--green-emeraude' };
        }
        return (
          <div key={row._key} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 220px' }}>
                <Select
                  label="Type"
                  options={filteredOptions}
                  selected={row.type}
                  onChange={(e) => handleChangeType(row._key, e.target.value)}
                  hint={row.fromExisting ? 'Identifiant existant — modifiable' : null}
                />
              </div>
              <div style={{ flex: '1 1 auto' }}>
                <TextInput
                  label="Valeur"
                  hint={row.fromExisting ? 'Identifiant existant — modifiable' : null}
                  value={row.value}
                  onChange={(e) => handleChangeValue(row._key, e.target.value)}
                  message={validationErrors[row._key] || null}
                  messageType={validationErrors[row._key] ? 'error' : ''}
                />
              </div>
              <div style={{ paddingTop: '28px' }}>
                {!row.fromExisting && (
                  <Button
                    size="sm"
                    secondary
                    icon="ri-delete-bin-line"
                    title="Supprimer"
                    onClick={() => onRemove(row._key)}
                  />
                )}
                {!!verificationLink && (
                  <Button
                    size="sm"
                    tertiary
                    borderless
                    icon="ri-external-link-line"
                    title="Vérifier"
                    onClick={() => openExternalLink(verificationLink)}
                    style={{ marginLeft: '12px' }}
                  >
                    Vérifier
                  </Button>
                )}
              </div>
            </div>
            {sourceBadge && (
              <p className="fr-mb-0 fr-mt-1v" style={{ paddingLeft: '4px' }}>
                <span className={`fr-badge fr-badge--sm ${sourceBadge.cls}`}>{sourceBadge.label}</span>
                <span className="fr-text--xs fr-ml-1w" style={{ color: 'var(--grey-425-625)' }}>
                  {'Sera ajouté — importé depuis '}
                  {sourceBadge.label}
                  , pas encore en base
                </span>
              </p>
            )}
          </div>
        );
      })}

      <hr className="fr-mt-3w fr-mb-3w" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p className="fr-text--sm fr-mb-0" style={{ fontWeight: '600' }}>
          {socialMedias.length === 0
            ? 'Aucun réseau social'
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
        const socialMediaLink = toExternalUrl(row.account);
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
            <div style={{ paddingTop: '28px' }}>
              <Button
                size="sm"
                secondary
                icon="ri-delete-bin-line"
                title="Supprimer"
                onClick={() => onRemoveSocialMedia(row._key)}
              />
              {!!row.account && !smErrors[row._key] && (
                <Button
                  size="sm"
                  tertiary
                  borderless
                  icon="ri-external-link-line"
                  title="Vérifier"
                  onClick={() => openExternalLink(socialMediaLink)}
                  style={{ marginLeft: '12px' }}
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
  identifierOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onChangeType: PropTypes.func.isRequired,
  onChangeValue: PropTypes.func.isRequired,
  isExisting: PropTypes.bool.isRequired,
  existingStructureName: PropTypes.string,
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

StructureIdentifiersStep.defaultProps = {
  existingStructureName: null,
};
