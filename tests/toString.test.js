const { toString } = require('../src/utils/dates');

test('toString returns the correct string representation of the date', () => {
  const date = '2022-03-31T12:34:56.789Z';
  const expected = '31 mars 2022';
  const result = toString(date);
  expect(result).toBe(expected);
});
