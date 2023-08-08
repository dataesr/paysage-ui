const MAPPING = {
  scheduled: ['new', 'Prévue'],
  failed: ['error', 'Echouée'],
  success: ['success', 'Réussie'],
  running: ['info', 'En cours'],
};

export function getJobStatus(status) {
  return MAPPING[status] || [null, null];
}
