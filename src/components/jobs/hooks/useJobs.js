import { useCallback, useEffect, useState } from 'react';
import useNotice from '../../../hooks/useNotice';
import api from '../../../utils/api';

export default function useJobs(url, refreshInterval = 60000) {
  const { notice } = useNotice();
  const [totalCount, setTotalCount] = useState(null);
  const [aggregations, setAggregations] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelected] = useState();
  const [reloads, setReloads] = useState(0);

  const reload = useCallback(() => setReloads(reloads + 1), [setReloads, reloads]);

  const createJob = useCallback((body) => api.post('/jobs', body)
    .then((r) => {
      notice({ content: 'Tâche crée', autoDismissAfter: 6000, type: 'success' });
      reload();
      setSelected(r?.data?._id);
      return r;
    })
    .catch((r) => {
      notice({ content: 'Erreur lors de la création de la tâche', autoDismissAfter: 6000, type: 'error' });
      return r;
    }), [notice, reload]);

  const deleteJob = useCallback((id) => api.delete(`/jobs/${id}`)
    .then((r) => {
      notice({ content: 'Tâche supprimée', autoDismissAfter: 6000, type: 'success' });
      reload();
      setSelected(null);
      return r;
    })
    .catch((r) => {
      notice({ content: 'Erreur lors de la suppression de la tâche', autoDismissAfter: 6000, type: 'error' });
      return r;
    }), [notice, reload]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = () => api
      .get(url, {}, { signal: abortController.signal })
      .then((response) => {
        const { totalCount: total, data: jobList, aggregations: aggregates } = response.data;
        setJobs(jobList);
        setTotalCount(total);
        setAggregations(aggregates);
        setIsLoading(false);
      })
      .catch((e) => {
        if (e.name !== 'AbortError') {
          setError(e.message || '500');
          setIsLoading(false);
        }
      });
    if (url) {
      setIsLoading(true);
      setError(null);
      fetchData();
    }
    return () => abortController.abort();
  }, [url, reloads]);

  useEffect(() => {
    const refresher = setInterval(() => reload(), refreshInterval);
    return () => clearInterval(refresher);
  }, [reload, refreshInterval]);

  const hasSelectedInJobs = !!jobs?.find((job) => job._id === selectedId)?._id;
  const selected = hasSelectedInJobs ? jobs.find((job) => job._id === selectedId) : jobs?.[0];

  return { jobs, totalCount, aggregations, error, isLoading, reload, createJob, deleteJob, setSelected, selected };
}
