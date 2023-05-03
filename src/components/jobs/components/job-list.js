import PropTypes from 'prop-types';
import Job from './job';

export default function JobList({ jobs, selected, setSelected }) {
  return (
    <div className="job-list">
      {
        jobs.map((job) => (
          <Job key={job._id} job={job} selected={selected} setSelected={setSelected} />
        ))
      }
    </div>
  );
}
JobList.propTypes = {
  jobs: PropTypes.array.isRequired,
  selected: PropTypes.object,
  setSelected: PropTypes.func.isRequired,
};
JobList.defaultProps = {
  selected: null,
};
