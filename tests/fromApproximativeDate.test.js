import { fromApproximativeDate } from '../src/utils/dates';

test('fromApproximativeDate function has to returns expected results', () => {
  expect(fromApproximativeDate('2022')).toBe('2022-01-01');
  expect(fromApproximativeDate('2022-03')).toBe('2022-03-01');
  expect(fromApproximativeDate('2022-03-31')).toBe('2022-03-31');
});
