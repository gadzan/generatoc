module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  verbose: true,
  testRegex: '(/__tests__/.*(\\.)(test|spec))\\.[jt]s?$',
}
