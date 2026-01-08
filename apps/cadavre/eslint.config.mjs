import { defineConfig, globalIgnores } from "eslint/config";
import sharedConfig from "@marcapagina/eslint-config";

const eslintConfig = defineConfig([
  ...sharedConfig,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "dist/**",
    "coverage/**",
  ]),
]);

export default eslintConfig;
