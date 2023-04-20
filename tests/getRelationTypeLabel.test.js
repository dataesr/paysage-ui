import getRelationTypeLabel from '../src/utils/get-relation-type-key';

test('if should return feminineName if gender is "Femme", maleName if "Homme" and name if nothing or null', () => {
  expect(getRelationTypeLabel('Femme')).toBe('feminineName');
  expect(getRelationTypeLabel('Homme')).toBe('maleName');
  expect(getRelationTypeLabel()).toBe('name');
  expect(getRelationTypeLabel(null)).toBe('name');
  expect(getRelationTypeLabel(undefined)).toBe('name');
});
