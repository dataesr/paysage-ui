import { useEffect, useMemo, useState } from 'react';
import api from '../../../../utils/api';
import { GOUVERNANCE } from '../../../../utils/relations-tags';
import { getComparableNow } from '../../../../utils/dates';
import { relationTypeOptions } from '../../utils';

const datesOverlap = (mStart, mEnd, newStart, newEnd) => {
  if (mEnd && newStart && mEnd < newStart) return false;
  if (mStart && newEnd && mStart > newEnd) return false;
  return true;
};

function useOfficialTextSearch() {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    if (!query) { setOptions([]); return; }
    let cancelled = false;
    setSearching(true);
    api.get(`/autocomplete?query=${encodeURIComponent(query)}&types=official-texts`)
      .then((res) => { if (!cancelled) { setOptions(res.data?.data || []); setSearching(false); } })
      .catch(() => { if (!cancelled) { setOptions([]); setSearching(false); } });
    // eslint-disable-next-line consistent-return
    return () => { cancelled = true; };
  }, [query]);

  const select = ({ id: newId, name: newName }) => {
    setId(newId); setName(newName); setQuery(''); setOptions([]);
  };
  const unselect = () => { setId(null); setName(null); setQuery(''); setOptions([]); };
  const reset = () => { setId(null); setName(null); setQuery(''); setOptions([]); setSearching(false); };

  return { query, setQuery, options, searching, id, name, select, unselect, reset };
}

export default function useMandate(allRelationTypes) {
  const [relTypeQuery, setRelTypeQuery] = useState('');
  const [selectedRelType, setSelectedRelType] = useState(null);
  const relTypeOptions = useMemo(
    () => relationTypeOptions(allRelationTypes, relTypeQuery),
    [relTypeQuery, allRelationTypes],
  );

  const [structureQuery, setStructureQuery] = useState('');
  const [structureOptions, setStructureOptions] = useState([]);
  const [structureSearching, setStructureSearching] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [activeRelations, setActiveRelations] = useState([]);
  const [conflictsToClose, setConflictsToClose] = useState({});

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endDatePrevisional, setEndDatePrevisional] = useState('');
  const [active, setActive] = useState(null);

  const [reason, setReason] = useState(null);
  const [temporary, setTemporary] = useState(false);
  const [position, setPosition] = useState(null);
  const [precision, setPrecision] = useState('');
  const [email, setEmail] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');

  const startOT = useOfficialTextSearch();
  const endOT = useOfficialTextSearch();

  const conflicts = useMemo(() => {
    if (!selectedRelType || !activeRelations.length) return [];
    return activeRelations.filter(
      (m) => (m.relationTypeId === selectedRelType.id || m.relationType?.id === selectedRelType.id)
        && datesOverlap(m.startDate, m.endDate, startDate || null, endDate || null),
    );
  }, [activeRelations, selectedRelType, startDate, endDate]);

  useEffect(() => {
    setConflictsToClose(Object.fromEntries(conflicts.map((m) => [m.id, ''])));
  }, [conflicts]);

  const searchStructure = async (q) => {
    setStructureQuery(q);
    if (!q || q.length < 2) { setStructureOptions([]); return; }
    setStructureSearching(true);
    try {
      const { data } = await api.get(`/autocomplete?types=structures&query=${encodeURIComponent(q)}`);
      setStructureOptions(data?.data || []);
    } catch { setStructureOptions([]); }
    setStructureSearching(false);
  };

  const selectStructure = async (item) => {
    setSelectedStructure(item);
    setStructureQuery('');
    setStructureOptions([]);
    setActiveRelations([]);
    try {
      const { data } = await api.get(`/relations?filters[relationTag]=${GOUVERNANCE}&filters[resourceId]=${item.id}&limit=500`);
      const now = getComparableNow();
      const items = (data?.data || []).filter((m) => m.active !== false && (!m.endDate || m.endDate >= now));
      setActiveRelations(items);
    } catch { setActiveRelations([]); }
  };

  const reset = () => {
    setRelTypeQuery(''); setSelectedRelType(null);
    setStructureQuery(''); setStructureOptions([]); setStructureSearching(false);
    setSelectedStructure(null); setActiveRelations([]); setConflictsToClose({});
    setStartDate(''); setEndDate(''); setEndDatePrevisional(''); setActive(null);
    setReason(null); setTemporary(false); setPosition(null);
    setPrecision(''); setEmail(''); setPersonalEmail(''); setPhonenumber('');
    startOT.reset(); endOT.reset();
  };

  const mandate = {
    relType: { query: relTypeQuery, options: relTypeOptions, selected: selectedRelType },
    structure: { query: structureQuery, options: structureOptions, searching: structureSearching, selected: selectedStructure },
    conflicts,
    conflictsToClose,
    startDate,
    endDate,
    endDatePrevisional,
    active,
    reason,
    temporary,
    position,
    precision,
    email,
    personalEmail,
    phonenumber,
    startOT,
    endOT,
  };

  const on = {
    setRelTypeQuery,
    selectRelType: (item) => { setSelectedRelType(item); setRelTypeQuery(''); },
    unselectRelType: () => { setSelectedRelType(null); setRelTypeQuery(''); },
    searchStructure,
    selectStructure,
    unselectStructure: () => { setSelectedStructure(null); setStructureOptions([]); setActiveRelations([]); },
    toggleConflict: (id) => setConflictsToClose((prev) => {
      const next = { ...prev };
      if (id in next) delete next[id]; else next[id] = '';
      return next;
    }),
    setClosureDate: (id, date) => setConflictsToClose((prev) => ({ ...prev, [id]: date })),
    setStartDate,
    setEndDate,
    setEndDatePrevisional: (v) => { setEndDatePrevisional(v); setActive(null); },
    setActive,
    setReason,
    setTemporary,
    setPosition,
    setPrecision,
    setEmail,
    setPersonalEmail,
    setPhonenumber,
  };

  const apiPayload = {
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    endDatePrevisional: endDatePrevisional || undefined,
    active,
    mandateReason: reason || undefined,
    mandateTemporary: temporary,
    mandatePosition: position || undefined,
    mandatePrecision: precision || undefined,
    mandateEmail: email || undefined,
    personalEmail: personalEmail || undefined,
    mandatePhonenumber: phonenumber || undefined,
    startDateOfficialTextId: startOT.id || undefined,
    endDateOfficialTextId: endOT.id || undefined,
  };

  return { mandate, on, apiPayload, reset };
}
