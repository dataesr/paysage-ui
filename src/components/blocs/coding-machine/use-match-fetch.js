import api from '../../../utils/api';
import { getDisplayName } from './formatters';

const useMatchFetcher = ({
  data,
  setError,
  setLoading,
  setMatchedData,
  setSelectedMatches,
  searchType = '',
}) => {
  async function fetchMatches() {
    if (!data || !data.length) return;

    setError(null);
    setLoading(true);
    setSelectedMatches({});

    const processEntry = async (entry) => {
      const query = getDisplayName(entry);

      if (!query) {
        return { ...entry, matches: [], sourceQuery: query };
      }

      let typesToSearch = searchType;

      if (!searchType || searchType === 'auto') {
        const isProbablyPerson = entry.first_name || entry.last_name || entry['Full Name'] || entry.FullName;
        const isProbablyStructure = entry.Name || entry.name;

        typesToSearch = 'persons,structures';
        if (isProbablyPerson && !isProbablyStructure) {
          typesToSearch = 'persons';
        } else if (isProbablyStructure && !isProbablyPerson) {
          typesToSearch = 'structures';
        }
      }

      const params = new URLSearchParams({
        query,
        limit: 5,
        types: typesToSearch,
      });

      const response = await api.get(`/autocomplete?${params.toString()}`).catch((error) => ({ error }));

      if (response.error) {
        return {
          ...entry,
          matches: [],
          error: response.error.toString(),
          sourceQuery: query,
        };
      }

      if (!response?.data?.data?.length) {
        return { ...entry, matches: [], sourceQuery: query };
      }

      let filteredResults = response.data.data;
      if (searchType && searchType !== 'auto' && searchType !== 'persons,structures') {
        filteredResults = response.data.data.filter((match) => {
          const matchType = match.type || match.objectType;
          return matchType && (
            matchType === searchType
            || matchType === `${searchType }s`
            || matchType === searchType.replace(/s$/, '')
          );
        });
      }

      let matches = filteredResults.map((match) => {
        const identifiersArray = match.identifiers || [];

        return {
          id: match.id,
          name: match.name || match.displayName || '',
          objectType: match.type || entry.ObjectType || '',
          score: match.score || 0,
          activity: match.activity || '',
          category: match.category || '',
          city: match.city && match.city.length > 0 ? match.city.join(', ') : '',
          acronym: match.acronymFr || match.acronymLocal || match.acronymEn || '',
          structureStatus: match.structureStatus || '',
          creationDate: match.creationDate || '',
          closureDate: match.closureDate || '',
          identifiers: identifiersArray.length > 0 ? identifiersArray.join(', ') : '',
          identifiersArray,
          matchingIdentifier: null,
          hasMatchingId: false,
          isAlternative: false,
        };
      });

      matches = matches.map((match) => {
        if (!match.identifiersArray || !Array.isArray(match.identifiersArray) || match.identifiersArray.length === 0) {
          return match;
        }

        const normalizedMatchIds = match.identifiersArray.map((id) => (id ? id.toString().toLowerCase().trim() : '')).filter((id) => id !== '');

        if (normalizedMatchIds.length === 0) {
          return match;
        }

        const foundMatchingIds = [];
        const matchingFields = [];
        const matchingValues = [];
        const matchingApiValues = [];

        Object.entries(entry).forEach(([field, value]) => {
          if (!value || ['name', 'matches', 'sourceQuery', 'error'].includes(field)) {
            return;
          }

          const normalizedValue = value.toString().toLowerCase().trim()
            .replace(/[-\s.]/g, '');

          match.identifiersArray.forEach((apiId) => {
            if (!apiId) return;

            const normalizedApiId = apiId.toString().toLowerCase().trim()
              .replace(/[-\s.]/g, '');

            if (normalizedApiId === normalizedValue) {
              foundMatchingIds.push(true);
              matchingFields.push(field);
              matchingValues.push(value);
              matchingApiValues.push(apiId);
            }
          });
        });

        if (foundMatchingIds.length > 0) {
          const identifiers = [];
          // should we really normalize the matching ids??
          // talk with yann about this
          for (let i = 0; i < matchingFields.length; i += 1) {
            identifiers.push({
              fieldName: matchingFields[i],
              value: matchingValues[i],
              apiValue: matchingApiValues[i],
            });
          }

          return {
            ...match,
            score: match.score + (100 * foundMatchingIds.length),
            hasMatchingId: true,
            matchingIdentifiers: identifiers,
          };
        }

        return match;
      });

      matches.sort((a, b) => b.score - a.score);

      return {
        ...entry,
        matches,
        sourceQuery: query,
      };
    };

    const processAllEntries = async () => {
      const processingPromises = data.map((entry, index) => processEntry(entry, index).catch((err) => ({
        ...entry,
        matches: [],
        error: `Erreur: ${err.message || err}`,
        sourceQuery: getDisplayName(entry),
      })));

      const results = await Promise.all(processingPromises);

      setMatchedData(results);
      setLoading(false);
    };

    processAllEntries().catch((err) => {
      setError(`Erreur globale: ${err.message}`);
      setLoading(false);
    });
  }

  return { fetchMatches };
};

export default useMatchFetcher;
