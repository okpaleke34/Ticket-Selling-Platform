module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    mocha: true
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  plugins:['prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'linebreak-style': 0,
    'no-console': 0,
    'semi': ['error','never'],
    "camelcase": "off",
    // 'camelcase': [2, {'properties': 'never','ignoreDestructuring': true,'ignoreGlobals': true}]
  }
}
