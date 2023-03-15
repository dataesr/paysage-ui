export function cleanStructureData(structure) {
  const cleanedStructure = {};
  const acceptedKeys = [
    'usualName',
    'structureStatus',
    'creationDate',
    'closureDate',
  ];
  Object.keys(structure).forEach((key) => {
    if (acceptedKeys.includes(key)) { cleanedStructure[key] = structure[key]; }
  });
  return cleanedStructure;
}

export function cleanSocialMediasData(structure) {
  const cleanedSocialMedias = {};
  const acceptedKeys = [
    'academia',
    'Dailymotion',
    'Facebook',
    'Flickr',
    'France Culture',
    'Github',
    'Gitlab',
    'Instagram',
    'Linkedin',
    'Pinterest',
    'researchgate',
    'Scoopit',
    'Scribd',
    'Snapchat',
    'soundcloud',
    'Tiktok',
    'Tumblr',
    'Twitch',
    'Twitter',
    'Vimeo',
    'Youtube',
  ];
  Object.keys(structure).forEach((key) => {
    const index = acceptedKeys.findIndex((acceptedKey) => acceptedKey.toLowerCase() === key.toLowerCase());
    if (index !== -1) {
      cleanedSocialMedias[acceptedKeys[index]] = structure[key];
    }
  });
  return cleanedSocialMedias;
}

export function cleanStructureLocalisation(structure) {
  const cleanedStructureLocalisations = {};
  const acceptedKeys = [
    'cityId',
    'city',
    'distributionStatement',
    'address',
    'postOfficeBoxNumber',
    'postalCode',
    'locality',
    'place',
    'country',
    'phonenumber',
    'coordinates',
    'active',
    'startDate',
    'endDate',
    'iso3',
  ];
  Object.keys(structure).forEach((key) => {
    const index = acceptedKeys.findIndex((acceptedKey) => acceptedKey.toLowerCase() === key.toLowerCase());
    if (index !== -1) {
      cleanedStructureLocalisations[acceptedKeys[index]] = structure[key];
    }
  });
  return cleanedStructureLocalisations;
}

export function cleanWeblinks(structure) {
  const cleanedWeblinks = {};
  if (structure.websiteFr) {
    const url = structure.websiteFr.trim();
    if (url !== '') {
      cleanedWeblinks.website = {
        type: 'website',
        url,
      };
    }
  }
  return cleanedWeblinks;
}

export function cleanStructureNameData(structure) {
  const cleanedName = {};
  const acceptedKeys = [
    'officialName',
    'shortName',
    'usualName',
    'brandName',
    'nameEN',
    'acronymFr',
    'acronymEn',
    'acronymLocal',
    'otherNames',
    'startDate',
    'endDate',
    'comment',
    'article',
  ];
  Object.keys(structure).forEach((key) => {
    const index = acceptedKeys.findIndex((acceptedKey) => acceptedKey.toLowerCase() === key.toLowerCase());
    if (index !== -1) {
      cleanedName[acceptedKeys[index]] = structure[key];
    }
  });
  return cleanedName;
}

export function cleanIdentifiersData(structure) {
  const cleanedIdentifiers = {};
  const acceptedKeys = [
    'annelis',
    'bibid',
    'bnf',
    'cnrs-unit',
    'cti',
    'ed',
    'eter',
    'etid',
    'finess',
    'fundref',
    'grid',
    'idhal',
    'idref',
    'isil',
    'isni',
    'oc',
    'orgref',
    'pia',
    'pic',
    'rcr',
    'rinngold',
    'rna',
    'rnsr',
    'ror',
    'rtoad',
    'sdid',
    'siret',
    'uai',
    'wikidata',

  ];
  Object.keys(structure).forEach((key) => {
    const index = acceptedKeys.findIndex((acceptedKey) => acceptedKey.toLowerCase() === key.toLowerCase());
    if (index !== -1) {
      cleanedIdentifiers[acceptedKeys[index]] = structure[key];
    }
  });
  return cleanedIdentifiers;
}
