import PropTypes from 'prop-types';
import { Icon } from '@dataesr/react-dsfr';
import useEditMode from '../../hooks/useEditMode';
import Button from '../button';
import CopyButton from '../copy/copy-button';

export default function KeyValueCard({
  cardKey,
  cardValue,
  className,
  copy,
  onEdit,
  tooltip,
  icon,
  titleAsText,
}) {
  const { editMode } = useEditMode();

  // TODO: KeyValueCard is meant to be generic. This should be outside KeyValueCard (inside blocs/identifiers),
  // using a prop linkTo to display a link or not.

  let linkTo = '';
  switch (cardKey) {
  case 'Wikidata':
    linkTo = `https://wikidata.org/wiki/${cardValue}`;
    break;
  case 'idRef':
    linkTo = `https://www.idref.fr/${cardValue}`;
    break;
  case 'ORCID':
    linkTo = `https://orcid.org/${cardValue}`;
    break;
  case 'ROR':
    linkTo = `https://ror.org/${cardValue}`;
    break;
  default:
  }

  return (
    <div className={`fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border ${className}`}>
      <div className="fr-card__body">
        <div className="fr-card__content">
          <p className="fr-card__title">
            <span
              className={`fr-pr-1w ${(cardValue && titleAsText) && 'fr-text--md fr-text--regular'} ${!cardValue && 'fr-text--sm fr-text--regular italic'}`}
            >
              {cardValue || 'Non renseigné'}
            </span>
            {copy && <CopyButton copyText={cardValue} size="sm" />}
          </p>
          <div className="fr-card__start">
            <p className="fr-card__detail fr-text--sm fr-mb-0">
              {icon && <Icon name={icon} size="1x" />}
              {linkTo ? <a href={linkTo} target="_blank" rel="noopener noreferrer">{cardKey}</a> : cardKey}
              {tooltip && (
                <Icon
                  name="ri-information-fill"
                  size="1x"
                  iconPosition="right"
                  title={tooltip}
                />
              )}
            </p>
          </div>
          {editMode && onEdit && (
            <Button
              color="text"
              size="md"
              onClick={onEdit}
              tertiary
              borderless
              rounded
              icon="ri-edit-line"
              className="edit-button"
            />
          )}
        </div>
      </div>
    </div>
  );
}
KeyValueCard.propTypes = {
  cardKey: PropTypes.string.isRequired,
  cardValue: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  copy: PropTypes.bool,
  icon: PropTypes.string,
  tooltip: PropTypes.string,
  onEdit: PropTypes.func,
  className: PropTypes.string,
  titleAsText: PropTypes.string,
};
KeyValueCard.defaultProps = {
  copy: false,
  icon: null,
  tooltip: null,
  onEdit: null,
  className: '',
  titleAsText: false,
};
