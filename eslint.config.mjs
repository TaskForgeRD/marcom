import js from "@eslint/js";
import next from "eslint-config-next";
import tseslint from "typescript-eslint";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...next(),
  prettierRecommended,
  {
    rules: {
      semi: ["error", "always"],
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: false,
      },
    },
  },
];
