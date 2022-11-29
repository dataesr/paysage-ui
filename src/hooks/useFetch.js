import { useEffect, useState } from 'react';
import api from '../utils/api';

// TODO: Add options and pagination functionnality
// const { filters = {}, skip = 0, limit = 20, sort } = options;
// const [hasMore, setHasMore] = useState(false);
// if (response.totalCount > (skip + limit)) setHasMore(true);

export default function useFetch(url, headers) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloads, setReloads] = useState(0);

  const reload = () => setReloads(reloads + 1);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = () => api
      .get(url, headers, { signal: abortController.signal })
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        if (e.name !== 'AbortError') {
          setError(e.message || '500');
          setIsLoading(false);
        }
      });

    setIsLoading(true);
    setError(null);
    setData(null);
    fetchData();
    return () => abortController.abort();
  }, [url, headers, reloads]);

  return { data, error, isLoading, reload };
}
