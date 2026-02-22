#!/bin/bash

# Script to generate native Android project for Android Studio

echo "🚀 Generating native Android project..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first..."
    yarn install
fi

# Generate native Android project
echo "🔧 Running expo prebuild for Android..."
npx expo prebuild --platform android --clean

echo ""
echo "✅ Android project generated successfully!"
echo ""
echo "📁 You can now open the 'android' folder in Android Studio"
echo "   Location: $(pwd)/android"
echo ""
echo "📱 To run the app:"
echo "   1. Open Android Studio"
echo "   2. Open the 'android' folder"
echo "   3. Wait for Gradle sync"
echo "   4. Click Run button or press Shift+F10"
echo ""
