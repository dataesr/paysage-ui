import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';

const STATUS_LABELS = {
  found: { label: 'Trouvé', type: 'success' },
  not_found: { label: 'Non trouvé', type: 'error' },
  not_found_ambiguous: { label: 'Homonymes', type: 'warning' },
  multiple: { label: 'Homonymes', type: 'warning' },
  empty: { label: 'Vide', type: 'new' },
  error: { label: 'Erreur', type: 'error' },
  unknown: { label: 'Inconnu', type: 'info' },
};

const DISPLAYED_ID_TYPES = ['idref', 'orcid'];

const ID_URLS = {
  orcid: (v) => `https://orcid.org/${v}`,
  idref: (v) => `https://www.idref.fr/${v}`,
};

const collectIdTypes = (results, selectedMatches) => {
  const types = new Set();
  results.forEach((row) => {
    const identifiers = row.status === 'not_found_ambiguous' && selectedMatches[row.index]
      ? selectedMatches[row.index].identifiers
      : row.identifiers;
    (identifiers || []).forEach((o) => Object.keys(o)
      .filter((k) => DISPLAYED_ID_TYPES.includes(k))
      .forEach((k) => types.add(k)));
  });
  return Array.from(types);
};

const getId = (identifiers, type) => (identifiers || []).find((o) => o[type] !== undefined)?.[type] ?? '';

const formatDate = (dateStr) => dateStr?.slice(0, 10) ?? null;

function HomonymModal({ row, isOpen, onClose, selectedMatch, onSelect }) {
  return (
    <Modal isOpen={isOpen} size="lg" hide={onClose}>
      <ModalTitle>
        Homonymes pour
        {' '}
        {row.firstName}
        {' '}
        {row.lastName}
      </ModalTitle>
      <ModalContent>
        <div className="fr-grid-row fr-grid-row--gutters">
          {row.potentialMatches.map((match) => {
            const isSelected = selectedMatch?.idref === match.idref;
            return (
              <div key={match.idref} className="fr-col-12 fr-col-md-6">
                <div className={`fr-card fr-card--shadow${isSelected ? ' fr-background-alt--blue-france' : ''}`}>
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <h4 className="fr-card__title">{match.full_name}</h4>
                      {match.birth_date && (
                        <p className="fr-card__detail">
                          Né·e le
                          {' '}
                          {formatDate(match.birth_date)}
                        </p>
                      )}
                      {(match.description || []).map((desc, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <p key={i} className="fr-text--sm fr-mb-1v">{desc}</p>
                      ))}
                      {match.job && (
                        <p className="fr-text--sm fr-mb-1v">
                          <strong>Fonction :</strong>
                          {' '}
                          {match.job}
                        </p>
                      )}
                      <div className="fr-mt-1w">
                        {(match.identifiers || []).map((idObj) => Object.entries(idObj).map(([k, v]) => {
                          const urlFn = ID_URLS[k];
                          return (
                            <span key={k} className="fr-badge fr-badge--sm fr-badge--info fr-mr-1w fr-mb-1w">
                              {k}
                              {' '}
                              {urlFn ? (
                                <a href={urlFn(v)} target="_blank" rel="noreferrer noopener" style={{ color: 'inherit' }}>{v}</a>
                              ) : v}
                            </span>
                          );
                        }))}
                      </div>
                    </div>
                    <div className="fr-card__footer">
                      <Button
                        size="sm"
                        onClick={() => { onSelect(isSelected ? null : match); onClose(); }}
                        secondary={!isSelected}
                      >
                        {isSelected ? '✓ Sélectionné' : 'Choisir cette personne'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ModalContent>
    </Modal>
  );
}

HomonymModal.propTypes = {
  row: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    potentialMatches: PropTypes.array,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedMatch: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
};

HomonymModal.defaultProps = { selectedMatch: null };

function PydrefResultsTable({ results, selectedMatches, onSelectMatch }) {
  const [openModalIndex, setOpenModalIndex] = useState(null);

  if (!results || results.length === 0) return null;

  const idTypes = collectIdTypes(results, selectedMatches);

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {results.map((row) => {
        const isAmbiguous = row.status === 'not_found_ambiguous' && row.potentialMatches?.length > 0;
        if (!isAmbiguous) return null;
        return (
          <HomonymModal
            key={row.index}
            row={row}
            isOpen={openModalIndex === row.index}
            onClose={() => setOpenModalIndex(null)}
            selectedMatch={selectedMatches[row.index]}
            onSelect={(match) => onSelectMatch(row.index, match)}
          />
        );
      })}
      <div className="fr-table fr-table--bordered" style={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Statut</th>
              {idTypes.map((t) => <th key={t}>{t}</th>)}
              <th scope="col" aria-label="Actions" style={{ width: '96px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => {
              const statusInfo = STATUS_LABELS[row.status] || STATUS_LABELS.unknown;
              const isAmbiguous = row.status === 'not_found_ambiguous' && row.potentialMatches?.length > 0;
              const selectedMatch = selectedMatches[row.index];
              const identifiers = selectedMatch ? selectedMatch.identifiers : row.identifiers;

              return (
                <tr key={row.index}>
                  <td>{row.lastName}</td>
                  <td>{row.firstName}</td>
                  <td>
                    <span className={`fr-badge fr-badge--sm fr-badge--${statusInfo.type}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  {idTypes.map((t) => {
                    const val = getId(identifiers, t);
                    const urlFn = ID_URLS[t];
                    return (
                      <td key={t} style={{ whiteSpace: 'nowrap' }}>
                        {val && urlFn ? (
                          <a href={urlFn(val)} target="_blank" rel="noreferrer noopener">{val}</a>
                        ) : val}
                      </td>
                    );
                  })}
                  <td>
                    {isAmbiguous && (
                      <Button
                        size="sm"
                        secondary
                        onClick={() => setOpenModalIndex(row.index)}
                        icon={selectedMatch ? 'ri-checkbox-circle-line' : 'ri-group-line'}
                        iconPosition="left"
                      >
                        {selectedMatch ? 'Changer' : `Voir (${row.potentialMatches.length})`}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

PydrefResultsTable.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.number,
    lastName: PropTypes.string,
    firstName: PropTypes.string,
    status: PropTypes.string,
    nb_homonyms: PropTypes.number,
    identifiers: PropTypes.array,
    potentialMatches: PropTypes.array,
  })).isRequired,
  selectedMatches: PropTypes.object.isRequired,
  onSelectMatch: PropTypes.func.isRequired,
};

export default PydrefResultsTable;
