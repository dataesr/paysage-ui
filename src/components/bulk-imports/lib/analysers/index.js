import parsePersonTSV from './persons';
import parseStructureTSV from './structures';

export default async function analyse(str, type) {
  let analyses;
  switch (type) {
  case 'structures':
    analyses = await parseStructureTSV(str);
    if (analyses.length > 0) { return analyses; }
    throw new Error('File Error');
  case 'personnes':
    analyses = await parsePersonTSV(str);
    if (analyses.length > 0) { return analyses; }
    throw new Error('File Error');
  default:
    throw new Error('Not implemented');
  }
}
