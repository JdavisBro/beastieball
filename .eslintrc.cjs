module.exports = {
  root: true,
  parser: "hermes-eslint",
  plugins: ["ft-flow"],
  extends: ["eslint:recommended", "plugin:ft-flow/recommended", "prettier"],
};
