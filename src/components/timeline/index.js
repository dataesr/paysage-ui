import PropTypes from 'prop-types';
import styles from './styles.module.scss';

export function TimelineItem({ approximate, date, children }) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const event = new Date(date).toLocaleString('fr-FR', options);
  const [day, month, year] = event.split(' ');
  return (
    <div className={`${styles['timeline-item']}`}>
      <div className={styles['timeline-date']}>
        {(approximate && day === '1') ? null : <span className="fr-h3 fr-mb-0">{day}</span>}
        {(approximate && month === '1') ? null : <span className="fr-text--sm fr-mb-0">{month}</span>}
        <span className="fr-text--sm fr-mb-0">{year}</span>
      </div>
      <div className={styles['timeline-content']}>
        {children}
      </div>
    </div>
  );
}

TimelineItem.defaultProps = {
  approximate: false,
};

TimelineItem.propTypes = {
  approximate: PropTypes.bool,
  date: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export function Timeline({ children }) {
  return <div className={styles.timeline}>{children}</div>;
}

Timeline.propTypes = {
  children: PropTypes.node.isRequired,
};
