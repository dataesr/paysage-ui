import PropTypes from 'prop-types';

import './styles.module.scss';

export default function Card({ actionElement, bgColorClassName, descriptionElement, subtitle, title }) {
  return (
    <div className="fr-card fr-enlarge-link fr-card--horizontal fr-card--grey show-bt-on-over">
      <div className={`fr-card__body ${bgColorClassName}`}>
        <div className="fr-card__content fr-py-1w">
          {title && (<h4 className="fr-card__title">{title}</h4>)}
          {subtitle && (<div className="fr-card__desc">{subtitle}</div>)}
          {descriptionElement && (<div className="fr-card__desc">{descriptionElement}</div>)}
          {actionElement && (<div className="card-button bt-visible-on-over">{actionElement || null}</div>)}
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  actionElement: PropTypes.element,
  bgColorClassName: PropTypes.string,
  descriptionElement: PropTypes.element,
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  title: PropTypes.string,
};

Card.defaultProps = {
  actionElement: null,
  bgColorClassName: '',
  descriptionElement: null,
  subtitle: null,
  title: null,
};
