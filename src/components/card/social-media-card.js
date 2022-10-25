import { Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import './styles.module.scss';
import useEditMode from '../../hooks/useEditMode';
import Button from '../button';

export default function SocialMediaCard({
  mediaName,
  account,
  onClick,
}) {
  const { editMode } = useEditMode();

  const renderIcon = (iconType) => {
    let rxIcon = '';
    let iconColor = '';

    switch (iconType) {
    case 'Facebook':
      rxIcon = 'ri-facebook-fill';
      iconColor = 'var(--facebook-icon-color)';
      break;
    case 'Instagram':
      rxIcon = 'ri-instagram-fill';
      iconColor = 'var(--instagram-icon-color)';
      break;
    case 'Linkedin':
      rxIcon = 'ri-linkedin-fill';
      iconColor = 'var(--linkedin-icon-color)';
      break;
    case 'Twitter':
      rxIcon = 'ri-twitter-fill';
      iconColor = 'var(--twitter-icon-color)';
      break;
    case 'Twitch':
      rxIcon = 'ri-twitch-fill';
      iconColor = 'var(--twitch-icon-color)';
      break;
    case 'Youtube':
      rxIcon = 'ri-youtube-fill';
      iconColor = 'var(--youtube-icon-color)';
      break;
    default:
      break;
    }

    return (
      <Icon className="fr-mb-1w fr-pt-1w" name={rxIcon} size="3x" color={iconColor} />
    );
  };

  return (
    <div className="fr-card fr-card--sm fr-card--grey fr-card--no-border">
      <div className={`fr-card__body ${!editMode && 'fr-enlarge-link'}`}>
        <div className="fr-card__content">
          <div className="flex-col flex--center">
            {renderIcon(mediaName)}
            <span className="fr-text fr-text--sm fr-text--bold fr-m-0 flex-col">
              <a className="fr-mb-0 fr-text fr-text--sm" href={account} target="_blank" rel="noreferrer">{mediaName}</a>
              <span className="only-print">{account}</span>
            </span>
          </div>
          {editMode && <Button color="text" size="md" onClick={onClick} tertiary borderless rounded icon="ri-edit-line" className="edit-button" />}
        </div>
      </div>
    </div>
  );
}

SocialMediaCard.propTypes = {
  mediaName: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
