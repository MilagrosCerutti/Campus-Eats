import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore generated files and build output
  globalIgnores(['dist', 'src/components/ui/**']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // setState inside useEffect is a valid pattern for data fetching
      'react-hooks/set-state-in-effect': 'off',
      // Hooks/utils exported alongside components is intentional
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // _-prefixed names are intentionally unused (e.g. destructuring to omit a key)
      'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', ignoreRestSiblings: true }],
      // react-hook-form's watch() is intentionally used despite React Compiler memoization limits
      'react-hooks/incompatible-library': 'off',
    },
  },
])
