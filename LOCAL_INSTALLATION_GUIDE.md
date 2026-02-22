# Local Installation Guide

## Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher
- MongoDB (optional - only if you want to use the database features)

## Step 1: Backend Setup

### Install Python Dependencies
```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Configure Environment Variables
Create/edit `backend/.env`:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
GOOGLE_SHEETS_API_KEY="AIzaSyA5GcXx2x7X9SCzViqP9eLU9H_KKDUiyoQ"
GOOGLE_SHEET_ID="1QE8PLx0zJ-dHjVkeI-0-CKblCUxhs_7d9dKdQ9fVVwg"
```

### Start Backend Server
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Backend will be running at: http://localhost:8001

Test it: http://localhost:8001/api/test-data/summary

## Step 2: Frontend Setup

### Install Node Dependencies
```bash
cd frontend
yarn install
# or
npm install
```

### Configure Environment Variables
Create/edit `frontend/.env`:
```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
```

**Important:** For Android emulator, use:
- `http://10.0.2.2:8001` instead of `localhost`

For physical device, use your computer's IP address:
- `http://192.168.x.x:8001` (find your IP with `ipconfig` on Windows or `ifconfig` on Mac/Linux)

### Start Frontend
```bash
cd frontend
yarn start
# or
npm start
```

## Step 3: Test the App

### Option A: Using Expo Go (Easiest)
1. Install Expo Go app on your phone
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779
2. Scan the QR code from the terminal
3. App will open in Expo Go

### Option B: Using Android Emulator
```bash
cd frontend
yarn android
```

### Option C: Using iOS Simulator (Mac only)
```bash
cd frontend
yarn ios
```

## Step 4: Build for Android Studio

### Generate Native Android Project
```bash
cd frontend
chmod +x generate-android.sh
./generate-android.sh
```

Or manually:
```bash
npx expo prebuild --platform android --clean
```

### Open in Android Studio
1. Open Android Studio
2. File → Open
3. Select `frontend/android` folder
4. Wait for Gradle sync
5. Click Run button

## Troubleshooting

### Backend: "ModuleNotFoundError"
```bash
pip install -r requirements.txt
```

### Frontend: "Cannot find module"
```bash
cd frontend
rm -rf node_modules
yarn install
```

### Backend: "Connection refused" from mobile app
Update `frontend/.env`:
- Android Emulator: `EXPO_PUBLIC_BACKEND_URL=http://10.0.2.2:8001`
- Physical Device: `EXPO_PUBLIC_BACKEND_URL=http://YOUR_COMPUTER_IP:8001`

### Google Sheets: "API Error"
- Verify API key is correct
- Check Sheet ID is correct
- Ensure sheet is publicly readable or API key has proper permissions

## Verify Installation

1. **Backend Check:**
```bash
curl http://localhost:8001/api/test-data/summary
```
Should return JSON with test statistics.

2. **Frontend Check:**
Open the app and you should see:
- Dashboard with summary cards
- Three tabs: Dashboard | Table | Chart
- Filter button in header
- Data loading from your Google Sheet

## Next Steps

Once everything is working:
1. Test all features (Dashboard, Table, Chart, Filters)
2. Build release APK using Android Studio
3. Deploy to Google Play Store or distribute directly

## Support

If you encounter any issues:
1. Check that backend is running on port 8001
2. Verify environment variables are set correctly
3. Check firewall settings if testing on physical device
4. Review error messages in terminal

---

**All dependencies are now correct and the `emergentintegrations` package has been removed!**
