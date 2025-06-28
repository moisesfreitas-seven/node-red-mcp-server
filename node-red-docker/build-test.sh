#!/bin/bash

echo "Building Node-RED Docker image..."
docker build -t node-red-mcp-test .

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "You can test the container with:"
    echo "docker run -p 1880:1880 node-red-mcp-test"
else
    echo "❌ Build failed!"
    exit 1
fi 