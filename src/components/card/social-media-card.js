import { Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

import './styles.module.scss';
import Button from '../button';
import useEditMode from '../../hooks/useEditMode';

// SVG Logo import //
import academia from '../../assets/svg-logo/academia.svg';
import dailymotion from '../../assets/svg-logo/dailymotion.svg';
import flickr from '../../assets/svg-logo/flickr.svg';
import franceCulture from '../../assets/svg-logo/france-culture.svg';
import pinterest from '../../assets/svg-logo/pinterest.svg';
import researchgate from '../../assets/svg-logo/researchgate.svg';
import scoopit from '../../assets/svg-logo/scoop-it.svg';
import scribd from '../../assets/svg-logo/scribd.svg';
import snapchat from '../../assets/svg-logo/snapchat.svg';
import soundcloud from '../../assets/svg-logo/soundcloud.svg';
import tiktok from '../../assets/svg-logo/tiktok.svg';
import tumblr from '../../assets/svg-logo/tumblr.svg';
import vimeo from '../../assets/svg-logo/vimeo.svg';

export default function SocialMediaCard({
  account,
  mediaName,
  onClick,
}) {
  const { editMode } = useEditMode();

  const renderIcon = (iconType) => {
    let iconColor = null;
    let rxIcon = null;
    let svg = null;

    switch (iconType) {
    case 'academia':
      svg = academia;
      break;
    case 'Dailymotion':
      svg = dailymotion;
      break;
    case 'Facebook':
      iconColor = 'var(--facebook-icon-color)';
      rxIcon = 'ri-facebook-fill';
      break;
    case 'Flickr':
      svg = flickr;
      break;
    case 'France Culture':
      svg = franceCulture;
      break;
    case 'Instagram':
      iconColor = 'var(--instagram-icon-color)';
      rxIcon = 'ri-instagram-fill';
      break;
    case 'Github':
      iconColor = 'var(--github-icon-color)';
      rxIcon = 'ri-github-fill';
      break;
    case 'Gitlab':
      iconColor = 'var(--gitlab-icon-color)';
      rxIcon = 'ri-gitlab-fill';
      break;
    case 'Linkedin':
      iconColor = 'var(--linkedin-icon-color)';
      rxIcon = 'ri-linkedin-fill';
      break;
    case 'Pinterest':
      svg = pinterest;
      break;
    case 'researchgate':
      svg = researchgate;
      break;
    case 'Scoopit':
      svg = scoopit;
      break;
    case 'Scribd':
      svg = scribd;
      break;
    case 'Snapchat':
      svg = snapchat;
      break;
    case 'soundcloud':
      svg = soundcloud;
      break;
    case 'Tiktok':
      svg = tiktok;
      break;
    case 'Tumblr':
      svg = tumblr;
      break;
    case 'Twitter':
      iconColor = 'var(--twitter-icon-color)';
      rxIcon = 'ri-twitter-fill';
      break;
    case 'Twitch':
      iconColor = 'var(--twitch-icon-color)';
      rxIcon = 'ri-twitch-fill';
      break;
    case 'Vimeo':
      svg = vimeo;
      break;
    case 'Youtube':
      iconColor = 'var(--youtube-icon-color)';
      rxIcon = 'ri-youtube-fill';
      break;
    default:
      break;
    }
    return iconColor ? <div className="fr-card__content"><Icon className="fr-mb-1w fr-pt-1w" name={rxIcon} size="3x" color={iconColor} /></div>
      : <img className="fr-card__content" style={{ width: '100px' }} src={svg} alt="logo" />;
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
