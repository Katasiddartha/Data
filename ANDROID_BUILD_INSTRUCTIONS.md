# Android Build Instructions for Test Dashboard App

## Overview
This is a React Native (Expo) mobile application that displays testing data from Google Sheets with real-time updates, tables, and graphs.

## Prerequisites
1. **Node.js** (v18 or higher)
2. **Android Studio** (latest version)
3. **Java Development Kit (JDK)** 11 or higher
4. **Expo CLI**: `npm install -g expo-cli`
5. **EAS CLI**: `npm install -g eas-cli`

## Setup Steps

### 1. Install Dependencies
```bash
cd frontend
yarn install
```

### 2. Configure Environment Variables
The `.env` file in `/frontend` contains:
```
EXPO_PUBLIC_BACKEND_URL=https://build-tracker-mobile.preview.emergentagent.com
```

For local development, update this to your backend URL.

### 3. Running on Android Emulator (Quick Test)
```bash
cd frontend
yarn android
```

This will:
- Start Metro bundler
- Build the app
- Install and run on connected Android emulator/device

### 4. Building for Android Studio (Development Build)

#### Option A: Generate Native Android Project
```bash
cd frontend
npx expo prebuild --platform android
```

This creates an `android/` folder with native Android project files that can be opened in Android Studio.

#### Option B: Build APK using EAS Build
```bash
# Install EAS CLI if not already installed
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS Build
eas build:configure

# Build for Android
eas build --platform android --profile preview
```

### 5. Opening in Android Studio

After running `expo prebuild`:
1. Open Android Studio
2. Click "Open an Existing Project"
3. Navigate to `/app/frontend/android`
4. Select the `android` folder
5. Wait for Gradle sync to complete

### 6. Running from Android Studio
1. Select your target device/emulator from the device dropdown
2. Click the Run button (green play icon) or press Shift+F10
3. The app will build and install on your selected device

## Building Release APK

### Using EAS Build (Recommended)
```bash
# Build production APK
eas build --platform android --profile production

# Download the APK from the Expo dashboard
```

### Using Android Studio
1. Open the project in Android Studio
2. Go to Build → Generate Signed Bundle / APK
3. Select APK
4. Follow the wizard to create/select keystore
5. Choose release build variant
6. Click Finish

## Project Structure
```
frontend/
├── app/
│   └── index.tsx          # Main app screen with dashboard, table, and charts
├── assets/                # Images and static assets
├── android/               # Native Android code (generated)
├── package.json
├── app.json              # Expo configuration
└── .env                  # Environment variables
```

## Key Features
1. **Dashboard View**: Summary cards with key metrics
2. **Table View**: Detailed test results
3. **Chart View**: Line graph showing test trends over time
4. **Real-time Updates**: Auto-refresh every 30 seconds
5. **Filters**: By tester, module, build, and date range
6. **Pull-to-Refresh**: Manual data refresh

## Backend API Endpoints
- `GET /api/test-data` - Fetch all test data with optional filters
- `GET /api/test-data/summary` - Get aggregated statistics
- `GET /api/test-data/filters` - Get available filter options

## Google Sheets Configuration
The app fetches data from Google Sheets with the following columns:
- Date
- Tester
- Module
- Test Cases
- Passed
- Failed
- Build

## Troubleshooting

### Metro Bundler Issues
```bash
# Clear Metro cache
cd frontend
yarn start --reset-cache
```

### Build Errors
```bash
# Clean and rebuild
cd frontend/android
./gradlew clean
cd ..
yarn android
```

### Dependency Issues
```bash
cd frontend
rm -rf node_modules
yarn install
```

## Testing on Physical Device

### Via Expo Go App (Easiest)
1. Install Expo Go from Google Play Store
2. Run `yarn start` in frontend folder
3. Scan QR code with Expo Go app

### Via USB Debugging
1. Enable USB debugging on your Android device
2. Connect via USB
3. Run `yarn android`

## Production Deployment
1. Update version in `app.json`
2. Build release APK/AAB using EAS Build
3. Upload to Google Play Console
4. Follow Play Store guidelines for app submission

## Support
For issues or questions, refer to:
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Android Studio Documentation](https://developer.android.com/studio)
