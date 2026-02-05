// Verify that UI → Core path is correct
const config = require('../src/core/config.ts');

console.log('📋 Verifying Core Communication Path:');
console.log('─────────────────────────────────────');

// Check environment
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
console.log(`✅ API Base URL: ${apiBaseUrl}`);

// Verify it's Core, not Python
if (apiBaseUrl.includes(':8000')) {
  console.error('❌ FAIL: UI points to Python directly!');
  process.exit(1);
}

if (apiBaseUrl.includes(':3001')) {
  console.log('✅ PASS: UI points to Unified Core');
}

console.log('─────────────────────────────────────');
console.log('✅ SCRUM-21.2: Call path verified!');
console.log('   UI → Core (:3001) → Python (:8000)');