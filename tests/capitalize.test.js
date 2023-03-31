const { capitalize } = require('../src/utils/strings');

test('capitalize capitalizes the first letter of a string', () => {
  expect(capitalize('hello')).toBe('Hello');
  expect(capitalize('world')).toBe('World');
  expect(capitalize('')).toBe('');
  expect(capitalize(123)).toBe('123');
});

// on a toujours expect("blablabla") à tester, pour qu'il soit le toBe("blablabla")
