import api from '../../../../../utils/api';

function requiredChecker({ usualNameFr }) {
  const errors = [];
  if (!usualNameFr) errors.push({ message: 'Le nom du terms est obligatoire' });
  return errors;
}

async function nameChecker({ usualNameFr }) {
  if (!usualNameFr) return [];
  const { data } = await api.get(`/autocomplete?types=terms&query=${usualNameFr}`);
  const duplicate = data?.data.find((el) => el.name === usualNameFr);
  if (duplicate) {
    return [{
      message: `Le terme ${usualNameFr} existe déjà dans la base de donnée`,
      href: `/terms/${duplicate.id}`,
    }];
  }
  return [];
}

async function wikidataChecker({ usualNameFr, wikidata }) {
  if (!wikidata) return [];

  const { data } = await api.get(`/autocomplete?types=terms&query=${usualNameFr}`);
  if (data.data.some((el) => el.identifiers.map((id) => id.includes(wikidata)))) {
    return [{
      message: `L'identifiant ${wikidata} existe déjà dans la base de données`,
    }];
  }

  return [];
}

async function rncpChecker({ usualNameFr, rncp }) {
  if (!rncp) return [];

  const { data } = await api.get(`/autocomplete?types=terms&query=${usualNameFr}`);
  if (data.data.some((el) => el.identifiers.map((id) => id.includes(rncp)))) {
    return [{
      message: `L'identifiant ${rncp} existe déjà dans la base de données`,
    }];
  }

  return [];
}

function websiteChecker({ websiteFr, websiteEn }) {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  if (websiteFr && !urlRegex.test(websiteFr)) {
    return [{ message: `L'URL ${websiteFr} n'est pas valide` }];
  }
  if (websiteEn && !urlRegex.test(websiteEn)) {
    return [{ message: `L'URL ${websiteEn} n'est pas valide` }];
  }
  return [];
}

export default async function checker(docs, index) {
  try {
    const doc = docs[index];
    const websiteChecked = await websiteChecker(doc);
    const requiredErrors = requiredChecker(doc);
    const nameCheck = await nameChecker(doc);
    const wikiCheck = await wikidataChecker(doc);
    const rncpCheck = await rncpChecker(doc);
    const warning = [...websiteChecked, ...nameCheck, ...wikiCheck, ...rncpCheck];
    const error = [...requiredErrors];
    let status = 'success';
    if (warning.length) { status = 'warning'; }
    if (error.length) { status = 'error'; }
    return { warning, error, status };
  } catch (e) {
    return { error: [{ message: "Une erreur s'est produite lors de la vérification, vérifiez la ligne" }], status: 'error' };
  }
}
