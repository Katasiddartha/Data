# Test Dashboard Mobile Application

A professional React Native mobile application that displays testing data from Google Sheets with real-time updates, interactive charts, and comprehensive filtering capabilities.

## 📱 Features

### Dashboard View
- **Summary Cards**: Visual metrics showing:
  - Total test cases
  - Passed tests with percentage
  - Failed tests count
  - Pass rate percentage
  - Active testers count
  - Modules tested
  - Build versions
- **Recent Tests**: Quick view of latest 5 test results

### Table View
- Detailed list of all test results
- Shows: Date, Tester, Module, Build, Test Cases, Passed, Failed
- Scrollable list with card-based layout
- Clean and easy-to-read format

### Chart View
- **Line Graph**: Test cases trend over time
- **Module Breakdown**: Performance by module with progress bars
- Visual representation of pass/fail rates

### Filters
- **Date Range**: Filter by start and end dates
- **Tester**: Filter by specific tester name
- **Module**: Filter by module name
- **Build**: Filter by build version
- **Clear All**: Reset all filters instantly

### Real-time Updates
- Auto-refresh every 30 seconds
- Pull-to-refresh gesture support
- Live data from Google Sheets

## 🏗️ Architecture

### Backend (FastAPI + Python)
- **Google Sheets API Integration**: Fetches real-time data
- **RESTful API Endpoints**:
  - `GET /api/test-data` - Fetch test data with filters
  - `GET /api/test-data/summary` - Aggregated statistics
  - `GET /api/test-data/filters` - Available filter options
- **Filter Support**: Query parameters for all filters
- **Error Handling**: Robust error management

### Frontend (React Native + Expo)
- **Expo Router**: File-based routing
- **React Hooks**: Modern state management
- **TypeScript**: Type-safe development
- **Native Components**: Platform-optimized UI
- **Gesture Handler**: Smooth interactions

### Libraries Used
- `react-native-gifted-charts`: Beautiful charts
- `@react-native-community/datetimepicker`: Date selection
- `@shopify/flash-list`: High-performance lists
- `@expo/vector-icons`: Icon library
- `react-native-modal`: Modal dialogs

## 📊 Data Structure

Google Sheets columns:
| Column | Type | Description |
|--------|------|-------------|
| Date | String | Test date (YYYY-MM-DD) |
| Tester | String | Name of tester |
| Module | String | Module being tested |
| Test Cases | Number | Total test cases |
| Passed | Number | Passed test cases |
| Failed | Number | Failed test cases |
| Build | String | Build version |

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Python 3.11+
- MongoDB (for backend storage)
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone and setup backend**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure environment variables**:
Edit `backend/.env`:
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
GOOGLE_SHEETS_API_KEY="your-api-key"
GOOGLE_SHEET_ID="your-sheet-id"
```

3. **Install frontend dependencies**:
```bash
cd frontend
yarn install
```

4. **Start backend**:
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

5. **Start frontend**:
```bash
cd frontend
yarn start
```

## 📱 Running on Devices

### Testing with Expo Go
1. Install Expo Go app from:
   - [Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)
2. Run `yarn start` in frontend directory
3. Scan QR code with Expo Go app

### Android Development
```bash
cd frontend
yarn android
```

### iOS Development (Mac only)
```bash
cd frontend
yarn ios
```

## 🔧 Building for Production

### Generate Android Project for Android Studio
```bash
cd frontend
./generate-android.sh
```

This creates a native Android project in the `android/` folder that can be opened in Android Studio.

### Build APK/AAB
1. Open `frontend/android` in Android Studio
2. Build → Generate Signed Bundle / APK
3. Follow the wizard to create release build

For detailed instructions, see [ANDROID_BUILD_INSTRUCTIONS.md](ANDROID_BUILD_INSTRUCTIONS.md)

## 🎨 UI/UX Highlights

- **Native Feel**: Platform-specific components and interactions
- **Smooth Animations**: Fluid transitions between views
- **Touch-Optimized**: Large, accessible touch targets (44x44pt minimum)
- **Dark Mode Ready**: Automatic theme adaptation
- **Responsive**: Works on all screen sizes
- **Gesture Support**: Swipe, pull-to-refresh, and more

## 📡 API Endpoints

### GET /api/test-data
Fetch test data with optional filters.

**Query Parameters**:
- `tester`: Filter by tester name
- `module`: Filter by module name
- `build`: Filter by build version
- `date_from`: Filter from date (YYYY-MM-DD)
- `date_to`: Filter to date (YYYY-MM-DD)

**Response**:
```json
[
  {
    "date": "2024-02-01",
    "tester": "John Doe",
    "module": "Login",
    "test_cases": 25,
    "passed": 23,
    "failed": 2,
    "build": "v1.0.0"
  }
]
```

### GET /api/test-data/summary
Get aggregated statistics.

**Response**:
```json
{
  "total_tests": 736,
  "total_passed": 694,
  "total_failed": 42,
  "pass_rate": 94.29,
  "total_testers": 4,
  "total_modules": 23,
  "total_builds": 11
}
```

### GET /api/test-data/filters
Get available filter options.

**Response**:
```json
{
  "testers": ["John Doe", "Jane Smith"],
  "modules": ["Login", "Payment", "Dashboard"],
  "builds": ["v1.0.0", "v1.0.1", "v1.0.2"]
}
```

## 🧪 Testing

Backend tests:
```bash
cd backend
pytest
```

Frontend lint:
```bash
cd frontend
yarn lint
```

## 📂 Project Structure

```
app/
├── backend/
│   ├── server.py           # FastAPI server with Google Sheets integration
│   ├── .env               # Environment variables
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── app/
│   │   └── index.tsx      # Main app screen
│   ├── assets/            # Images and icons
│   ├── .env              # Frontend environment variables
│   ├── package.json      # Node dependencies
│   ├── app.json          # Expo configuration
│   └── generate-android.sh # Android build script
├── ANDROID_BUILD_INSTRUCTIONS.md
└── README.md
```

## 🔐 Security Notes

- API keys are stored in `.env` files (not committed to git)
- Backend uses CORS middleware for secure API access
- Production builds should use HTTPS
- Google Sheets API key should have restricted permissions

## 🐛 Troubleshooting

### Backend not connecting
- Verify Google Sheets API key is valid
- Check Sheet ID is correct
- Ensure sheet is publicly readable or API key has access

### Frontend not loading data
- Verify `EXPO_PUBLIC_BACKEND_URL` in `frontend/.env`
- Check backend is running on correct port
- Inspect network requests in Expo DevTools

### Metro bundler issues
```bash
cd frontend
yarn start --reset-cache
```

## 📈 Performance

- Auto-refresh: 30-second intervals
- Data caching: Reduces API calls
- FlashList: Optimized for large datasets
- Lazy loading: Charts render on-demand

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- Google Sheets API for data integration
- Expo team for amazing mobile development framework
- React Native community for excellent libraries

## 📞 Support

For issues or questions:
1. Check [ANDROID_BUILD_INSTRUCTIONS.md](ANDROID_BUILD_INSTRUCTIONS.md)
2. Review [Expo Documentation](https://docs.expo.dev)
3. Open an issue on GitHub

---

**Built with ❤️ using React Native & Expo**
