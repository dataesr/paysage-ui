import PropTypes from 'prop-types';
import './styles.modules.scss';

export default function Card({ title, descriptionElement, actionElement }) {
  return (
    <div className="fr-card fr-enlarge-link">
      <div className="fr-card__body">
        <div className="fr-card__content">
          {title ? <h4 className="fr-card__title">{title}</h4> : null}
          <p className="fr-card__desc">{descriptionElement}</p>
          <div className="card-button">{actionElement || null}</div>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  descriptionElement: PropTypes.element,
  actionElement: PropTypes.element,
};

Card.defaultProps = {
  title: '',
  descriptionElement: null,
  actionElement: null,
};
