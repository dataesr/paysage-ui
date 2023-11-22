import { Badge, Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import Button from '../button';
import CopyButton from '../copy/copy-button';
import useEditMode from '../../hooks/useEditMode';

export default function KeyValueCard({
  cardKey,
  cardValue,
  className,
  copy,
  icon,
  inactive,
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
          {cardValue && (
            <p className="fr-card__title">
              <span
                className={`fr-pr-1w ${(cardValue && titleAsText) && 'fr-text--md fr-text--regular'} ${!cardValue && 'fr-text--sm fr-text--regular italic'}`}
              >
                {(cardValue) || 'Non renseigné'}
              </span>
              {copy && <CopyButton copyText={cardValue} size="sm" />}
            </p>
          )}
          <div className="fr-card__start">
            <div className="fr-card__detail fr-text--sm fr-mb-0">
              {icon && <Icon name={icon} size="1x" />}
              {linkTo && <a href={linkTo} target="_blank" rel="noopener noreferrer">{cardKey}</a>}
              {linkIn && (
                <RouterLink to={linkIn}>
                  {cardKey}
                  <Icon name="ri-arrow-right-line" iconPosition="right" />
                </RouterLink>
              )}
              {!linkTo && !linkIn && cardKey}
              {tooltip && (
                <p style={{ cursor: 'help' }}>
                  <Icon
                    name="ri-information-fill"
                    size="1x"
                    iconPosition="right"
                    title={tooltip}
                  />
                </p>
              )}
              {inactive && <Badge isSmall text="inactif" />}
            </div>
          </div>
          {editMode && onEdit && (
            <Button
              borderless
              className="edit-button"
              color="text"
              icon="ri-edit-line"
              onClick={onEdit}
              rounded
              size="md"
              tertiary
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
  inactive: PropTypes.bool,
  linkIn: PropTypes.string,
  linkTo: PropTypes.string,
  onEdit: PropTypes.func,
  titleAsText: PropTypes.string,
  tooltip: PropTypes.string,
};
KeyValueCard.defaultProps = {
  className: '',
  copy: false,
  icon: null,
  inactive: false,
  linkIn: null,
  linkTo: null,
  onEdit: null,
  titleAsText: null,
  tooltip: null,
};
