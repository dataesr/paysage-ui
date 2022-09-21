import { Col, Icon, Link, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import './styles.modules.scss';

export default function SocialMediaCard({
  mediaName,
  account,
  onClick,
}) {
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
      <Icon name={rxIcon} size="3x" color={iconColor} />
    );
  };

  return (
    <div className="fr-card fr-enlarge-link fr-card--horizontal show-bt-on-over">
      <div className="fr-card__body">
        <div className="fr-card__content fr-py-1w">
          <Row>
            <Col n="4" className="fr-pt-2w fr-pb-2w">
              {renderIcon(mediaName)}
            </Col>
            <Col className="fr-pt-2w">
              <h4 className="fr-card__title">
                {mediaName}
                <Link href={account} target="_blank" />
              </h4>
              <div className="card-button">
                <button onClick={onClick} type="button" className="bt-visible-on-over">
                  <Icon className="ri-edit-line" size="lg" />
                </button>
              </div>
            </Col>
          </Row>
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
