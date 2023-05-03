import { Badge } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import Button from '../../button';
import { timeBetween } from '../utils/dates';
import { getJobStatus } from '../utils/status';
import Info from './selected-job-info';

export default function SelectedJob({ job, deleteJob, createJob }) {
  if (!job._id) return null;
  const [badgeType, badgeLabel] = getJobStatus(job.status);
  return (
    <div className={`fr-card fr-card--xxs fr-card--horizontal fr-card--grey fr-card--no-border ${job.status}-border-right card-fit-content selected-div`}>
      <div className="fr-card__body">
        <div className="fr-card__content">
          <Info
            label="Actions"
            value={(
              <div>
                <Button
                  borderless
                  tertiary
                  rounded
                  onClick={() => createJob({ name: job.name, data: job.data })}
                  title="Lancer maintenant"
                  icon="ri-play-line"
                />
                <Button
                  color="error"
                  borderless
                  tertiary
                  rounded
                  onClick={() => deleteJob(job._id)}
                  title="Supprimer la tâche"
                  icon="ri-delete-bin-line"
                />
              </div>
            )}
          />
          <hr />
          <Info label="Nom de la tâche" value={job.name} />
          <Info label="Id de la tâche" value={job._id} />
          <Info label="Status" value={<Badge isSmall type={badgeType} text={badgeLabel} />} />
          {(job.status === 'failed') && <Info label="Raison de l'échec" value={job.failReason} isCode />}
          <hr />
          {(job.status === 'scheduled') && <Info label="Date de la prochaine exécution" value={job.nextRunAt} />}
          {(job.status === 'running') && <Info label="Début de la tâche" value={job.lastRunAt} />}
          {(['success', 'failed'].includes(job.status)) && (
            <>
              <Info label="Début de la tâche" value={job.lastRunAt} />
              <Info label="Fin de la tâche" value={job.lastFinishedAt || '-'} />
              <Info label="Durée de la tâche" value={timeBetween(new Date(job.lastRunAt), new Date(job.lastFinishedAt))} />
            </>
          )}
          <hr />
          <Info label="Paramètres d'exécution" value={job.data} isCode />
          <hr />
          {(job.status !== 'scheduled') && <Info label="Résultat de la tâche" value={job.result} isCode />}
        </div>
      </div>
    </div>
  );
}

SelectedJob.propTypes = {
  job: PropTypes.object.isRequired,
  createJob: PropTypes.func.isRequired,
  deleteJob: PropTypes.func.isRequired,
};
