import api from '../../utils/api';

export default async function checkName(name, siret, index, structuresJson) {
  if (!name || name === undefined) {
    return {
      id: null,
      index,
      name,
      newWarnings: [{ message: "Le nom n'est pas renseigné" }],
    };
  }
  const potentialDuplicates = await api.get(
        `/autocomplete?types=structures&query=${name}`,
  );
  const duplicatedStructureId = potentialDuplicates.data.data.find(
    (el) => el.name === name,
  )?.id;
  const potentialDuplicatedSiret = await api.get(
        `/autocomplete?types=structures&query=${siret}`,
  );
  const duplicatedSiret = potentialDuplicatedSiret.data.data.find(
    (el) => el.identifiers,
  );

  const newWarnings = [];

  const findMultipleImport = structuresJson.filter((el) => el.usualName === name).length > 1;

  if (duplicatedSiret) {
    newWarnings.push({ message: `Le siret ${siret} existe déjà` });
  }

  if (duplicatedStructureId) {
    newWarnings.push({ message: `${name} est probablement un doublon` });
  }
  if (findMultipleImport) {
    newWarnings.push({ message: `${name} est présent plusieurs fois dans le tableau d'import` });
  }

  return {
    id: duplicatedStructureId,
    index,
    name,
    newWarnings,
    siret: duplicatedSiret,
  };
}
