#!/bin/bash

# Mobile Server Launcher for MPAP Room Guide
# This script starts the Python HTTP server for mobile access

echo "🚀 Starting MPAP Room Guide Mobile Server..."
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed or not in PATH"
    echo "   Please install Python 3 and try again"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found"
    echo "   Please run this script from the MPAP Room Guide directory"
    exit 1
fi

# Make the Python script executable
chmod +x mobile_server.py

# Start the server
echo "📱 Starting server..."
echo "   (Press Ctrl+C to stop)"
echo ""

python3 mobile_server.py 