import parsePersonTSV from './persons';
import parseStructureTSV from './structures';
import parsePriceTSV from './prizes';
import parseLaureatsTSV from './laureats';
import parseGouvernanceTSV from './gouvernance';
import parseTermsTSV from './terms';
import parseStructuresIdentifiersTSV from './structures-identifiers';
import parsePersonsIdentifiersTSV from './persons-identifiers';

export default async function analyse(str, type) {
  let analyses;
  switch (type) {
  case 'structures':
    analyses = await parseStructureTSV(str);
    if (analyses.length > 0) {
      return analyses;
    }
    throw new Error('File Error');
  case 'personnes':
    analyses = await parsePersonTSV(str);
    if (analyses.length > 0) {
      return analyses;
    }
    throw new Error('File Error');
  case 'prix':
    analyses = await parsePriceTSV(str);
    if (analyses.length > 0) {
      return analyses;
    }
    throw new Error('File Error');
  case 'laureats':
    analyses = await parseLaureatsTSV(str);
    if (analyses.length > 0) {
      return analyses;
    }
    throw new Error('File Error');
  case 'gouvernance':
    analyses = await parseGouvernanceTSV(str);
    if (analyses.length > 0) {
      return analyses;
    }
    throw new Error('File Error');
  case 'structures (identifiants)':
    analyses = await parseStructuresIdentifiersTSV(str);
    if (analyses.length > 0) {
      return analyses;
    }
    throw new Error('File Error');
  case 'personnes (identifiants)':
    analyses = await parsePersonsIdentifiersTSV(str);
    if (analyses.length > 0) {
      return analyses;
    }
    throw new Error('File Error');
  case 'termes':
    analyses = await parseTermsTSV(str);
    if (analyses.length > 0) {
      return analyses;
    }
    throw new Error('File Error');
  default:
    throw new Error('Not implemented');
  }
}
