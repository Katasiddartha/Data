# Test Dashboard - Quick Reference Guide

## 🚀 Quick Start Commands

### Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend
```bash
cd frontend
yarn start
```

### Build for Android Studio
```bash
cd frontend
npx expo prebuild --platform android --clean
# Then open frontend/android in Android Studio
```

---

## 📂 Project Structure

```
app/
├── backend/
│   ├── server.py          # FastAPI server
│   ├── .env              # Config (API keys)
│   └── requirements.txt  # Python deps
├── frontend/
│   ├── app/
│   │   └── index.tsx     # Main app
│   ├── .env             # Frontend config
│   └── package.json     # Node deps
└── Documentation files
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/test-data` | GET | Get all test data |
| `/api/test-data/summary` | GET | Get aggregated stats |
| `/api/test-data/filters` | GET | Get filter options |

**Query Parameters**: `tester`, `module`, `build`, `date_from`, `date_to`

**Example**:
```bash
curl "http://localhost:8001/api/test-data?tester=John Doe"
```

---

## 📊 Chart Types

1. **Pie Chart** - Pass/fail distribution
2. **Bar Chart (Tester)** - Results by tester
3. **Bar Chart (Module)** - Results by module (top 6)
4. **Line Chart** - Trend over time
5. **Module Cards** - Detailed breakdown

---

## 🎨 Color Scheme

- **Blue (#007AFF)** - Total tests
- **Green (#34C759)** - Passed tests
- **Red (#FF3B30)** - Failed tests

---

## 🔍 Filters

### Available Filters
- Date Range (from/to)
- Tester (single selection)
- Module (single selection)
- Build (single selection)

### How to Use
1. Tap filter button in header
2. Select desired filters
3. Tap "Apply"
4. Data updates across all views

---

## 📱 Testing on Devices

### Expo Go (Easiest)
1. Install Expo Go app
2. Scan QR code
3. App opens automatically

### Android Emulator
```bash
yarn android
```

### iOS Simulator (Mac only)
```bash
yarn ios
```

### Physical Device
Update `frontend/.env`:
```env
# Android Emulator
EXPO_PUBLIC_BACKEND_URL=http://10.0.2.2:8001

# Physical Device (use your computer's IP)
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:8001
```

---

## 🛠️ Common Issues & Fixes

### Backend Not Connecting
```bash
# Check if backend is running
curl http://localhost:8001/api/test-data/summary

# Verify frontend .env
cat frontend/.env
```

### Metro Bundler Issues
```bash
cd frontend
yarn start --reset-cache
```

### Google Sheets Error
- Verify API key in `backend/.env`
- Check Sheet ID is correct
- Ensure sheet is publicly readable

### Charts Not Showing
```bash
cd frontend
yarn add expo-linear-gradient
yarn start
```

---

## 📦 Dependencies

### Backend
```txt
fastapi==0.110.1
uvicorn==0.25.0
google-api-python-client
google-auth-httplib2
google-auth-oauthlib
motor==3.3.1
pymongo==4.5.0
```

### Frontend
```json
{
  "expo": "^54.0.33",
  "react-native": "0.81.5",
  "react-native-gifted-charts": "1.4.74",
  "@shopify/flash-list": "2.2.2",
  "expo-linear-gradient": "15.0.8",
  "@react-native-community/datetimepicker": "8.6.0"
}
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
GOOGLE_SHEETS_API_KEY="your-api-key"
GOOGLE_SHEET_ID="your-sheet-id"
```

### Frontend (.env)
```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
```

---

## 📊 Google Sheets Format

Required columns (in order):
```
A: Date (YYYY-MM-DD)
B: Tester (string)
C: Module (string)
D: Test Cases (number)
E: Passed (number)
F: Failed (number)
G: Build (string)
```

---

## 🏗️ Build Commands

### Development Build
```bash
cd frontend
yarn start
```

### Android APK
```bash
cd frontend/android
./gradlew assembleRelease
```

### Using EAS
```bash
eas build --platform android --profile production
```

---

## 📝 Key Files

| File | Purpose |
|------|---------|
| `backend/server.py` | API server |
| `backend/.env` | Backend config |
| `frontend/app/index.tsx` | Main app code |
| `frontend/.env` | Frontend config |
| `frontend/app.json` | Expo config |

---

## 🔄 Auto-Refresh

- **Interval**: 30 seconds
- **Manual**: Pull down to refresh
- **Location**: All views (Dashboard, Table, Charts)

---

## 🎯 Features Checklist

- ✅ Real-time data from Google Sheets
- ✅ 3 main views (Dashboard, Table, Charts)
- ✅ 5 chart types
- ✅ Advanced filtering
- ✅ Auto-refresh (30s)
- ✅ Pull-to-refresh
- ✅ Cross-platform (Android/iOS)
- ✅ Touch-optimized UI
- ✅ Smooth animations

---

## 📚 Documentation Files

- `COMPLETE_DOCUMENTATION.md` - Full documentation
- `README.md` - Project overview
- `ANDROID_BUILD_INSTRUCTIONS.md` - Android Studio guide
- `LOCAL_INSTALLATION_GUIDE.md` - Installation steps
- `CODE_BUNDLE_GUIDE.md` - Code bundle info
- `CHART_UPDATES.md` - Chart details
- `QUICK_REFERENCE.md` - This file

---

## 🆘 Support

**Documentation**: Check COMPLETE_DOCUMENTATION.md

**Troubleshooting**: See troubleshooting section in main docs

**Community**:
- Expo Forums
- Stack Overflow
- React Native Community

---

## 📈 Performance Tips

1. **Optimize refresh interval** - Adjust based on needs
2. **Use filters** - Reduces data processing
3. **Clear cache** - If app feels slow
4. **Update dependencies** - Keep packages current

---

## 🔒 Security Notes

⚠️ **Development Mode**
- CORS allows all origins
- No authentication required
- API key in .env file

✅ **Production Checklist**
- [ ] Add API authentication
- [ ] Restrict CORS
- [ ] Use HTTPS
- [ ] Use service accounts
- [ ] Implement rate limiting

---

## 📱 Screen Views

### Dashboard
- 7 summary cards
- Recent tests list
- Pull-to-refresh

### Table
- Detailed data cards
- All fields visible
- Scrollable list

### Charts
1. Pie chart (pass/fail)
2. Bar chart (testers)
3. Bar chart (modules)
4. Line chart (trend)
5. Module breakdown

---

## 🎨 UI Components

- **Header**: Title + Filter button
- **Tabs**: Dashboard | Table | Chart
- **Cards**: Rounded, shadowed
- **Charts**: Interactive, scrollable
- **Modal**: Bottom sheet style

---

## ⚡ Quick Tips

1. **Backend must run first** before frontend
2. **Use your IP** for physical devices
3. **Clear Metro cache** if issues persist
4. **Check .env files** for correct URLs
5. **Google Sheet** must be publicly readable

---

## 📖 Learn More

- Full docs: `COMPLETE_DOCUMENTATION.md`
- Android build: `ANDROID_BUILD_INSTRUCTIONS.md`
- Installation: `LOCAL_INSTALLATION_GUIDE.md`

---

**Last Updated**: February 2026
**Version**: 1.0.0
