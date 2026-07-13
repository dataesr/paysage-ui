import { Col, Row, Select, TextInput } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import Button from '../../../button';
import DateInput from '../../../date-input';
import { GENDER_OPTIONS, capitalizeName } from '../../utils';

export default function PersonStep({
  firstName, lastName, gender,
  onFirstNameChange, onLastNameChange, onGenderChange,
  errors, showErrors,
  paysageMatches, existingPersonId, onUseExisting, onKeepNew,
  birthDate, onBirthDateChange, activity, onActivityChange,
  onInvertName, canInvertName,
}) {
  const hasDuplicate = paysageMatches.length > 0 && existingPersonId === undefined;
  const isExisting = typeof existingPersonId === 'string';

  return (
    <div>
      {hasDuplicate && (
        <div className="fr-alert fr-alert--warning fr-mb-3w">
          <p className="fr-alert__title">
            {`${paysageMatches.length > 1 ? 'Des fiches existent' : 'Une fiche existe'} peut-être déjà dans Paysage`}
          </p>
          <p className="fr-text--sm fr-mb-2w">
            {`${paysageMatches.length} fiche${paysageMatches.length > 1 ? 's' : ''}`
              + ` trouvée${paysageMatches.length > 1 ? 's' : ''} avec ce nom.`
              + " Vérifiez s'il s'agit de la même personne avant de créer une nouvelle fiche."}
          </p>
          {paysageMatches.map((match) => (
            <div key={match.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <span className="fr-text--sm" style={{ fontWeight: '600', display: 'block' }}>{match.name}</span>
                {match.activity && (
                  <span className="fr-text--xs fr-hint-text" style={{ display: 'block' }}>{match.activity}</span>
                )}
                {match.birthDate && (
                  <span className="fr-text--xs fr-hint-text" style={{ display: 'block' }}>
                    {`Né·e le ${match.birthDate.slice(0, 10).split('-').reverse().join('/')}`}
                  </span>
                )}
              </div>
              <Button size="sm" icon="ri-links-line" iconPosition="left" onClick={() => onUseExisting(match.id)}>
                Utiliser cette fiche existante
              </Button>
              <Button size="sm" secondary icon="ri-external-link-line" iconPosition="left" onClick={() => window.open(`/personnes/${match.id}`, '_blank')}>
                Voir la fiche
              </Button>
            </div>
          ))}
          <Button size="sm" tertiary borderless onClick={onKeepNew} className="fr-mt-1w">
            Ce n&apos;est pas la même personne — créer une nouvelle fiche
          </Button>
        </div>
      )}

      {isExisting && (
        <div className="fr-alert fr-alert--success fr-alert--sm fr-mb-3w">
          <p className="fr-alert__title">Fiche existante sélectionnée</p>
          <p>
            {`${[firstName, lastName].filter(Boolean).join(' ')} — la relation sera ajoutée à cette fiche. Vous pourrez vérifier et compléter ses identifiants à l'étape suivante.`}
          </p>
          <Button size="sm" tertiary borderless onClick={() => onUseExisting(undefined)} className="fr-mt-1w">
            Annuler — revenir à la saisie
          </Button>
        </div>
      )}

      {!hasDuplicate && (
        <Row gutters>
          <Col n="12 md-4">
            <TextInput
              required
              label="Prénom"
              value={capitalizeName(firstName)}
              onChange={(e) => onFirstNameChange(capitalizeName(e.target.value))}
              message={(showErrors && errors.firstName) ? errors.firstName : null}
              messageType={(showErrors && errors.firstName) ? 'error' : ''}
              disabled={isExisting}
            />
          </Col>
          <Col n="12 md-4">
            <TextInput
              required
              label="Nom"
              value={capitalizeName(lastName)}
              onChange={(e) => onLastNameChange(capitalizeName(e.target.value))}
              message={(showErrors && errors.lastName) ? errors.lastName : null}
              messageType={(showErrors && errors.lastName) ? 'error' : ''}
              disabled={isExisting}
            />
          </Col>
          {!isExisting && (
            <Col n="12 md-4">
              <Select
                required
                label="Genre"
                options={GENDER_OPTIONS}
                selected={gender}
                onChange={(e) => onGenderChange(e.target.value)}
                message={(showErrors && errors.gender) ? errors.gender : null}
                messageType={(showErrors && errors.gender) ? 'error' : ''}
              />
            </Col>
          )}
          {!isExisting && canInvertName && (
            <Col n="12">
              <Button
                tertiary
                borderless
                size="sm"
                icon="ri-arrow-left-right-line"
                iconPosition="left"
                onClick={onInvertName}
              >
                Inverser prénom / nom
              </Button>
            </Col>
          )}
          <Col n="12 md-6">
            <DateInput
              value={birthDate}
              label="Date de naissance"
              hint="Optionnel — pré-rempli si trouvé dans IdRef"
              onDateChange={onBirthDateChange}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Activité"
              hint="Optionnel — pré-rempli si trouvé dans IdRef ou Wikidata"
              value={capitalizeName(activity)}
              onChange={(e) => onActivityChange(e.target.value)}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

PersonStep.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  onFirstNameChange: PropTypes.func.isRequired,
  onLastNameChange: PropTypes.func.isRequired,
  onGenderChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  showErrors: PropTypes.bool.isRequired,
  paysageMatches: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })).isRequired,
  existingPersonId: PropTypes.string,
  onUseExisting: PropTypes.func.isRequired,
  onKeepNew: PropTypes.func.isRequired,
  birthDate: PropTypes.string.isRequired,
  onBirthDateChange: PropTypes.func.isRequired,
  activity: PropTypes.string.isRequired,
  onActivityChange: PropTypes.func.isRequired,
  onInvertName: PropTypes.func,
  canInvertName: PropTypes.bool,
};
PersonStep.defaultProps = { existingPersonId: undefined, onInvertName: () => {}, canInvertName: false };
