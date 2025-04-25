module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Menghapus warning tentang 'any'
      "react/prop-types": "off", // Jika menggunakan TypeScript, bisa non-aktifkan prop-types
    },
    settings: {
      react: {
        version: "detect", // Secara otomatis mendeteksi versi React
      },
    },
  };