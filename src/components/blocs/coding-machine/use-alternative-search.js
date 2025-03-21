import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const useAlternativeSearch = ({
  rowIndex,
  matchedData,
  setMatchedData,
  setSelectedMatches,
  onMatchSelection,
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
        setOptions(response?.data?.data || []);
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
    if (!match || !match.id || !matchedData) return;

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

      row.matches = [
        enhancedMatch,
        ...row.matches.filter((m) => m.id !== match.id),
      ];

      updatedData[rowIndex] = row;
      setMatchedData(updatedData);

      if (setSelectedMatches) {
        setSelectedMatches((prev) => ({
          ...prev,
          [rowIndex]: match.id,
        }));
      }

      if (onMatchSelection) {
        onMatchSelection(rowIndex, match.id);
      }
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
