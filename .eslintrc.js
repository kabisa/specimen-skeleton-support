module.exports = {
  plugins: ["prettier"],
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:jest/recommended"
  ],
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      modules: true
    },
    ecmaVersion: 2020
  },
  rules: {
    "prettier/prettier": "error"
  },
  overrides: [
    {
      files: "**/*.test.js",
      rules: {
        "node/no-unpublished-require": 0
      }
    }
  ]
};
