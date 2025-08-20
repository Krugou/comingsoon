#!/bin/bash

echo "🧪 Testing Coming Soon NodeCG Bundle"
echo "=================================="

# Test 1: Check if all required files exist
echo "✅ Checking file structure..."
files=(
  "package.json"
  "nodecg.json"
  "extension/index.js"
  "graphics/index.html"
  "dashboard/controls.html"
  "shared/scene.js"
  "shared/utils.js"
  "examples/index.html"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file exists"
  else
    echo "  ✗ $file missing"
    exit 1
  fi
done

# Test 2: Check if dependencies are installed
echo ""
echo "✅ Checking dependencies..."
if [ -d "node_modules" ]; then
  echo "  ✓ node_modules exists"
else
  echo "  ✗ node_modules missing - run 'npm install'"
  exit 1
fi

# Test 3: Test build process
echo ""
echo "✅ Testing build process..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "  ✓ Build successful"
else
  echo "  ✗ Build failed"
  exit 1
fi

# Test 4: Check built files
echo ""
echo "✅ Checking built files..."
built_files=(
  "dist/graphics/index.html"
  "dist/dashboard/controls.html"
  "dist/examples/index.html"
)

for file in "${built_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file built"
  else
    echo "  ✗ $file not built"
    exit 1
  fi
done

# Test 5: Validate JSON files
echo ""
echo "✅ Validating JSON files..."
if python3 -m json.tool package.json > /dev/null 2>&1; then
  echo "  ✓ package.json is valid"
else
  echo "  ✗ package.json is invalid"
  exit 1
fi

if python3 -m json.tool nodecg.json > /dev/null 2>&1; then
  echo "  ✓ nodecg.json is valid"
else
  echo "  ✗ nodecg.json is invalid"
  exit 1
fi

echo ""
echo "🎉 All tests passed! The NodeCG bundle is ready to use."
echo ""
echo "📋 Next steps:"
echo "  1. Run 'npm start' to launch NodeCG with this bundle"
echo "  2. Open http://localhost:9090/bundles/comingsoon/graphics/ for graphics"
echo "  3. Or run 'npm run standalone' to test the standalone version"