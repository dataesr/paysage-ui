import api from './api';

export async function initializeStructure(id) {
  await api.post(`/structures/${id}/relations-groups`, { name: 'Gouvernance', accepts: ['persons'], priority: 1 });
  await api.post(`/structures/${id}/relations-groups`, { name: 'Référents MESR', accepts: ['persons'], priority: 1 });
  await api.post(`/structures/${id}/relations-groups`, { name: 'Structures internes', accepts: ['structures'], priority: 1 });
  await api.post(`/structures/${id}/relations-groups`, { name: 'Catégories', accepts: ['categories'], priority: 1 });
}
