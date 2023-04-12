import parseStructureTSV from './structures';

export default async function analyse(str, type) {
  switch (type) {
  case 'structures':
    return parseStructureTSV(str);
  default:
    throw new Error('Not implemented');
  }
}
