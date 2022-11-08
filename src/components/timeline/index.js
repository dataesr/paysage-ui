import PropTypes from 'prop-types';
import styles from './styles.module.scss';

export function TimelineItem({ date, children }) {
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
        <span className="fr-h3 fr-mb-0">{day}</span>
        <span className="fr-text--sm fr-mb-0">{month}</span>
        <span className="fr-text--sm fr-mb-0">{year}</span>
      </div>
      <div className={styles['timeline-content']}>
        {children}
      </div>
    </div>
  );
}

TimelineItem.propTypes = {
  date: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export function Timeline({ children }) {
  return <div className={styles.timeline}>{children}</div>;
}

Timeline.propTypes = {
  children: PropTypes.node.isRequired,
};
