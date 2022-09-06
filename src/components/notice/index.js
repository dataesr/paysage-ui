import PropTypes from 'prop-types';
import usePausableTimer from '../../hooks/usePausableTimer';

export default function Notice({
  content,
  autoDismissAfter,
  remove,
  type,
}) {
  const removeSelf = () => {
    document.getElementById('notice').style.setProperty('animation', 'notice-unmount 300ms');
    setTimeout(() => {
      remove();
    }, 300);
  };
  const { pause, resume } = usePausableTimer(removeSelf, autoDismissAfter);
  return (
    <div
      id="notice"
      className={`fr-notice notice notice-${type}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="fr-container">
        <div className="fr-notice__body">
          <p className="fr-notice__title">
            {content}
          </p>
          <button
            type="button"
            className="fr-btn--close fr-btn notice-btn--close"
            title="Masquer le message"
            onClick={removeSelf}
          >
            Masquer le message
          </button>
        </div>
      </div>
    </div>
  );
}

Notice.propTypes = {
  content: PropTypes.string,
  autoDismissAfter: PropTypes.number,
  remove: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
};

Notice.defaultProps = {
  content: '',
  autoDismissAfter: 8000,
  type: 'info',
};
