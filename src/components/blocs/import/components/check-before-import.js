import api from '../../../../utils/api';

export default function checkBeforeImport(parsedData) {
  const { usualName, siret } = parsedData;
  if (!usualName || usualName === undefined) {
    return {
      id: null,
      name: usualName,
      warnings: [{ message: "Le nom n'est pas renseigné" }],
      siret,
    };
  }
  const potentialDuplicates = api.get(
    `/autocomplete?types=structures&query=${usualName}`,
  );
  const duplicatedStructureId = potentialDuplicates.data.data.find(
    (el) => el.name === usualName,
  )?.id;
  const potentialDuplicatedSiret = api.get(
    `/autocomplete?types=structures&query=${siret}`,
  );
  const duplicatedSiret = potentialDuplicatedSiret.data.data.find(
    (el) => el.identifiers && el.identifiers.siret === siret,
  );

  const warnings = [];

  const findMultipleImport = parsedData.filter((el) => el.usualName === usualName).length > 1;

  if (duplicatedSiret) {
    warnings.push({ message: `Le siret ${siret} existe déjà` });
  }

  if (duplicatedStructureId) {
    warnings.push({
      message: `${usualName} est probablement un doublon`,
    });
  }
  if (findMultipleImport) {
    warnings.push({
      message: `${usualName} est présent plusieurs fois dans le tableau d'import`,
    });
  }

  return {
    id: duplicatedStructureId,
    name: usualName,
    warnings,
    siret: duplicatedSiret,
  };
}
