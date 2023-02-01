export default function getRelationTypeLabel(gender = null) {
  switch (gender) {
  case 'Femme':
    return 'feminineName';
  case 'Homme':
    return 'maleName';
  default:
    return 'name';
  }
}
