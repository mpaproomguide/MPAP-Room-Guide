#!/bin/bash

# Toggle between index.html and index2.html
# Usage: ./toggle_index.sh

if [ -f "index.html" ] && [ -f "index2.html" ]; then
    if grep -q "building-navigator" index.html; then
        echo "Switching to accordion style..."
        mv index.html index-new.html
        mv index2.html index.html
        mv index-new.html index2.html
        echo "✅ Now using accordion style (index.html)"
    else
        echo "Switching to 3D navigator style..."
        mv index.html index-old.html
        mv index2.html index.html
        mv index-old.html index2.html
        echo "✅ Now using 3D navigator style (index.html)"
    fi
else
    echo "❌ Error: Both index.html and index2.html must exist"
    exit 1
fi 