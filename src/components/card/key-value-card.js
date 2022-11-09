import { Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

import Button from '../button';
import CopyButton from '../copy/copy-button';
import useEditMode from '../../hooks/useEditMode';

export default function KeyValueCard({
  cardKey,
  cardValue,
  className,
  copy,
  icon,
  linkTo,
  linkIn,
  onEdit,
  titleAsText,
  tooltip,
}) {
  const { editMode } = useEditMode();

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
              {linkTo ? <a href={linkTo} target="_blank" rel="noopener noreferrer">{cardKey}</a> : null}
              {linkIn && <a href={linkIn}>{cardKey}</a>}
              {!linkTo && !linkIn ? cardKey : null}
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
  className: PropTypes.string,
  copy: PropTypes.bool,
  icon: PropTypes.string,
  linkTo: PropTypes.string,
  linkIn: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  titleAsText: PropTypes.string,
  tooltip: PropTypes.string,
};
KeyValueCard.defaultProps = {
  className: '',
  copy: false,
  icon: null,
  linkTo: null,
  onEdit: null,
  titleAsText: false,
  tooltip: null,
};
