// Run from repo root: node tools/find-python-urls.js

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const skipDirs = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', 'out', '.next']);
const fileExtFilter = new Set(['.js','.ts','.jsx','.tsx','.json','.env','.env.local','.yaml','.yml','.md','.dockerfile','.ini']);
const pythonPatterns = [
  /https?:\/\/[^\s'"]*(python|py-worker|ai-worker|ai-service|ai-api|ml-service)[^\s'"]*/i,
  /https?:\/\/localhost:\d{2,5}/i,
  /https?:\/\/127\.0\.0\.1:\d{2,5}/i,
  /\b(PYTHON_HOST|AI_API|PYTHON_URL|PY_WORKER|AI_WORKER|PY_API|AI_WORKER_URL)\b/i
];

function walk(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (skipDirs.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) results.push(...walk(full));
    else {
      const ext = path.extname(ent.name).toLowerCase();
      if (fileExtFilter.has(ext) || ent.name.startsWith('.env') || ext === '') results.push(full);
    }
  }
  return results;
}

function safeRead(file) {
  try {
    const buf = fs.readFileSync(file);
    const text = buf.toString('utf8');
    if (text.indexOf('\u0000') !== -1) return null;
    return text;
  } catch {
    return null;
  }
}

const files = walk(root);
let found = [];

for (const f of files) {
  const content = safeRead(f);
  if (!content) continue;
  for (const rx of pythonPatterns) {
    const m = content.match(rx);
    if (m) {
      found.push({ file: path.relative(root, f), match: m[0].slice(0, 200) });
      break;
    }
  }
}

if (found.length === 0) {
  console.log('✅ No obvious python/AI URLs or env keys found.');
  process.exit(0);
} else {
  console.log(`⚠️ Found ${found.length} potential matches:`);
  for (const x of found) {
    console.log(`${x.file} -> ${x.match}`);
  }
  process.exit(2);
}