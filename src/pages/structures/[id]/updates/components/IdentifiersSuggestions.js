/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from '@dataesr/react-dsfr';
import useNotice from '../../../../../hooks/useNotice';
import api from '../../../../../utils/api';
import getLink from '../../../../../utils/get-links';

export function IdentifierSuggestionUpdate({ suggestion, reload, paysageData }) {
  const [isLoading, setIsLoading] = useState(false);
  const { notice } = useNotice();
  const normalizedValue = suggestion.value?.toLowerCase().trim();
  const verificationLink = getLink({ type: suggestion.type, value: normalizedValue });
  const currentIdentifier = paysageData?.currentIdentifiers
    ?.find((identifier) => identifier.type === suggestion.type);

  const handleAction = async (status) => {
    setIsLoading(true);
    try {
      if (status === 'accepted') {
        if (currentIdentifier?.id) {
          await api.patch(
            `/structures/${paysageData?.id}/identifiers/${currentIdentifier.id}`,
            {
              type: suggestion.type,
              value: suggestion.value,
              active: true,
            },
          );
        } else {
          await api.post(
            `/structures/${paysageData?.id}/identifiers`,
            {
              type: suggestion.type,
              value: suggestion.value,
              active: true,
            },
          );
        }
      }

      await api.patch(`/structures-identifier/updates/${suggestion._id}`, { status });

      notice({ type: 'success', text: status === 'accepted' ? 'Identifiant mis à jour' : 'Suggestion rejetée' });
      reload();
    } catch (e) {
      notice({ type: 'error', text: 'Une erreur est survenue' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <i>
        Vérifier :
        {' '}
        <Link target="_blank" href={verificationLink}>{suggestion.type}</Link>
      </i>

      {currentIdentifier?.value && (
        <p className="fr-card__detail">
          {suggestion.status === 'pending'
            ? 'Valeur actuelle :'
            : 'Valeur actuelle (au moment du traitement) :'}
          {' '}
          <span className="fr-text--bold">{currentIdentifier.value}</span>
        </p>
      )}

      <p className="fr-card__detail fr-mb-2w">
        {suggestion.status === 'pending'
          ? 'Valeur suggérée :'
          : suggestion.status === 'accepted'
            ? 'Valeur acceptée :'
            : 'Valeur rejetée :'}
        {' '}
        <span className="fr-text--bold">{suggestion.value}</span>
      </p>

      {suggestion.status === 'pending' ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="fr-btn fr-btn--sm"
            disabled={isLoading}
            onClick={() => handleAction('accepted')}
          >
            Accepter
          </button>
          <button
            type="button"
            className="fr-btn fr-btn--sm fr-btn--secondary"
            disabled={isLoading}
            onClick={() => handleAction('rejected')}
          >
            Rejeter
          </button>
        </div>
      ) : (
        <p className="fr-card__detail fr-text--sm fr-mb-0" style={{ fontStyle: 'italic' }}>
          {suggestion.status === 'accepted'
            ? '✅ Suggestion acceptée'
            : '❌ Suggestion rejetée'}
          {suggestion.treatedAt
            ? ` le ${new Date(suggestion.treatedAt).toLocaleDateString('fr-FR')}`
            : ''}
          {' '}
          — cette information peut ne plus refléter la valeur actuelle si celle-ci a été modifiée depuis.
        </p>
      )}
    </div>
  );
}

IdentifierSuggestionUpdate.propTypes = {
  suggestion: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired,
  paysageData: PropTypes.object,
};

IdentifierSuggestionUpdate.defaultProps = {
  paysageData: {},
};
