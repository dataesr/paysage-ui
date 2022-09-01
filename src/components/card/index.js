import { Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import './styles.modules.scss';

export default function Card({ title, description, buttonIcon, onClick }) {
  return (
    <div className="fr-card fr-enlarge-link">
      <div className="fr-card__body">
        <div className="fr-card__content">
          {title ? <h4 className="fr-card__title">{title}</h4> : null}
          {description ? <p className="fr-card__desc">{description}</p> : null}
          {
            (buttonIcon) ? (
              <button className="card-button" onClick={onClick} type="button">
                <Icon className={buttonIcon} size="lg" />
              </button>
            ) : null
          }
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttonIcon: PropTypes.string,
  onClick: PropTypes.func,
};

Card.defaultProps = {
  title: '',
  description: '',
  buttonIcon: '',
  onClick: {},
};
