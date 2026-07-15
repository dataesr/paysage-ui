import { useMemo } from 'react';
import PropTypes from 'prop-types';
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
import SearchBar from '../../../search-bar';
import DateInput from '../../../date-input';
import Button from '../../../button';
import EntityField from './entity-field';

function ContactSuggestions({ suggestions, onFill }) {
  const groups = [
    { key: 'emails', field: 'email', label: 'Emails de fonction' },
    { key: 'personalEmails', field: 'personalEmail', label: 'Emails nominatifs' },
    { key: 'phones', field: 'phonenumber', label: 'Téléphones' },
  ].filter((g) => (suggestions[g.key] || []).length > 0);
  if (groups.length === 0) return null;
  return (
    <Col n="12">
      {groups.map((g) => (
        <div key={g.key} className="fr-mb-1w">
          <p className="fr-text--xs fr-hint-text fr-mb-1v">{`${g.label} déjà utilisés — cliquez pour reprendre :`}</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {suggestions[g.key].map((val) => (
              <button
                key={val}
                type="button"
                className="fr-badge fr-badge--sm fr-badge--blue-cumulus"
                style={{ cursor: 'pointer' }}
                onClick={() => onFill(g.field, val)}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      ))}
    </Col>
  );
}

ContactSuggestions.propTypes = {
  suggestions: PropTypes.shape({
    emails: PropTypes.arrayOf(PropTypes.string),
    personalEmails: PropTypes.arrayOf(PropTypes.string),
    phones: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onFill: PropTypes.func.isRequired,
};

export default function MandateRow({
  position,
  row,
  allRelationTypes,
  onPersonSelect,
  onPersonUnselect,
  onRelTypeQuery,
  onRelTypeSelect,
  onRelTypeUnselect,
  onStructureSelect,
  onStructureUnselect,
  onPersonRequestCreate,
  onStructureRequestCreate,
  onField,
  onToggleClosure,
  onSetClosureDate,
  onFillContact,
  onRemove,
  canRemove,
  showErrors,
  defaultClosureDate,
}) {
  const relTypeOptions = useMemo(() => {
    const q = (row.relTypeQuery || '').toLowerCase().trim();
    const list = q
      ? allRelationTypes.filter((rt) => rt.name.toLowerCase().includes(q))
      : allRelationTypes;
    return list.slice(0, 30).map((rt) => ({ id: rt.id, name: rt.name }));
  }, [row.relTypeQuery, allRelationTypes]);

  const missing = {
    person: showErrors && !row.person,
    relType: showErrors && !row.relType,
    structure: showErrors && !row.structure,
  };

  const closureCandidates = (row.closureCandidates || []).filter(
    (c) => row.relType && c.relTypeId === row.relType.id,
  );

  return (
    <div
      className="fr-p-2w fr-mb-2w"
      style={{ border: '1px solid var(--grey-900-175)', borderRadius: '4px', background: 'var(--grey-975-75)' }}
    >
      <Row gutters>
        <Col n="12">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="fr-text--sm fr-text--bold fr-mb-0">{`Mandat ${position}`}</p>
            {canRemove && (
              <Button size="sm" tertiary borderless icon="ri-delete-bin-line" iconPosition="left" onClick={onRemove}>
                Retirer
              </Button>
            )}
          </div>
        </Col>

        <Col n="12">
          <EntityField
            type="persons"
            label="Personne"
            required
            selected={row.person}
            onSelect={onPersonSelect}
            onUnselect={onPersonUnselect}
            onRequestCreate={onPersonRequestCreate}
          />
          {missing.person && <p className="fr-error-text fr-text--sm fr-mt-1v">Sélectionnez ou créez une personne.</p>}
        </Col>

        <Col n="12 md-6">
          <SearchBar
            buttonLabel="Rechercher"
            label="Type de mandat / fonction"
            required
            placeholder="Ex : Président, Directeur général…"
            value={row.relType ? '' : row.relTypeQuery}
            scope={row.relType ? row.relType.name : null}
            onDeleteScope={onRelTypeUnselect}
            onChange={(e) => onRelTypeQuery(e.target.value)}
            options={relTypeOptions}
            onSelect={onRelTypeSelect}
            isSearching={false}
          />
          {missing.relType && <p className="fr-error-text fr-text--sm fr-mt-1v">Choisissez un type de mandat.</p>}
        </Col>

        <Col n="12 md-6">
          <EntityField
            type="structures"
            label="Structure"
            required
            selected={row.structure}
            onSelect={onStructureSelect}
            onUnselect={onStructureUnselect}
            onRequestCreate={onStructureRequestCreate}
          />
          {missing.structure && <p className="fr-error-text fr-text--sm fr-mt-1v">Sélectionnez ou créez une structure.</p>}
        </Col>

        <Col n="12 md-6">
          <DateInput
            label="Date de début du mandat"
            hint="Pré-remplie depuis le texte officiel si disponible"
            value={row.startDate}
            onDateChange={(v) => onField('startDate', v)}
          />
        </Col>
        <Col n="12 md-6">
          <DateInput
            label="Date de fin prévisionnelle du mandat"
            hint="Pré-remplie depuis le texte officiel si disponible"
            value={row.endDatePrevisional}
            onDateChange={(v) => onField('endDatePrevisional', v)}
          />
        </Col>
        <Col n="12 md-6">
          <DateInput
            label="Date de fin du mandat"
            hint="Pré-remplie depuis le texte officiel si disponible. Laisser vide si le mandat est en cours."
            value={row.endDate}
            onDateChange={(v) => onField('endDate', v)}
          />
        </Col>

        {closureCandidates.length > 0 && (
          <Col n="12">
            <div className="fr-p-2w" style={{ background: 'var(--grey-975-75)', borderRadius: '4px' }}>
              <p className="fr-text--sm fr-text--bold fr-mb-1v">Clôturer les mandats précédents (personnes remplacées)</p>
              <p className="fr-text--xs fr-hint-text fr-mb-1w">
                Sélectionnez les personnes remplacées. Le texte juridique de fin sera celui de cet assistant.
              </p>
              {closureCandidates.map((c) => (
                <div key={c.id} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexShrink: 0, cursor: 'pointer', fontSize: '13px' }}>
                      <input type="checkbox" checked={c.id in (row.closures || {})} onChange={() => onToggleClosure(c.id)} />
                      Clôturer
                    </label>
                    <div style={{ flex: 1, border: '1px solid var(--grey-925-125)', borderRadius: '4px', padding: '8px 12px', background: 'var(--grey-975-75)' }}>
                      <p className="fr-text--sm fr-mb-0"><strong>{c.personName}</strong></p>
                      {c.relTypeName && <p className="fr-text--xs fr-mb-0" style={{ color: 'var(--grey-425-625)' }}>{c.relTypeName}</p>}
                    </div>
                  </div>
                  {c.id in (row.closures || {}) && (
                    <div style={{ marginTop: '4px', marginLeft: '80px' }}>
                      <DateInput
                        label="Date de fin"
                        hint={defaultClosureDate ? `Par défaut : ${defaultClosureDate}` : 'Laisser vide pour la date du jour'}
                        value={row.closures[c.id]}
                        onDateChange={(date) => onSetClosureDate(c.id, date)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Col>
        )}

        <Col n="12">
          <Accordion>
            <AccordionItem initExpand title="Informations du mandat">
              <Row gutters>
                <Col n="12">
                  <TextInput
                    label="Intitulé exact de la fonction"
                    hint="Précisez si vous avez des informations plus détaillées."
                    value={row.precision}
                    onChange={(e) => onField('precision', e.target.value)}
                  />
                </Col>
                <Col n="12">
                  <RadioGroup legend="Raison du mandat :" isInline>
                    <Radio label="Élection" onChange={() => onField('reason', 'election')} checked={row.reason === 'election'} />
                    <Radio label="Nomination" onChange={() => onField('reason', 'nomination')} checked={row.reason === 'nomination'} />
                    <Radio label="Sans objet" onChange={() => onField('reason', null)} checked={!row.reason} />
                  </RadioGroup>
                </Col>
                <Col n="12">
                  <Checkbox
                    label="Mandat par intérim"
                    checked={row.temporary}
                    onChange={() => onField('temporary', !row.temporary)}
                  />
                </Col>
                {row.contactSuggestions && <ContactSuggestions suggestions={row.contactSuggestions} onFill={onFillContact} />}
                <Col n="12 md-4">
                  <TextInput
                    label="Email de fonction"
                    value={row.email}
                    onChange={(e) => onField('email', e.target.value)}
                  />
                </Col>
                <Col n="12 md-4">
                  <TextInput
                    label="Email nominatif"
                    value={row.personalEmail}
                    onChange={(e) => onField('personalEmail', e.target.value)}
                  />
                </Col>
                <Col n="12 md-4">
                  <TextInput
                    label="Téléphone"
                    value={row.phonenumber}
                    onChange={(e) => onField('phonenumber', e.target.value)}
                  />
                </Col>
              </Row>
            </AccordionItem>
          </Accordion>
        </Col>
      </Row>
    </div>
  );
}

MandateRow.propTypes = {
  position: PropTypes.number.isRequired,
  row: PropTypes.shape({
    person: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
    relType: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
    relTypeQuery: PropTypes.string,
    structure: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    endDatePrevisional: PropTypes.string,
    precision: PropTypes.string,
    reason: PropTypes.string,
    temporary: PropTypes.bool,
    email: PropTypes.string,
    personalEmail: PropTypes.string,
    phonenumber: PropTypes.string,
    closureCandidates: PropTypes.arrayOf(PropTypes.shape({})),
    closures: PropTypes.shape({}),
    contactSuggestions: PropTypes.shape({}),
  }).isRequired,
  allRelationTypes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onPersonSelect: PropTypes.func.isRequired,
  onPersonUnselect: PropTypes.func.isRequired,
  onRelTypeQuery: PropTypes.func.isRequired,
  onRelTypeSelect: PropTypes.func.isRequired,
  onRelTypeUnselect: PropTypes.func.isRequired,
  onStructureSelect: PropTypes.func.isRequired,
  onStructureUnselect: PropTypes.func.isRequired,
  onPersonRequestCreate: PropTypes.func.isRequired,
  onStructureRequestCreate: PropTypes.func.isRequired,
  onField: PropTypes.func.isRequired,
  onToggleClosure: PropTypes.func.isRequired,
  onSetClosureDate: PropTypes.func.isRequired,
  onFillContact: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  canRemove: PropTypes.bool.isRequired,
  showErrors: PropTypes.bool.isRequired,
  defaultClosureDate: PropTypes.string,
};
MandateRow.defaultProps = { defaultClosureDate: '' };
