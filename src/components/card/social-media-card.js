import { Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

import './styles.module.scss';
import Button from '../button';
import useEditMode from '../../hooks/useEditMode';

export default function SocialMediaCard({
  account,
  mediaName,
  onClick,
}) {
  const { editMode } = useEditMode();

  const renderIcon = (iconType) => {
    let iconColor = null;
    let rxIcon = null;

    switch (iconType) {
    case 'Facebook':
      iconColor = 'var(--facebook-icon-color)';
      rxIcon = 'ri-facebook-fill';
      break;
    case 'Instagram':
      iconColor = 'var(--instagram-icon-color)';
      rxIcon = 'ri-instagram-fill';
      break;
    case 'Linkedin':
      iconColor = 'var(--linkedin-icon-color)';
      rxIcon = 'ri-linkedin-fill';
      break;
    case 'Twitter':
      iconColor = 'var(--twitter-icon-color)';
      rxIcon = 'ri-twitter-fill';
      break;
    case 'Twitch':
      iconColor = 'var(--twitch-icon-color)';
      rxIcon = 'ri-twitch-fill';
      break;
    case 'Youtube':
      iconColor = 'var(--youtube-icon-color)';
      rxIcon = 'ri-youtube-fill';
      break;
    default:
      break;
    }

    return iconColor ? <Icon className="fr-mb-1w fr-pt-1w lalilou" name={rxIcon} size="3x" color={iconColor} /> : '';
  };

  return (
    <div className="fr-card fr-card--sm fr-card--grey fr-card--no-border">
      <div className={`fr-card__body ${!editMode && 'fr-enlarge-link'}`}>
        <div className="fr-card__content">
          <div className="flex-col flex--center">
            {renderIcon(mediaName)}
            <span className="fr-text fr-text--sm fr-text--bold fr-m-0 flex-col">
              <a className="fr-mb-0 fr-text fr-text--sm" href={account} target="_blank" rel="noreferrer">
                {mediaName}
              </a>
              <span className="only-print">
                {account}
              </span>
            </span>
          </div>
          {editMode && <Button color="text" size="md" onClick={onClick} tertiary borderless rounded icon="ri-edit-line" className="edit-button" />}
        </div>
      </div>
    </div>
  );
}

SocialMediaCard.propTypes = {
  account: PropTypes.string.isRequired,
  mediaName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
