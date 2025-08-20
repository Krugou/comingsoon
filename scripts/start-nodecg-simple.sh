#!/bin/bash

# Simple NodeCG startup script
echo "Starting NodeCG with comingsoon bundle..."

# Ensure we have the basic directories
mkdir -p nodecg-simple/bundles/comingsoon

# Copy files (excluding dashboard for now due to path resolution issues)
cp -r extension shared graphics nodecg-simple/bundles/comingsoon/

# Create a simple bundle package.json with graphics only (dashboard panels disabled for now)
cat > nodecg-simple/bundles/comingsoon/package.json << 'EOF'
{
  "name": "comingsoon",
  "version": "1.0.0",
  "description": "A 3D interactive Coming Soon page for NodeCG with remote control functionality",
  "main": "extension/index.js",
  "nodecg": {
    "compatibleRange": "^2.0.0",
    "graphics": [
      {
        "file": "index.html",
        "width": 1920,
        "height": 1080
      }
    ]
  },
  "dependencies": {
    "three": "^0.168.0"
  }
}
EOF

# Create package.json for the NodeCG instance
cat > nodecg-simple/package.json << 'EOF'
{
  "name": "nodecg-instance",
  "version": "1.0.0",
  "dependencies": {
    "nodecg": "^2.2.1"
  }
}
EOF

# Create symlink to node_modules
ln -sf ../node_modules nodecg-simple/node_modules

echo "Starting NodeCG with graphics..."
echo "Graphics will be available at: http://localhost:9090/bundles/comingsoon/graphics/"
cd nodecg-simple && ./node_modules/.bin/nodecg start