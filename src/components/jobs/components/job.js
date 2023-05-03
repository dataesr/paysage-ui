import { Badge, Icon, Link } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { timeBetween, timeSince, timeTo } from '../utils/dates';
import { getJobStatus } from '../utils/status';

export default function Job({ job, selected, setSelected }) {
  const [badgeType, badgeLabel] = getJobStatus(job.status);
  const duration = timeBetween(new Date(job.lastRunAt), new Date(job.lastFinishedAt));
  const classname = classNames('job', { selected: job._id === selected._id });
  return (
    <div className={classname} key={job.id}>
      <div className={`fr-card fr-card--xxs fr-card--horizontal fr-card--grey fr-enlarge-link fr-card--no-border ${job.status}-border`}>
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div className="inline-flex">
              <div className="flex--grow">
                <div className="fr-card__start inline-flex flex--baseline">
                  <p className="fr-text--bold fr-text--md fr-m-0 fr-pr-1w">
                    <Link className="card-button" onClick={() => setSelected(job._id)}>{job.name}</Link>
                  </p>
                  <Badge isSmall type={badgeType} text={badgeLabel} />
                  {job.repeatInterval && <Badge className="fr-ml-1v" type={null} isSmall text={`cron: ${job.repeatInterval}`} />}
                </div>
                <p className="fr-card__title">
                  <span className="inline-flex flex--center fr-m-0 fr-pr-1w fr-text--sm fr-text--bold fr-card__detail ">
                    {(['success', 'failed'].includes(job.status)) && (
                      <>
                        <Icon className="fr-mr-1v" size="lg" name="ri-calendar-line" />
                        il y a
                        {' '}
                        {timeSince(new Date(job.lastFinishedAt))}
                        <Icon className="fr-ml-2w fr-mr-1v" size="lg" name="ri-timer-line" />
                        {duration}
                      </>
                    )}
                    {(job.status === 'scheduled') && (
                      <>
                        <Icon className="fr-mr-1v" size="lg" name="ri-calendar-line" />
                        prévue dans
                        {' '}
                        {timeTo(new Date(job.nextRunAt))}
                      </>
                    )}
                    {(job.status === 'running') && (
                      <>
                        <Icon className="fr-mr-1v" size="lg" name="ri-calendar-line" />
                        démarrée il y a
                        {' '}
                        {timeSince(new Date(job.lastRunAt))}
                      </>
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Job.propTypes = {
  job: PropTypes.shape.isRequired,
  selected: PropTypes.object,
  setSelected: PropTypes.func.isRequired,
};
Job.defaultProps = {
  selected: null,
};
