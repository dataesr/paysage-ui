/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import api from '../utils/api';

const scopeTypesMapper = {
  structures: 'structures',
  personnes: 'persons',
  categories: 'categories',
  prix: 'prices',
  'textes-officiels': 'official-texts',
  projets: 'projects',
};

export default function useSearch(scope, query) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/autocomplete?types=${scopeTypesMapper[scope]}&query=${query}`);
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
  }, [scope, query]);

  return { data, error, isLoading };
}
