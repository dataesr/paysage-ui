import { PYDREF_API } from './use-file-reader';

const identifyPerson = async ({ lastName, firstName, index }) => {
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

  if (!fullName) {
    return { index, lastName, firstName, status: 'empty', nb_homonyms: 0, identifiers: [] };
  }

  try {
    const url = `${PYDREF_API}?name=${encodeURIComponent(fullName)}`;
    const response = await fetch(url);

    if (!response.ok) {
      return {
        index,
        lastName,
        firstName,
        status: `error_${response.status}`,
        nb_homonyms: 0,
        identifiers: [],
        error: `HTTP ${response.status}`,
      };
    }

    const json = await response.json();
    return {
      index,
      lastName,
      firstName,
      status: json.status || 'unknown',
      nb_homonyms: json.nb_homonyms ?? 0,
      identifiers: json.identifiers || [],
      description: json.description || [],
      gender: json.gender || '',
      fullName: json.full_name || fullName,
      potentialMatches: json.potential_matches || [],
      raw: json,
    };
  } catch (err) {
    return {
      index,
      lastName,
      firstName,
      status: 'error',
      nb_homonyms: 0,
      identifiers: [],
      error: err.message,
    };
  }
};

const usePydrefFetch = ({ data, setResults, setError, setLoading }) => {
  const fetchIdentifiers = async () => {
    if (!data || data.length === 0) return;

    setError(null);
    setLoading(true);
    setResults([]);

    const promises = data.map((entry) => identifyPerson({
      lastName: entry.last_name,
      firstName: entry.first_name,
      index: entry.index,
    }));

    const results = await Promise.all(promises);

    setResults(results);
    setLoading(false);
  };

  return { fetchIdentifiers };
};

export default usePydrefFetch;
