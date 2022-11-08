import PropTypes from 'prop-types';

export default function ODSCard({ title, description, url, badges }) {
  return (
    <div className="fr-card fr-card--shadow fr-card--xs fr-enlarge-link">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <h3 className="fr-card__title">
            <a href={url}>{title}</a>
          </h3>
          <p className="fr-card__desc">{description}</p>
          <div className="fr-card__start">
            {(badges.length > 0) && (
              <ul className="fr-badges-group">
                <li>
                  {badges.map((b) => <p key={b} className="fr-badge fr-badge--info fr-badge--sm">{b}</p>)}
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ODSCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  url: PropTypes.string.isRequired,
  badges: PropTypes.array,
};

ODSCard.defaultProps = {
  description: '',
  badges: [],
};
