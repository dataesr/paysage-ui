import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function useFetch(url, headers, options) {
  // const { filters = {}, skip = 0, limit = 20, sort } = options;
  const [data, setData] = useState(null);
  // const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reloads, setReloads] = useState(0);

  const reload = () => setReloads(reloads + 1);

  useEffect(() => {
    const fetchData = () => api.get(url, headers)
      .then((response) => {
        setData(response.data);
        // if (response.totalCount > (skip + limit)) setHasMore(true);
        setIsLoading(false);
        setError(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError(true);
      });
    setIsLoading(true);
    setError(false);
    setData(null);
    fetchData();
  }, [url, headers, reloads]);

  return { data, error, isLoading, reload };
}
