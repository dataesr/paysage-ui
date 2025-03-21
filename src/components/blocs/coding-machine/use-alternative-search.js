import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const useAlternativeSearch = ({
  rowIndex,
  matchedData,
  setMatchedData,
  setSelectedMatches,
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);

    const performSearch = async () => {
      try {
        const params = new URLSearchParams({
          query,
          limit: 10,
          start: 0,
          types: 'persons,prizes,structures',
        });

        const response = await api.get(`/autocomplete?${params.toString()}`);

        if (response?.data?.data?.length > 0) {
          setOptions(response.data.data);
        } else {
          setOptions([]);
        }
      } catch (err) {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  function handleSearchChange(value) {
    setQuery(value);
  }

  function handleOptionSelect(match) {
    if ((matchedData)) {
      const updatedData = [...matchedData];

      if (rowIndex >= 0 && rowIndex < updatedData.length) {
        const row = { ...updatedData[rowIndex] };

        if (!Array.isArray(row.matches)) {
          row.matches = [];
        }

        const enhancedMatch = {
          ...match,
          isAlternative: true,
        };

        if (!row.matches.some((m) => m.id === match.id)) {
          row.matches = [enhancedMatch, ...row.matches];
        }
        // Checks if the selected match is already in the matches array
        // If it is, we remove it
        // If it is not, we add it
        // first place, so it appears first in the list but should be checked by radio, let's see

        updatedData[rowIndex] = row;
        setMatchedData(updatedData);
      } else {
        // eslint-disable-next-line no-console
        console.error(`rowIndex (${rowIndex}) hors limites pour matchedData (${matchedData.length})`);
      }
    } else {
      try {
        setMatchedData((prevData) => {
          const updatedData = [...prevData];
          const row = { ...updatedData[rowIndex] };

          if (!Array.isArray(row.matches)) {
            row.matches = [];
          }

          const enhancedMatch = {
            ...match,
            isAlternative: true,
          };

          if (!row.matches.some((m) => m.id === match.id)) {
            row.matches = [enhancedMatch, ...row.matches];
          }

          updatedData[rowIndex] = row;
          return updatedData;
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Erreur lors de la mise à jour des données', e);
      }
    }

    if (typeof setSelectedMatches === 'function') {
      setSelectedMatches((prev) => ({
        ...prev,
        [rowIndex]: match.id,
      }));
    }

    setOptions([]);
    setQuery('');
  }

  return {
    loading,
    options,
    query,
    handleSearchChange,
    handleOptionSelect,
  };
};

export default useAlternativeSearch;
