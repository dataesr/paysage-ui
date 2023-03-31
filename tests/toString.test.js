const { toString } = require('../src/utils/dates');

test('toString returns the correct string representation of the date', () => {
  const date = '2022-03-31T12:34:56.789Z';
  const expected = '31 mars 2022';
  const result = toString(date);
  expect(result).toBe(expected);
});

// Pour récupèrer la date, prendre par exemple la valeur de "createdAt" dans l'inspecteur
// on peut décomposer le test en créant des varibles intermédiaires

// on aurait pu faire :
// test('toString returns the correct string representation of the date', () => {
//   expect(toString('2022-03-31T12:34:56.789Z')).toBe('31 mars 2022');
// });
// mais c'est moins claire
