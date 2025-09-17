import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import unusedImports from "eslint-plugin-unused-imports";
import airbnbBase from "eslint-config-airbnb-base";
import airbnbTypescript from "eslint-config-airbnb-typescript";


export default defineConfig([
  js.configs.recommended,
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.node,
        ...globals.browser,

      },
      plugins: {
        "@typescript-eslint": tseslint,
        "unuserd-imports": unusedImports,
      },
      rules: {
        ...airbnbBase.rules,
        ...airbnbTypescript.rules,
        "no-unused-vars": "off",
        "unused-imports/no-unused-vars": [
          "warn",
          {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
            caughErrorsIgnorePattern: "^_",
          }
        ]
      },
      settings: {
        "import/resolver": {
          node: {
            extensions: [".js", ".mjs", ".cjs", ".ts", ".mts", ".cts"],
          }
        }
      }
    },
  }
]);
