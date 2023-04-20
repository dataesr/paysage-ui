import pLimit from 'p-limit';
import api from '../../../utils/api';

const limit = pLimit(5);

function parseApiErrors(data) {
  return data.details;
}

async function bulk(analysis, url) {
  return Promise.all(analysis.map(async (a) => limit(() => {
    if (a.status !== 'success') return a;
    return api.post(url, a.body)
      .then((r) => {
        const status = (r.status === 201) ? 'imported' : 'error';
        const error = (r.status !== 201) ? parseApiErrors(r.data) : [];
        const href = `${url}/${r.data.id}`;
        return { ...a, imports: { status, error, href } };
      })
      .catch(() => ({ ...a, imports: { status: 'error', error: [{ message: 'Une erreur inattendue est survenue' }] } }));
  })));
}

export default async function bulkImport(analysis, type) {
  switch (type) {
  case 'structures':
    return bulk(analysis, '/structures');
  case 'personnes':
    return bulk(analysis, '/persons');
  default:
    throw new Error('Not implemented');
  }
}
