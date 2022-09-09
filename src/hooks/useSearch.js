/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function useSearch(scopes, query = '', limit = 10) {
  const [data, setData] = useState(null);
  const [counts, setCounts] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/autocomplete?types=${scopes}&query=${query}&limit=${limit}`);
      if (response.ok) {
        setData(response.data?.data);
        const responseCounts = {};
        response.data?.aggregation.forEach((elem) => {
          responseCounts[elem.key] = elem.count;
        });
        setCounts(responseCounts);
        setIsLoading(false);
        setError(false);
        return;
      }
      setIsLoading(false);
      setError(true);
    };

    setIsLoading(true);
    setError(false);
    setData(null);

    fetchData().catch((e) => {
      setIsLoading(false);
      setError(true);
      console.log(e);
    });
  }, [scopes, query, limit]);

  return { data, counts, error, isLoading };
}