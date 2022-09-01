import PropTypes from 'prop-types';
import './styles.modules.scss';

export default function Card({ title, description, element }) {
  return (
    <div className="fr-card fr-enlarge-link">
      <div className="fr-card__body">
        <div className="fr-card__content">
          {title ? <h4 className="fr-card__title">{title}</h4> : null}
          {description ? <p className="fr-card__desc">{description}</p> : null}
          <div className="card-button">{element || null}</div>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  element: PropTypes.node,
};

Card.defaultProps = {
  title: '',
  description: '',
  element: null,
};
