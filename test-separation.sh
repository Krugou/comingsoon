#!/bin/bash

# Test script to verify breaking news and name tag systems work independently

echo "🧪 Testing Breaking News and Name Tag Separation"
echo "=============================================="

# Start a test server
echo "Starting test server..."
python3 -m http.server 8081 > /dev/null 2>&1 &
SERVER_PID=$!
sleep 2

# Function to cleanup
cleanup() {
    echo "Cleaning up..."
    kill $SERVER_PID 2>/dev/null
    exit $1
}

# Trap to ensure cleanup on exit
trap 'cleanup 1' INT TERM

# Test 1: Check if breaking news file exists and loads
echo "✅ Testing breaking news graphics file..."
if curl -s -f http://localhost:8081/graphics/breaking-news.html > /dev/null; then
    echo "  ✓ breaking-news.html loads successfully"
else
    echo "  ✗ breaking-news.html failed to load"
    cleanup 1
fi

# Test 2: Check if breaking news dashboard exists and loads
echo "✅ Testing breaking news dashboard file..."
if curl -s -f http://localhost:8081/dashboard/breaking-news.html > /dev/null; then
    echo "  ✓ breaking-news dashboard loads successfully"
else
    echo "  ✗ breaking-news dashboard failed to load"
    cleanup 1
fi

# Test 3: Check if name tag chyron still works
echo "✅ Testing name tag chyron graphics file..."
if curl -s -f http://localhost:8081/graphics/name-tag-chyron.html > /dev/null; then
    echo "  ✓ name-tag-chyron.html loads successfully"
else
    echo "  ✗ name-tag-chyron.html failed to load"
    cleanup 1
fi

# Test 4: Check if name tag dashboard still works
echo "✅ Testing name tag chyron dashboard file..."
if curl -s -f http://localhost:8081/dashboard/name-tag-chyron.html > /dev/null; then
    echo "  ✓ name-tag-chyron dashboard loads successfully"
else
    echo "  ✗ name-tag-chyron dashboard failed to load"
    cleanup 1
fi

# Test 5: Verify breaking news content is separate
echo "✅ Testing content separation..."
BREAKING_NEWS_CONTENT=$(curl -s http://localhost:8081/graphics/breaking-news.html)
NAME_TAG_CONTENT=$(curl -s http://localhost:8081/graphics/name-tag-chyron.html)

if echo "$BREAKING_NEWS_CONTENT" | grep -q "BREAKING NEWS" && ! echo "$BREAKING_NEWS_CONTENT" | grep -q "chyron-name"; then
    echo "  ✓ Breaking news contains breaking news content only"
else
    echo "  ✗ Breaking news content separation failed"
    cleanup 1
fi

if echo "$NAME_TAG_CONTENT" | grep -q "chyron-name" && ! echo "$NAME_TAG_CONTENT" | grep -q "BREAKING NEWS"; then
    echo "  ✓ Name tag contains name tag content only"
else
    echo "  ✗ Name tag content separation failed"
    cleanup 1
fi

# Test 6: Check NodeCG configuration
echo "✅ Testing NodeCG configuration..."
if grep -q "breaking-news.html" nodecg.json && grep -q "breaking-news" nodecg.json; then
    echo "  ✓ NodeCG configuration includes breaking news files"
else
    echo "  ✗ NodeCG configuration missing breaking news entries"
    cleanup 1
fi

echo ""
echo "🎉 All separation tests passed!"
echo "📋 Summary:"
echo "  - Breaking news graphics: ✓ Independent"
echo "  - Breaking news dashboard: ✓ Independent"
echo "  - Name tag graphics: ✓ Independent"
echo "  - Name tag dashboard: ✓ Independent"
echo "  - Content separation: ✓ Complete"
echo "  - NodeCG configuration: ✓ Updated"

cleanup 0