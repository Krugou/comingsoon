const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const log = (message) => console.log(message);
const fail = (message) => {
  log(`✗ ${message}`);
  process.exit(1);
};

const assertExists = (relativePath) => {
  const fullPath = path.join(rootDir, relativePath);
  if (fs.existsSync(fullPath)) {
    log(`  ✓ ${relativePath} exists`);
    return;
  }
  fail(`${relativePath} missing`);
};

log('🧪 Testing Coming Soon NodeCG Bundle');
log('==================================');

log('✅ Checking file structure...');
[
  'package.json',
  'nodecg.json',
  'extension/index.js',
  'graphics/index.html',
  'dashboard/controls.html',
  'shared/scene.js',
  'shared/utils.js',
  'examples/index.html',
].forEach(assertExists);

log('');
log('✅ Checking dependencies...');
if (fs.existsSync(path.join(rootDir, 'node_modules'))) {
  log('  ✓ node_modules exists');
} else {
  fail("node_modules missing - run 'npm install'");
}

log('');
log('✅ Testing build process...');
const viteBin = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');
const buildResult = spawnSync(process.execPath, [viteBin, 'build'], {
  cwd: rootDir,
  stdio: 'inherit',
});
if (buildResult.error || buildResult.status !== 0) {
  fail('Build failed');
}
log('  ✓ Build successful');

log('');
log('✅ Checking built files...');
['dist/graphics/index.html', 'dist/dashboard/controls.html', 'dist/examples/index.html'].forEach(
  assertExists
);

log('');
log('✅ Validating JSON files...');
try {
  JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  log('  ✓ package.json is valid');
} catch (err) {
  fail('package.json is invalid');
}

try {
  JSON.parse(fs.readFileSync(path.join(rootDir, 'nodecg.json'), 'utf8'));
  log('  ✓ nodecg.json is valid');
} catch (err) {
  fail('nodecg.json is invalid');
}

log('');
log('🎉 All tests passed! The NodeCG bundle is ready to use.');
log('');
log('📋 Next steps:');
log("  1. Run 'npm start' to launch NodeCG with this bundle");
log('  2. Open http://localhost:9090/bundles/comingsoon/graphics/ for graphics');
log("  3. Or run 'npm run standalone' to test the standalone version");
