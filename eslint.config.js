import js from "@eslint/js"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    // shadcn/ui export kèm variant helper (buttonVariants, badgeVariants…) theo thiết kế của registry.
    files: ["src/components/ui/**/*.tsx"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    // useReactTable trả về hàm không memoize được — React Compiler chỉ bỏ qua component này,
    // không phải lỗi code. Giữ bảng theo đúng API chính thức của TanStack Table.
    files: ["src/components/data-table/DataTable.tsx"],
    rules: { "react-hooks/incompatible-library": "off" },
  },
  {
    // Provider và hook export cùng file là chủ đích, không phải lỗi HMR.
    files: ["src/lib/theme.tsx"],
    rules: { "react-refresh/only-export-components": "off" },
  }
)
