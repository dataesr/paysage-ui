import { useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { lookupPydref, lookupRor, lookupWikidataPersons, lookupWikidataStructures } from './external-lookup';

export function usePersonExternalLookup(firstName, lastName) {
  const [pydrefLoading, setPydrefLoading] = useState(false);
  const [pydrefMatches, setPydrefMatches] = useState([]);
  const [wikidataLoading, setWikidataLoading] = useState(false);
  const [wikidataMatches, setWikidataMatches] = useState([]);

  const fullName = `${firstName} ${lastName}`.trim();
  const debouncedName = useDebounce(fullName, 900);

  useEffect(() => {
    if (!firstName.trim() || !lastName.trim()) {
      setPydrefMatches([]);
      setWikidataMatches([]);
      return;
    }

    let cancelled = false;

    const doFetch = async () => {
      setPydrefLoading(true);
      setWikidataLoading(true);

      const [pydref, wikidata] = await Promise.allSettled([
        lookupPydref(debouncedName),
        lookupWikidataPersons(debouncedName),
      ]);

      if (!cancelled) {
        setPydrefMatches(pydref.status === 'fulfilled' ? pydref.value : []);
        setPydrefLoading(false);
        setWikidataMatches(wikidata.status === 'fulfilled' ? wikidata.value : []);
        setWikidataLoading(false);
      }
    };

    doFetch();

    // eslint-disable-next-line consistent-return
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  return {
    pydrefLoading,
    pydrefMatches,
    wikidataLoading,
    wikidataMatches,
  };
}

export function useStructureExternalLookup(name) {
  const [wikidataLoading, setWikidataLoading] = useState(false);
  const [wikidataMatches, setWikidataMatches] = useState([]);
  const [rorLoading, setRorLoading] = useState(false);
  const [rorMatches, setRorMatches] = useState([]);

  const debouncedName = useDebounce((name || '').trim(), 900);

  useEffect(() => {
    if (!debouncedName || debouncedName.length < 3) {
      setWikidataMatches([]);
      return;
    }

    let cancelled = false;

    const doFetchWikidata = async () => {
      setWikidataLoading(true);
      try {
        const matches = await lookupWikidataStructures(debouncedName);
        if (!cancelled) setWikidataMatches(matches);
      } catch {
        if (!cancelled) setWikidataMatches([]);
      }
      if (!cancelled) setWikidataLoading(false);
    };

    doFetchWikidata();

    const doFetchRor = async () => {
      setRorLoading(true);
      try {
        const matches = await lookupRor(debouncedName);
        if (!cancelled) setRorMatches(matches);
      } catch {
        if (!cancelled) setRorMatches([]);
      }
      if (!cancelled) setRorLoading(false);
    };

    doFetchRor();

    // eslint-disable-next-line consistent-return
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  return {
    wikidataLoading,
    wikidataMatches,
    rorLoading,
    rorMatches,
  };
}
