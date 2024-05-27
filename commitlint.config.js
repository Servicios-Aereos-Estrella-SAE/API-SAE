export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-length': [2, 'never', Number.POSITIVE_INFINITY],
    'body-max-line-length': [2, 'never', Number.POSITIVE_INFINITY],
    'header-max-length': [2, 'never', Number.POSITIVE_INFINITY],
  },
}
