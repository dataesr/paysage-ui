/**
 * Sources:
 *  - Pydref  (persons only) : https://pydref.staging.dataesr.ovh/identify
 *  - Wikidata (persons + structures) : https://www.wikidata.org/w/api.php
 */

export const PYDREF_API = 'https://pydref.staging.dataesr.ovh/identify';
const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';
const ROR_API = 'https://api.ror.org/v2/organizations?query=';

const WD_PERSON_IDS = {
  P269: 'idref',
  P496: 'orcid',
  P268: 'bnf',
  P213: 'isni',
  P1960: 'googleScholar',
  P1153: 'scopus',
  P1053: 'wos',
  P10283: 'openAlexPersonId',
  P2038: 'researchgate',
};

const WD_STRUCTURE_IDS = {
  P269: 'idref',
  P6782: 'ror',
  P213: 'isni',
  P2427: 'grid',
  P3153: 'fundref',
  P3876: 'uai',
  P10283: 'openAlexStructId',
};

const WD_SOCIAL_MEDIA = [
  { prop: 'P2397', type: 'Youtube', url: (id) => `https://www.youtube.com/channel/${id}` },
  { prop: 'P2013', type: 'Facebook', url: (id) => `https://www.facebook.com/${id}` },
  { prop: 'P2003', type: 'Instagram', url: (id) => `https://www.instagram.com/${id}/` },
  { prop: 'P2002', type: 'Twitter', url: (id) => `https://twitter.com/${id}` },
  { prop: 'P2037', type: 'Github', url: (id) => `https://github.com/${id}` },
  { prop: 'P7929', type: 'Bluesky', url: (id) => `https://bsky.app/profile/${id}` },
  { prop: 'P4264', type: 'Linkedin', url: (id) => `https://www.linkedin.com/company/${id}` },
  { prop: 'P6634', type: 'Linkedin', url: (id) => `https://www.linkedin.com/in/${id}` },
];

function claimStringValue(claims, prop) {
  const snaks = claims?.[prop];
  if (!snaks?.length) return null;
  const val = snaks[0]?.mainsnak?.datavalue?.value;
  return typeof val === 'string' ? val : null;
}

