import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // IMPORTANT: ignores must be FIRST
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".env*",           // Add this to ignore all .env files
      "*.config.js",     // Add this to ignore config files
      "tools/**",        // Add this to ignore tools directory
      "postcss.config.js",
    ],
  },
  
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Deterministic, safe literal checks (applies only to src/)
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        // do NOT block 3001 (Core) or 8081 (frontend dev); block other common local dev ports
        { selector: "Literal[value='http://localhost:3000']", message: "Do not hardcode http://localhost:3000 in frontend code. Use NEXT_PUBLIC_API_BASE_URL (cfg.apiBaseUrl)." },
        { selector: "Literal[value='http://localhost:3002']", message: "Do not hardcode http://localhost:3002 in frontend code. Use NEXT_PUBLIC_API_BASE_URL (cfg.apiBaseUrl)." },
        { selector: "Literal[value='http://localhost:5000']", message: "Do not hardcode http://localhost:5000 in frontend code. Use NEXT_PUBLIC_API_BASE_URL (cfg.apiBaseUrl)." },
        { selector: "Literal[value='http://localhost:8000']", message: "Do not hardcode http://localhost:8000 (Python AI) in frontend code. Route AI calls via Unified Core (localhost:3001)." },
        { selector: "Literal[value='http://localhost:8080']", message: "Do not hardcode http://localhost:8080 in frontend code. Use NEXT_PUBLIC_API_BASE_URL (cfg.apiBaseUrl)." },

        { selector: "Literal[value='http://127.0.0.1:8000']", message: "Do not hardcode http://127.0.0.1:8000 in frontend code. Use NEXT_PUBLIC_API_BASE_URL (cfg.apiBaseUrl)." },

        // Block obvious python/ai worker name literals
        { selector: "Literal[value='python']", message: "Avoid using 'python' literal in frontend code — route AI calls through Unified Core." },
        { selector: "Literal[value='py-worker']", message: "Avoid using 'py-worker' literal in frontend code — route AI calls through Unified Core." },
        { selector: "Literal[value='ai-worker']", message: "Avoid using 'ai-worker' literal in frontend code — route AI calls through Unified Core." },
      ],
    },
  },

  // Soft warnings in env files to avoid client-side python host config
  {
    files: ["**/.env", "**/.env.*"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        { selector: "Literal[value='PYTHON_HOST']", message: "Avoid declaring PYTHON_HOST in frontend env files. Use CORE_URL and keep python config server-side." },
        { selector: "Literal[value='AI_API']", message: "Avoid declaring AI_API in frontend env files. Use CORE_URL and keep python config server-side." }
      ],
    },
  },
];

export default eslintConfig;