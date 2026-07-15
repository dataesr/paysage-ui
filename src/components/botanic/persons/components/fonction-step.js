import {
  Accordion,
  AccordionItem,
  Checkbox,
  Col,
  Radio,
  RadioGroup,
  Row,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import DateInput from '../../../date-input';
import SearchBar from '../../../search-bar';

export default function FonctionStep({
  pastFunctions,
  pastContacts,
  mandate,
  on,
  errors,
  showErrors,
}) {
  const { relType, structure, conflicts, conflictsToClose } = mandate;

  return (
    <Row gutters>

      {!relType.selected && pastFunctions.length > 0 && (
        <Col n="12">
          <p className="fr-text--xs fr-mb-1w fr-hint-text">
            Fonctions déjà exercées — cliquez pour sélectionner :
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {pastFunctions.map((rt) => (
              <button
                key={rt.id}
                type="button"
                className={`fr-badge fr-badge--sm${rt.isCurrent ? ' fr-badge--success' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => on.selectRelType({ id: rt.id, name: rt.name })}
                title={rt.isCurrent ? 'Fonction actuellement en cours' : 'Fonction déjà exercée'}
              >
                {rt.name}
                {rt.isCurrent ? ' · en cours' : ''}
              </button>
            ))}
          </div>
        </Col>
      )}

      {structure.selected && conflicts.length > 0 && (
        <Col n="12">
          <div className="fr-alert fr-alert--warning">
            <p className="fr-alert__title">
              {`Conflit de mandat${relType.selected ? ` : "${relType.selected.name}"` : ''}`}
            </p>
            <p className="fr-text--sm fr-mb-1w">
              {conflicts.length === 1
                ? 'Une personne a déjà ce type de mandat dans cette structure :'
                : `${conflicts.length} personnes ont déjà ce type de mandat dans cette structure :`}
            </p>
            {conflicts.map((m) => {
              const personName = m.relatedObject?.displayName || m.relatedObjectId;
              const relName = m.relationType?.name || '';
              return (
                <div key={m.id} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexShrink: 0, cursor: 'pointer', fontSize: '13px' }}>
                      <input type="checkbox" checked={m.id in conflictsToClose} onChange={() => on.toggleConflict(m.id)} />
                      Clôturer
                    </label>
                    <div style={{ flex: 1, border: '1px solid var(--grey-925-125)', borderRadius: '4px', padding: '8px 12px', background: 'var(--grey-975-75)' }}>
                      <p className="fr-text--sm fr-mb-0"><strong>{personName}</strong></p>
                      {relName && <p className="fr-text--xs fr-mb-0" style={{ color: 'var(--grey-425-625)' }}>{relName}</p>}
                    </div>
                  </div>
                  {m.id in conflictsToClose && (
                    <div style={{ marginTop: '4px', marginLeft: '80px' }}>
                      <DateInput
                        label="Date de clôture"
                        hint="Laisser vide pour utiliser la date du jour"
                        value={conflictsToClose[m.id]}
                        onDateChange={(date) => on.setClosureDate(m.id, date)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Col>
      )}
      <Col n="12">
        <SearchBar
          buttonLabel="Rechercher"
          label="Structure"
          value={structure.selected ? '' : structure.query}
          placeholder="Rechercher une structure…"
          scope={structure.selected ? structure.selected.name : null}
          onChange={(e) => { on.unselectStructure(); on.searchStructure(e.target.value); }}
          onDeleteScope={on.unselectStructure}
          options={structure.options}
          onSelect={on.selectStructure}
          isSearching={structure.searching}
          size="lg"
        />
      </Col>
      <Col n="12">
        <SearchBar
          buttonLabel="Rechercher"
          label="Type de mandat / fonction"
          hint="Ex : Directeur général, Président, Chargé de mission…"
          required
          value={relType.selected ? '' : relType.query}
          placeholder="Rechercher un type de mandat…"
          scope={relType.selected ? relType.selected.name : null}
          onChange={(e) => { on.unselectRelType(); on.setRelTypeQuery(e.target.value); }}
          onDeleteScope={on.unselectRelType}
          options={relType.options}
          onSelect={on.selectRelType}
          isSearching={false}
          size="lg"
        />
        {showErrors && errors.relTypeId && (
          <p className="fr-error-text fr-text--sm fr-mt-1v">{errors.relTypeId}</p>
        )}
      </Col>

      <Col n="12">
        <Accordion>
          <AccordionItem initExpand title="Informations du mandat">
            <Row gutters>
              <Col n="12">
                <TextInput
                  label="Intitulé exact de la fonction"
                  hint="Précisez si vous avez des informations plus détaillées."
                  value={mandate.precision}
                  onChange={(e) => on.setPrecision(e.target.value)}
                />
              </Col>
              <Col n="12">
                <RadioGroup legend="Raison du mandat :" isInline>
                  <Radio label="Élection" onChange={() => on.setReason('election')} checked={mandate.reason === 'election'} />
                  <Radio label="Nomination" onChange={() => on.setReason('nomination')} checked={mandate.reason === 'nomination'} />
                </RadioGroup>
              </Col>
              <Col n="12">
                <Checkbox
                  label="Mandat par intérim"
                  checked={mandate.temporary}
                  onChange={() => on.setTemporary(!mandate.temporary)}
                />
              </Col>
              <Col n="12">
                <RadioGroup legend="Position du mandat :" isInline>
                  <Radio label="1er mandat" onChange={() => on.setPosition('1')} checked={mandate.position === '1'} />
                  <Radio label="2ème mandat" onChange={() => on.setPosition('2')} checked={mandate.position === '2'} />
                  <Radio label="3ème mandat et plus" onChange={() => on.setPosition('3+')} checked={mandate.position === '3+'} />
                  <Radio label="Sans objet" onChange={() => on.setPosition(null)} checked={!mandate.position} />
                </RadioGroup>
              </Col>
              {((!mandate.email && pastContacts.emails.length > 0)
                || (!mandate.personalEmail && pastContacts.personalEmails.length > 0)
                || (!mandate.phonenumber && pastContacts.phones.length > 0)) && (
                <Col n="12">
                  <div>
                    <span className="fr-text--xs fr-hint-text">Contacts précédents — cliquer pour pré-remplir :</span>
                    {!mandate.email && pastContacts.emails.length > 0 && (
                      <div className="fr-mb-2w" style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                        <span className="fr-text--xs">Email mandat :</span>
                        {pastContacts.emails.map((e) => (
                          <button
                            key={`email-${e}`}
                            type="button"
                            className="fr-badge fr-badge--sm fr-badge--blue-cumulus"
                            style={{ cursor: 'pointer' }}
                            onClick={() => on.setEmail(e)}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    )}
                    {!mandate.personalEmail && pastContacts.personalEmails.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                        <span className="fr-text--xs">Email nominatif :</span>
                        {pastContacts.personalEmails.map((e) => (
                          <button
                            key={`personal-${e}`}
                            type="button"
                            className="fr-badge fr-badge--sm fr-badge--blue-ecume"
                            style={{ cursor: 'pointer' }}
                            onClick={() => on.setPersonalEmail(e)}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    )}
                    {!mandate.phonenumber && pastContacts.phones.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                        <span className="fr-text--xs" style={{ flexShrink: 0, color: 'var(--grey-425-625)', minWidth: '130px' }}>Téléphone :</span>
                        {pastContacts.phones.map((p) => (
                          <button
                            key={`phone-${p}`}
                            type="button"
                            className="fr-badge fr-badge--sm fr-badge--green-emeraude"
                            style={{ cursor: 'pointer' }}
                            onClick={() => on.setPhonenumber(p)}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Col>
              )}
              <Col n="12 md-6">
                <TextInput label="Email associé au mandat" value={mandate.email} onChange={(e) => on.setEmail(e.target.value)} />
              </Col>
              <Col n="12 md-6">
                <TextInput label="Email nominatif" value={mandate.personalEmail} onChange={(e) => on.setPersonalEmail(e.target.value)} />
              </Col>
              <Col n="12 md-6">
                <TextInput label="Numéro de téléphone" value={mandate.phonenumber} onChange={(e) => on.setPhonenumber(e.target.value)} />
              </Col>
              <Col n="12 md-6">
                <DateInput value={mandate.startDate} label="Date de prise de fonction" onDateChange={on.setStartDate} />
              </Col>
              <Col n="12 md-6">
                <DateInput
                  value={mandate.endDatePrevisional}
                  label="Date de fin prévisionnelle"
                  onDateChange={on.setEndDatePrevisional}
                />
              </Col>
              <Col n="12">
                <SearchBar
                  buttonLabel="Rechercher"
                  value={mandate.startOT.query}
                  label="Texte officiel de début de fonction"
                  hint="Rechercher un texte officiel"
                  scope={mandate.startOT.name}
                  placeholder={mandate.startOT.name ? '' : 'Rechercher...'}
                  onChange={(e) => { mandate.startOT.setQuery(e.target.value); }}
                  options={mandate.startOT.options}
                  onSelect={mandate.startOT.select}
                  onDeleteScope={mandate.startOT.unselect}
                  isSearching={mandate.startOT.searching}
                />
              </Col>
              <Col n="12 md-6">
                <DateInput value={mandate.endDate} label="Date de fin de fonction" onDateChange={on.setEndDate} />
              </Col>
              <Col n="12">
                <SearchBar
                  buttonLabel="Rechercher"
                  value={mandate.endOT.query}
                  label="Texte officiel de fin de fonction"
                  hint="Rechercher un texte officiel"
                  scope={mandate.endOT.name}
                  placeholder={mandate.endOT.name ? '' : 'Rechercher...'}
                  onChange={(e) => { mandate.endOT.setQuery(e.target.value); }}
                  options={mandate.endOT.options}
                  onSelect={mandate.endOT.select}
                  onDeleteScope={mandate.endOT.unselect}
                  isSearching={mandate.endOT.searching}
                />
              </Col>
            </Row>
          </AccordionItem>
        </Accordion>
      </Col>
    </Row>
  );
}

FonctionStep.propTypes = {
  pastFunctions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    isCurrent: PropTypes.bool,
  })),
  pastContacts: PropTypes.shape({
    emails: PropTypes.arrayOf(PropTypes.string),
    personalEmails: PropTypes.arrayOf(PropTypes.string),
    phones: PropTypes.arrayOf(PropTypes.string),
  }),
  mandate: PropTypes.shape({
    relType: PropTypes.shape({
      query: PropTypes.string,
      options: PropTypes.array,
      selected: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
    }).isRequired,
    structure: PropTypes.shape({
      query: PropTypes.string,
      options: PropTypes.array,
      searching: PropTypes.bool,
      selected: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
    }).isRequired,
    conflicts: PropTypes.array,
    conflictsToClose: PropTypes.object,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    endDatePrevisional: PropTypes.string,
    active: PropTypes.bool,
    reason: PropTypes.string,
    temporary: PropTypes.bool,
    position: PropTypes.string,
    precision: PropTypes.string,
    email: PropTypes.string,
    personalEmail: PropTypes.string,
    phonenumber: PropTypes.string,
    startOT: PropTypes.object,
    endOT: PropTypes.object,
  }).isRequired,
  on: PropTypes.shape({
    setRelTypeQuery: PropTypes.func,
    selectRelType: PropTypes.func,
    unselectRelType: PropTypes.func,
    searchStructure: PropTypes.func,
    selectStructure: PropTypes.func,
    unselectStructure: PropTypes.func,
    toggleConflict: PropTypes.func,
    setClosureDate: PropTypes.func,
    setStartDate: PropTypes.func,
    setEndDate: PropTypes.func,
    setEndDatePrevisional: PropTypes.func,
    setActive: PropTypes.func,
    setReason: PropTypes.func,
    setTemporary: PropTypes.func,
    setPosition: PropTypes.func,
    setPrecision: PropTypes.func,
    setEmail: PropTypes.func,
    setPersonalEmail: PropTypes.func,
    setPhonenumber: PropTypes.func,
  }).isRequired,
  errors: PropTypes.shape({ relTypeId: PropTypes.string }),
  showErrors: PropTypes.bool,
};

FonctionStep.defaultProps = {
  pastFunctions: [],
  pastContacts: { emails: [], personalEmails: [], phones: [] },
  errors: {},
  showErrors: false,
};
