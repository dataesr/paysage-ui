/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function useFetch(url, headers) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reloads, setReloads] = useState(0);

  const reload = () => setReloads(reloads + 1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(url, headers);
      if (response.ok) {
        setData(response.data);
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
  }, [url, headers, reloads]);

  return { data, error, isLoading, reload };
}
