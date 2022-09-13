import PropTypes from 'prop-types';
import './styles.modules.scss';

export default function Card({ title, descriptionElement, actionElement, bgColorClassName }) {
  return (
    <div className="fr-card fr-enlarge-link fr-card--horizontal">
      <div className={`fr-card__body ${bgColorClassName}`}>
        <div className="fr-card__content fr-py-1w">
          {title ? <h4 className="fr-card__title">{title}</h4> : null}
          <div className="fr-card__desc">{descriptionElement}</div>
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
  bgColorClassName: PropTypes.string,
};

Card.defaultProps = {
  title: '',
  descriptionElement: null,
  actionElement: null,
  bgColorClassName: '',
};