function claimTimeValue(claims, prop) {
  const snaks = claims?.[prop];
  if (!snaks?.length) return null;
  const time = snaks[0]?.mainsnak?.datavalue?.value?.time;
  if (!time) return null;
  const match = time.match(/[+-]?(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

function claimEntityId(claims, prop) {
  const snaks = claims?.[prop];
  if (!snaks?.length) return null;
  return snaks[0]?.mainsnak?.datavalue?.value?.id || null;
}

async function wikidataSearchQids(query) {
  const params = new URLSearchParams({
    action: 'wbsearchentities',
    search: query,
    language: 'fr',
    limit: '5',
    format: 'json',
    origin: '*',
  });
  const res = await fetch(`${WIKIDATA_API}?${params}`);
  const json = await res.json();
  return (json.search || []).map((r) => r.id);
}

async function wikidataGetEntities(qids) {
  const params = new URLSearchParams({
    action: 'wbgetentities',
    ids: qids.join('|'),
    props: 'labels|descriptions|claims',
    languages: 'fr|en',
    format: 'json',
    origin: '*',
  });
  const res = await fetch(`${WIKIDATA_API}?${params}`);
  const json = await res.json();
  return json.entities || {};
}

function wikidataEntityToResult(qid, entity, idMap, extractExtra) {
  if (!entity || entity.missing !== undefined) return null;
  const label = entity.labels?.fr?.value || entity.labels?.en?.value || qid;
  const description = entity.descriptions?.fr?.value || entity.descriptions?.en?.value || '';
  const claims = entity.claims || {};
  const identifiers = [{ type: 'wikidata', value: qid }];
  Object.entries(idMap).forEach(([prop, type]) => {
    const val = claimStringValue(claims, prop);
    if (val) identifiers.push({ type, value: val });
  });
  const socialMedias = [];
  const usedSmTypes = new Set();
  WD_SOCIAL_MEDIA.forEach(({ prop, type, url }) => {
    const val = claimStringValue(claims, prop);
    if (val && !usedSmTypes.has(type)) {
      socialMedias.push({ type, account: url(val) });
      usedSmTypes.add(type);
    }
  });
  return { qid, label, description, identifiers, socialMedias, ...extractExtra(claims) };
}

async function wikidataLookup(query, idMap, extractExtra) {
  const qids = await wikidataSearchQids(query);
  if (!qids.length) return [];
  const entities = await wikidataGetEntities(qids);
  return qids.map((qid) => wikidataEntityToResult(qid, entities[qid], idMap, extractExtra)).filter(Boolean);
}

async function wikidataFindQidByProperty(prop, value) {
  const safeValue = value.replace(/["\n\r]/g, '');
  const sparql = `SELECT ?item WHERE { ?item wdt:${prop} "${safeValue}" } LIMIT 1`;
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/sparql-results+json' } });
    const json = await res.json();
    const binding = json.results?.bindings?.[0];
    if (!binding) return null;
    return binding.item.value.replace('http://www.wikidata.org/entity/', '');
  } catch {
    return null;
  }
}

export async function lookupPydref(name) {
  const res = await fetch(`${PYDREF_API}?name=${encodeURIComponent(name)}`);
  const json = await res.json();
  if (json.status === 'not_found_ambiguous' || json.status === 'multiple') {
    return json.potential_matches || [];
  }
  if (json.status === 'found') {
    return [{
      idref: (json.identifiers || []).find((o) => o.idref)?.idref,
      full_name: json.full_name || name,
      gender: json.gender,
      birth_date: json.birth_date,
      job: json.job,
      description: json.description,
      identifiers: json.identifiers,
    }];
  }
  return [];
}

export async function lookupWikidataPersons(name) {
  return wikidataLookup(name, WD_PERSON_IDS, (claims) => {
    const birthDate = claimTimeValue(claims, 'P569');
    const genderId = claimEntityId(claims, 'P21');
    let gender = null;
    if (genderId === 'Q6581072') gender = 'Femme';
    else if (genderId === 'Q6581097') gender = 'Homme';
    return { birthDate, gender };
  });
}

export async function lookupWikidataStructures(name) {
  return wikidataLookup(name, WD_STRUCTURE_IDS, (claims) => {
    const inceptionDate = claimTimeValue(claims, 'P571');
    const website = claimStringValue(claims, 'P856');
    return { inceptionDate, website };
  });
}

export async function crossEnrichWikidataStructure(qid) {
  const entities = await wikidataGetEntities([qid]);
  return wikidataEntityToResult(qid, entities[qid], WD_STRUCTURE_IDS, (claims) => ({
    inceptionDate: claimTimeValue(claims, 'P571'),
    website: claimStringValue(claims, 'P856'),
  }));
}

export async function crossEnrichWikidataPerson(qid) {
  const entities = await wikidataGetEntities([qid]);
  const entity = entities[qid];
  if (!entity || entity.missing !== undefined) return null;
  const claims = entity.claims || {};
  const genderId = claimEntityId(claims, 'P21');
  let gender = null;
  if (genderId === 'Q6581072') gender = 'Femme';
  else if (genderId === 'Q6581097') gender = 'Homme';
  return wikidataEntityToResult(qid, entity, WD_PERSON_IDS, (c) => ({
    birthDate: claimTimeValue(c, 'P569'),
    gender,
  }));
}

export async function crossEnrichWikidataPersonByOrcid(orcid) {
  const qid = await wikidataFindQidByProperty('P496', orcid);
  if (!qid) return null;
  return crossEnrichWikidataPerson(qid);
}

export async function crossEnrichWikidataPersonByIsni(isni) {
  const qid = await wikidataFindQidByProperty('P213', isni);
  if (!qid) return null;
  return crossEnrichWikidataPerson(qid);
}

export async function crossEnrichWikidataPersonByIdRef(idref) {
  const qid = await wikidataFindQidByProperty('P269', idref);
  if (!qid) return null;
  return crossEnrichWikidataPerson(qid);
}

function parseRorOrg(org) {
  const rorId = org.id?.replace('https://ror.org/', '') || org.id;
  const names = org.names || [];
  const displayName = names.find((n) => n.types?.includes('ror_display'))?.value
    || names[0]?.value
    || org.name
    || rorId;
  const acronyms = names.filter((n) => n.types?.includes('acronym')).map((n) => n.value);
  const aliases = names.filter((n) => n.types?.includes('alias')).map((n) => n.value);
  const description = [...acronyms, ...aliases].filter(Boolean).join(' · ') || null;
  const links = org.links || [];
  const websiteObj = links.find((l) => l.type === 'website') || links[0];
  const website = typeof websiteObj === 'string' ? websiteObj : (websiteObj?.value || null);
  const country = org.locations?.[0]?.geonames_details?.country_name
    || org.country?.country_name
    || null;
  const identifiers = [{ type: 'ror', value: rorId }];
  const extIdsArray = Array.isArray(org.external_ids)
    ? org.external_ids
    : Object.entries(org.external_ids || {}).map(([type, v]) => ({ type: type.toLowerCase(), ...v }));
  const extIdMap = { isni: 'isni', fundref: 'fundref', wikidata: 'wikidata', grid: 'grid' };
  extIdsArray.forEach(({ type, preferred, all }) => {
    const mappedType = extIdMap[type?.toLowerCase()];
    if (!mappedType) return;
    const val = preferred || (all || [])[0];
    if (val) identifiers.push({ type: mappedType, value: String(val) });
  });
  return {
    rorId, label: displayName, description, country, website, identifiers,
  };
}

export async function lookupRor(name) {
  const res = await fetch(`${ROR_API}${encodeURIComponent(name)}`);
  const json = await res.json();
  return (json.items || []).slice(0, 5).map(parseRorOrg);
}

export async function crossEnrichRorById(rorId) {
  try {
    const res = await fetch(`https://api.ror.org/v2/organizations/${encodeURIComponent(rorId)}`);
    if (!res.ok) return null;
    return parseRorOrg(await res.json());
  } catch {
    return null;
  }
}
