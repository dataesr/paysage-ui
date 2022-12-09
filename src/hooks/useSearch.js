import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function useSearch(scopes, query = '', limit = 10, start = 0) {
  const [data, setData] = useState(null);
  const [counts, setCounts] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      await api
        .get(`/search?types=${scopes}&query=${query}&limit=${limit}&start=${start}`, {}, { signal: abortController.signal })
        .then((response) => {
          setData(response.data?.data);
          const responseCounts = {};
          response.data?.aggregation.forEach((elem) => {
            responseCounts[elem.key] = elem.count;
          });
          setCounts(responseCounts);
          setIsLoading(false);
          setError(false);
        })
        .catch((e) => {
          if (e.name !== 'AbortError') {
            setError(e.message || '500');
            setIsLoading(false);
          }
        });
    };

    setIsLoading(true);
    setError(false);
    setData(null);
    setCounts({});
    fetchData();
    return () => abortController.abort();
  }, [limit, query, scopes, start]);

  return { data, counts, error, isLoading };
}
