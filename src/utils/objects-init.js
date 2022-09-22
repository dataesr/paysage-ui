import api from './api';

export async function initializeStructure(id) {
  await api.post(`/structures/${id}/relations-groups`, { name: 'Gouvernance', accepts: ['persons'] });
  await api.post(`/structures/${id}/relations-groups`, { name: 'Référents MESR', accepts: ['persons'] });
  await api.post(`/structures/${id}/relations-groups`, { name: 'Structures internes', accepts: ['structures'] });
  await api.post(`/structures/${id}/relations-groups`, { name: 'Catégories', accepts: ['categories'] });
}
