import PropTypes from 'prop-types';
import { Link } from '@dataesr/react-dsfr';
import Button from '../button';

function IdRefMatchCard({ m, isSelected, onSelect, onAdoptName }) {
  const birthStr = m.birth_date
    ? m.birth_date.slice(0, 10).split('-').reverse().join('/')
    : null;

  return (
    <div
      className="fr-p-2w fr-mb-1w"
      style={{
        border: `2px solid ${isSelected ? 'var(--blue-france-sun-113-625)' : 'var(--grey-900-175)'}`,
        background: isSelected ? 'var(--blue-france-975-75)' : 'var(--grey-975-75)',
      }}
    >
      <div className="fr-grid-row fr-grid-row--top">
        <div className="fr-col">
          <p className="fr-text--sm fr-text--bold fr-mb-1v">
            {`${m.full_name} `}
            <Link
              href={`https://www.idref.fr/${m.idref?.replace(/^idref/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="fr-text--xs"
            >
              {m.idref?.replace(/^idref/, '')}
            </Link>
          </p>
          {birthStr && <p className="fr-text--xs fr-mb-1v">{`Né(e) le ${birthStr}`}</p>}
          {m.job && <p className="fr-text--xs fr-mb-1v">{m.job}</p>}
          {(m.description || []).map((d, i) => (
            <p key={i} className="fr-text--xs fr-mb-1v">{d}</p>
          ))}
          {(m.identifiers || []).length > 0 && (
            <div className="fr-mt-1w">
              {(m.identifiers || []).flatMap((idObj) => Object.entries(idObj)).map(([k, v]) => (
                <span key={k} className="fr-badge fr-badge--sm fr-badge--blue-ecume fr-mr-1w fr-mb-1v">
                  {`${k} : ${v}`}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="fr-col-auto fr-pl-2w">
          <Button
            size="sm"
            secondary={!isSelected}
            icon={isSelected ? 'ri-check-line' : 'ri-user-received-2-line'}
            iconPosition="left"
            onClick={() => onSelect(isSelected ? null : m)}
          >
            {isSelected ? 'Sélectionné' : 'Utiliser'}
          </Button>
          {onAdoptName && m.full_name && (
            <Button
              className="fr-mt-1w"
              size="sm"
              tertiary
              icon="ri-user-line"
              iconPosition="left"
              onClick={() => onAdoptName(m.full_name)}
            >
              Adopter le nom
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

IdRefMatchCard.propTypes = {
  m: PropTypes.shape({
    full_name: PropTypes.string,
    birth_date: PropTypes.string,
    job: PropTypes.string,
    description: PropTypes.arrayOf(PropTypes.string),
    idref: PropTypes.string,
    identifiers: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onAdoptName: PropTypes.func,
};
IdRefMatchCard.defaultProps = { onAdoptName: null };

function DuplicateWarning({ info }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 10px',
      marginBottom: '8px',
      background: 'var(--warning-950-100)',
      borderLeft: '3px solid var(--warning-425-625)',
      borderRadius: '0 4px 4px 0',
    }}
    >
      <span className="fr-text--xs fr-mb-0">
        Cette fiche existe déjà dans Paysage :
        {' '}
        <a href={`/structures/${info.id}`} target="_blank" rel="noreferrer">{info.name}</a>
      </span>
    </div>
  );
}

DuplicateWarning.propTypes = {
  info: PropTypes.shape({ id: PropTypes.string.isRequired, name: PropTypes.string.isRequired }).isRequired,
};

function WikidataMatchCard({
  m, isSelected, onSelect, entityType, onAdoptName, duplicateInfo,
}) {
  const fmtDate = (d) => (d ? d.split('-').reverse().join('/') : null);

  return (
    <div
      className="fr-p-2w fr-mb-1w"
      style={{
        border: `2px solid ${isSelected ? 'var(--blue-france-sun-113-625)' : 'var(--grey-900-175)'}`,
        background: isSelected ? 'var(--blue-france-975-75)' : 'var(--grey-975-75)',
      }}
    >
      {duplicateInfo && <DuplicateWarning info={duplicateInfo} />}
      <div className="fr-grid-row fr-grid-row--top">
        <div className="fr-col">
          <p className="fr-text--sm fr-text--bold fr-mb-1v">
            {`${m?.label} `}
            <Link
              href={`https://www.wikidata.org/wiki/${m.qid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="fr-text--xs"
            >
              {m.qid}
            </Link>
          </p>
          {m.description && <p className="fr-text--xs fr-mb-1v">{`Activit\u00e9 : ${m.description}`}</p>}
          {entityType === 'person' && m.birthDate && (
            <p className="fr-text--xs fr-mb-1v">{`Né(e) le ${fmtDate(m.birthDate)}`}</p>
          )}
          {entityType === 'person' && m.gender && (
            <p className="fr-text--xs fr-mb-1v">{m.gender}</p>
          )}
          {entityType === 'structure' && m.inceptionDate && (
            <p className="fr-text--xs fr-mb-1v">{`Fondée le ${fmtDate(m.inceptionDate)}`}</p>
          )}
          {entityType === 'structure' && m.website && (
            <Link
              href={m.website}
              target="_blank"
              rel="noopener noreferrer"
              className="fr-text--xs fr-mb-1v"
              style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {m.website}
            </Link>
          )}
          {m.identifiers?.length > 0 && (
            <div className="fr-mt-1w">
              {m.identifiers.map(({ type: idType, value: idValue }) => (
                <span key={idType} className="fr-badge fr-badge--sm fr-badge--green-emeraude fr-mr-1w fr-mb-1v">
                  {`${idType} : ${idValue}`}
                </span>
              ))}
            </div>
          )}
          {m.socialMedias?.length > 0 && (
            <div className="fr-mt-1w">
              {m.socialMedias.map(({ type, account }) => (
                <a key={type} href={account} target="_blank" rel="noopener noreferrer" className="fr-tag fr-tag--sm fr-mr-1w fr-mb-1v">
                  {type}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="fr-col-auto fr-pl-2w">
          <Button
            size="sm"
            secondary={!isSelected}
            icon={isSelected ? 'ri-check-line' : 'ri-database-2-line'}
            iconPosition="left"
            onClick={() => onSelect(isSelected ? null : m)}
          >
            {isSelected ? 'Sélectionné' : 'Utiliser'}
          </Button>
          {onAdoptName && m.label && (
            <Button
              className="fr-mt-1w"
              size="sm"
              tertiary
              icon="ri-user-line"
              iconPosition="left"
              onClick={() => onAdoptName(m.label)}
            >
              Adopter le nom
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

WikidataMatchCard.propTypes = {
  m: PropTypes.shape({
    qid: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    birthDate: PropTypes.string,
    gender: PropTypes.string,
    inceptionDate: PropTypes.string,
    website: PropTypes.string,
    identifiers: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string, value: PropTypes.string })),
    socialMedias: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string, account: PropTypes.string })),
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  entityType: PropTypes.oneOf(['person', 'structure']).isRequired,
  onAdoptName: PropTypes.func,
  duplicateInfo: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
};
WikidataMatchCard.defaultProps = { onAdoptName: null, duplicateInfo: null };

function RorMatchCard({ m, isSelected, onSelect, onAdoptName, duplicateInfo }) {
  return (
    <div
      className="fr-p-2w fr-mb-1w"
      style={{
        border: `2px solid ${isSelected ? 'var(--blue-france-sun-113-625)' : 'var(--grey-900-175)'}`,
        background: isSelected ? 'var(--blue-france-975-75)' : 'var(--grey-975-75)',
      }}
    >
      {duplicateInfo && <DuplicateWarning info={duplicateInfo} />}
      <div className="fr-grid-row fr-grid-row--top">
        <div className="fr-col">
          <p className="fr-text--sm fr-text--bold fr-mb-1v">
            {`${m.label} `}
            <Link
              href={`https://ror.org/${m.rorId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="fr-text--xs"
            >
              {m.rorId}
            </Link>
          </p>
          {m.description && <p className="fr-text--xs fr-mb-1v">{m.description}</p>}
          {m.country && <p className="fr-text--xs fr-mb-1v">{m.country}</p>}
          {m.website && (
            <Link
              href={m.website}
              target="_blank"
              rel="noopener noreferrer"
              className="fr-text--xs fr-mb-1v"
              style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {m.website}
            </Link>
          )}
          {m.identifiers?.length > 0 && (
            <div className="fr-mt-1w">
              {m.identifiers.map(({ type: idType, value: idValue }) => (
                <span key={idType} className="fr-badge fr-badge--sm fr-badge--purple-glycine fr-mr-1w fr-mb-1v">
                  {`${idType} : ${idValue}`}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="fr-col-auto fr-pl-2w">
          <Button
            size="sm"
            secondary={!isSelected}
            icon={isSelected ? 'ri-check-line' : 'ri-database-2-line'}
            iconPosition="left"
            onClick={() => onSelect(isSelected ? null : m)}
          >
            {isSelected ? 'Sélectionné' : 'Utiliser'}
          </Button>
          {onAdoptName && m.label && (
            <Button
              className="fr-mt-1w"
              size="sm"
              tertiary
              icon="ri-building-2-line"
              iconPosition="left"
              onClick={() => onAdoptName(m.label)}
            >
              Adopter le nom
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

RorMatchCard.propTypes = {
  m: PropTypes.shape({
    rorId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    country: PropTypes.string,
    website: PropTypes.string,
    identifiers: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string, value: PropTypes.string })),
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onAdoptName: PropTypes.func,
  duplicateInfo: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
};
RorMatchCard.defaultProps = { onAdoptName: null, duplicateInfo: null };

function SourceHeader({ badge, badgeClass, loading, count }) {
  return (
    <p className="fr-mb-1w">
      <span className={`fr-badge fr-badge--sm fr-mr-1w ${badgeClass}`}>{badge}</span>
      <span className="fr-text--xs">
        {loading ? 'Recherche en cours...' : `${count} résultat${count !== 1 ? 's' : ''}`}
      </span>
    </p>
  );
}

SourceHeader.propTypes = {
  badge: PropTypes.string.isRequired,
  badgeClass: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired,
};

export default function EnrichmentPanel({
  pydrefLoading,
  pydrefMatches,
  selectedPydrefMatch,
  onSelectPydref,
  wikidataLoading,
  wikidataMatches,
  selectedWikidataMatch,
  onSelectWikidata,
  rorLoading,
  rorMatches,
  selectedRorMatch,
  onSelectRor,
  entityType,
  onAdoptName,
  externalDuplicates,
}) {
  const hasPydref = onSelectPydref != null;
  const pydrefVisible = hasPydref && (pydrefLoading || pydrefMatches.length > 0);
  const wikidataVisible = wikidataLoading || wikidataMatches.length > 0;
  const rorVisible = (onSelectRor != null) && (rorLoading || rorMatches.length > 0);

  if (!pydrefVisible && !wikidataVisible && !rorVisible) return null;

  return (
    <div
      className="fr-mt-3w fr-pt-2w"
      style={{ borderTop: '1px solid var(--grey-925-125)' }}
    >
      <p className="fr-text--sm fr-text--bold fr-mb-2w">
        <i className="ri-database-2-line fr-mr-1v" aria-hidden="true" />
        Données trouvées dans les référentiels externes
      </p>

      {pydrefVisible && (
        <div className="fr-mb-3w">
          <SourceHeader
            badge="IdRef / Pydref"
            badgeClass="fr-badge--blue-ecume"
            loading={pydrefLoading}
            count={pydrefMatches.length}
          />
          {!pydrefLoading && pydrefMatches.map((m) => (
            <IdRefMatchCard
              key={m.idref || m.full_name}
              m={m}
              isSelected={!!(selectedPydrefMatch?.idref && selectedPydrefMatch.idref === m.idref)}
              onSelect={onSelectPydref}
              onAdoptName={onAdoptName}
            />
          ))}
        </div>
      )}

      {wikidataVisible && (
        <div className="fr-mb-3w">
          <SourceHeader
            badge="Wikidata"
            badgeClass="fr-badge--green-emeraude"
            loading={wikidataLoading}
            count={wikidataMatches.length}
          />
          {!wikidataLoading && wikidataMatches.map((m) => (
            <WikidataMatchCard
              key={m.qid}
              m={m}
              isSelected={selectedWikidataMatch?.qid === m.qid}
              onSelect={onSelectWikidata}
              entityType={entityType}
              onAdoptName={onAdoptName}
              duplicateInfo={externalDuplicates?.[m.qid] || null}
            />
          ))}
        </div>
      )}

      {rorVisible && (
        <div>
          <SourceHeader
            badge="ROR"
            badgeClass="fr-badge--purple-glycine"
            loading={rorLoading}
            count={rorMatches.length}
          />
          {!rorLoading && rorMatches.map((m) => (
            <RorMatchCard
              key={m.rorId}
              m={m}
              isSelected={selectedRorMatch?.rorId === m.rorId}
              onSelect={onSelectRor}
              onAdoptName={onAdoptName}
              duplicateInfo={externalDuplicates?.[m.rorId] || null}
            />
          ))}
        </div>
      )}
    </div>
  );
}

EnrichmentPanel.propTypes = {
  pydrefLoading: PropTypes.bool,
  pydrefMatches: PropTypes.arrayOf(PropTypes.shape({})),
  selectedPydrefMatch: PropTypes.shape({ idref: PropTypes.string }),
  onSelectPydref: PropTypes.func,
  wikidataLoading: PropTypes.bool.isRequired,
  wikidataMatches: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedWikidataMatch: PropTypes.shape({ qid: PropTypes.string }),
  onSelectWikidata: PropTypes.func.isRequired,
  rorLoading: PropTypes.bool,
  rorMatches: PropTypes.arrayOf(PropTypes.shape({})),
  selectedRorMatch: PropTypes.shape({ rorId: PropTypes.string }),
  onSelectRor: PropTypes.func,
  entityType: PropTypes.oneOf(['person', 'structure']),
  onAdoptName: PropTypes.func,
  externalDuplicates: PropTypes.shape({}),
};

EnrichmentPanel.defaultProps = {
  pydrefLoading: false,
  pydrefMatches: [],
  selectedPydrefMatch: null,
  onSelectPydref: null,
  selectedWikidataMatch: null,
  rorLoading: false,
  rorMatches: [],
  selectedRorMatch: null,
  onSelectRor: null,
  entityType: 'person',
  onAdoptName: null,
  externalDuplicates: null,
};
