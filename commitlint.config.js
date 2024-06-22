export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-length': [2, 'never', Number.POSITIVE_INFINITY],
    'body-max-line-length': [2, 'never', Number.POSITIVE_INFINITY],
    'header-max-length': [2, 'never', Number.POSITIVE_INFINITY],
    'subject-case': [
      2,
      'always',
      [
        'lower-case', // lower case
        'upper-case', // UPPERCASE
        'camel-case', // camelCase
        'kebab-case', // kebab-case
        'pascal-case', // PascalCase
        'sentence-case', // Sentence case
        'snake-case', // snake_case
        'start-case', // Start Case
      ],
    ],
  },
}
