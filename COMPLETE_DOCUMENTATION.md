# Test Dashboard Mobile Application - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation Guide](#installation-guide)
5. [Configuration](#configuration)
6. [User Interface](#user-interface)
7. [Charts & Visualizations](#charts--visualizations)
8. [API Documentation](#api-documentation)
9. [Filters & Search](#filters--search)
10. [Android Studio Setup](#android-studio-setup)
11. [Data Structure](#data-structure)
12. [Troubleshooting](#troubleshooting)
13. [Performance](#performance)
14. [Security](#security)

---

## 📋 Project Overview

### What is This Application?
A professional React Native mobile application that displays software testing data from Google Sheets in real-time with interactive dashboards, tables, and comprehensive charts.

### Purpose
Designed for software testers to monitor and analyze testing data on mobile devices with:
- Live updates from Google Sheets
- Multiple visualization types
- Advanced filtering capabilities
- Cross-platform support (Android & iOS)

### Technology Stack
- **Frontend**: React Native 0.81, Expo 54, TypeScript
- **Backend**: FastAPI (Python 3.11)
- **Database**: MongoDB
- **Data Source**: Google Sheets API
- **Charts**: react-native-gifted-charts
- **State Management**: React Hooks

---

## 🎯 Features

### Core Features
1. **Real-time Data Sync**
   - Auto-refresh every 30 seconds
   - Manual pull-to-refresh
   - Live updates from Google Sheets

2. **Three Main Views**
   - Dashboard with summary cards
   - Detailed table view
   - Comprehensive charts view

3. **Multiple Chart Types**
   - Pie chart (pass/fail distribution)
   - Bar charts (by tester and module)
   - Line chart (trends over time)
   - Module breakdown cards

4. **Advanced Filtering**
   - Filter by date range
   - Filter by tester name
   - Filter by module
   - Filter by build version
   - Combine multiple filters

5. **Mobile-First Design**
   - Touch-optimized interface
   - Smooth animations
   - Responsive layouts
   - Native feel

### Data Capabilities
- Fetch data from Google Sheets
- Aggregate statistics
- Historical trend analysis
- Module-wise performance tracking
- Tester-wise performance tracking

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────┐
│           Mobile Application                │
│   (React Native + Expo)                     │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │Dashboard │ │  Table   │ │  Charts  │   │
│  │   View   │ │   View   │ │   View   │   │
│  └──────────┘ └──────────┘ └──────────┘   │
└─────────────┬───────────────────────────────┘
              │ HTTP/REST API
              │
┌─────────────▼───────────────────────────────┐
│         FastAPI Backend                     │
│   (Python 3.11)                             │
│                                             │
│  ┌────────────────┐  ┌──────────────────┐  │
│  │  API Routes    │  │  Data Processing │  │
│  │  /api/*        │  │  & Aggregation   │  │
│  └────────────────┘  └──────────────────┘  │
└─────────────┬───────────────────────────────┘
              │
         ┌────┴────┐
         │         │
         ▼         ▼
┌────────────┐ ┌──────────────┐
│  Google    │ │   MongoDB    │
│  Sheets    │ │   Database   │
│    API     │ │              │
└────────────┘ └──────────────┘
```

### Component Structure

```
Frontend Architecture:
├── App Component (index.tsx)
│   ├── State Management (React Hooks)
│   ├── Data Fetching (useEffect)
│   ├── Auto-refresh Logic
│   │
│   ├── Header
│   │   ├── Title
│   │   └── Filter Button
│   │
│   ├── Tab Navigation
│   │   ├── Dashboard Tab
│   │   ├── Table Tab
│   │   └── Chart Tab
│   │
│   ├── Dashboard View
│   │   ├── Summary Cards (7 cards)
│   │   └── Recent Tests List
│   │
│   ├── Table View
│   │   └── Scrollable Data Cards
│   │
│   ├── Chart View
│   │   ├── Pie Chart
│   │   ├── Tester Bar Chart
│   │   ├── Module Bar Chart
│   │   ├── Trend Line Chart
│   │   └── Module Breakdown
│   │
│   └── Filter Modal
│       ├── Date Range Picker
│       ├── Tester Filter
│       ├── Module Filter
│       └── Build Filter
```

### Backend Structure

```
Backend (server.py):
├── FastAPI Application
├── MongoDB Connection
├── Google Sheets Integration
│
├── API Routes
│   ├── GET /api/test-data
│   ├── GET /api/test-data/summary
│   └── GET /api/test-data/filters
│
├── Data Models (Pydantic)
│   ├── TestData
│   ├── TestDataSummary
│   └── FilterOptions
│
└── Helper Functions
    ├── fetch_google_sheets_data()
    └── Data aggregation logic
```

---

## 📥 Installation Guide

### Prerequisites

#### System Requirements
- **Node.js**: v18 or higher
- **Python**: 3.11 or higher
- **MongoDB**: Latest version (optional)
- **Android Studio**: Latest version (for Android builds)
- **Xcode**: Latest version (for iOS builds, Mac only)

#### Required Tools
```bash
# Install Expo CLI
npm install -g expo-cli

# Install EAS CLI (for building)
npm install -g eas-cli
```

### Step 1: Backend Setup

#### Install Python Dependencies
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Backend Environment
Create/edit `backend/.env`:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
GOOGLE_SHEETS_API_KEY="AIzaSyA5GcXx2x7X9SCzViqP9eLU9H_KKDUiyoQ"
GOOGLE_SHEET_ID="1QE8PLx0zJ-dHjVkeI-0-CKblCUxhs_7d9dKdQ9fVVwg"
```

#### Start Backend Server
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Verify Backend**: Visit http://localhost:8001/api/test-data/summary

### Step 2: Frontend Setup

#### Install Node Dependencies
```bash
cd frontend
yarn install
# or
npm install

# Install additional required package
yarn add expo-linear-gradient
```

#### Configure Frontend Environment
Create/edit `frontend/.env`:
```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
```

**Important Network Configuration**:
- **Android Emulator**: Use `http://10.0.2.2:8001`
- **Physical Device**: Use your computer's IP (e.g., `http://192.168.1.100:8001`)
- **iOS Simulator**: Use `http://localhost:8001`

To find your IP:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
# or
ip addr show
```

#### Start Frontend
```bash
cd frontend
yarn start
# or
npm start
```

### Step 3: Testing the App

#### Option A: Expo Go (Easiest)
1. Install Expo Go on your mobile device:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779
2. Scan the QR code from terminal
3. App opens in Expo Go

#### Option B: Android Emulator
```bash
cd frontend
yarn android
```

#### Option C: iOS Simulator (Mac only)
```bash
cd frontend
yarn ios
```

---

## ⚙️ Configuration

### Google Sheets API Setup

#### 1. Get API Key
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable "Google Sheets API"
4. Create credentials (API Key)
5. Copy the API key

#### 2. Sheet Configuration
Your Google Sheet must have these columns (in order):
```
A: Date
B: Tester
C: Module
D: Test Cases
E: Passed
F: Failed
G: Build
```

#### 3. Sheet Permissions
- Make sheet publicly readable, OR
- Give API key access to the sheet

#### 4. Get Sheet ID
From your sheet URL:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
                                      ^^^^^^^^^^^^^^^^
```

### Backend Configuration

#### Environment Variables
```env
# MongoDB Configuration
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"

# Google Sheets Configuration
GOOGLE_SHEETS_API_KEY="your-api-key-here"
GOOGLE_SHEET_ID="your-sheet-id-here"
```

#### CORS Settings
Backend is configured to allow all origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, restrict to specific origins.

### Frontend Configuration

#### Environment Variables
```env
EXPO_PUBLIC_BACKEND_URL=http://your-backend-url:8001
```

#### App Configuration (app.json)
```json
{
  "expo": {
    "name": "Test Dashboard",
    "slug": "test-dashboard",
    "version": "1.0.0",
    "orientation": "portrait",
    "android": {
      "package": "com.testdashboard.app",
      "permissions": []
    },
    "ios": {
      "bundleIdentifier": "com.testdashboard.app"
    }
  }
}
```

---

## 🎨 User Interface

### Navigation Structure

#### Tab-Based Navigation
```
┌────────────────────────────────────┐
│  Test Dashboard         [Filter]   │  ← Header
├────────────────────────────────────┤
│ [Dashboard] [Table] [Chart]        │  ← Tabs
├────────────────────────────────────┤
│                                    │
│         Active View Content        │
│                                    │
│                                    │
└────────────────────────────────────┘
```

### Dashboard View

#### Summary Cards Layout
```
┌─────────────┐ ┌─────────────┐
│   Total     │ │   Passed    │
│   Tests     │ │   Tests     │
│   [Icon]    │ │   [Icon]    │
│    736      │ │    694      │
└─────────────┘ └─────────────┘

┌─────────────┐ ┌─────────────┐
│   Failed    │ │  Pass Rate  │
│   Tests     │ │             │
│   [Icon]    │ │   [Icon]    │
│    42       │ │   94.29%    │
└─────────────┘ └─────────────┘

┌─────────────┐ ┌─────────────┐
│   Testers   │ │   Modules   │
│             │ │             │
│   [Icon]    │ │   [Icon]    │
│     4       │ │    23       │
└─────────────┘ └─────────────┘

┌───────────────────────────────┐
│          Builds               │
│          [Icon]               │
│            11                 │
└───────────────────────────────┘
```

#### Recent Tests Section
```
Recent Tests
┌─────────────────────────────────┐
│ Module: Login        Build: v1.0│
│ 👤 John Doe   📅 2024-02-01     │
│ Total: 25  ✓ 23  ✗ 2           │
└─────────────────────────────────┘
(Shows 5 most recent tests)
```

### Table View

#### Data Card Layout
```
┌─────────────────────────────────┐
│ Date: 2024-02-01                │
│ Tester: John Doe                │
│ Module: Login                   │
│ Build: v1.0.0                   │
│ ────────────────────            │
│ Tests: 25  Passed: 23  Failed: 2│
└─────────────────────────────────┘
(Scrollable list of all records)
```

### Chart View

#### Layout Flow
```
1. Pie Chart (Pass/Fail Distribution)
   ┌─────────────────────┐
   │    [Donut Chart]    │
   │    94.29% center    │
   │  Legend: ■ Pass ■ Fail│
   └─────────────────────┘

2. Bar Chart (By Tester)
   ┌─────────────────────┐
   │ [Horizontal Scroll] │
   │  |||  |||  |||  ||| │
   │ John Jane Mike Sarah│
   └─────────────────────┘

3. Bar Chart (By Module)
   ┌─────────────────────┐
   │ [Horizontal Scroll] │
   │  |||  |||  |||  ||| │
   │ Mod1 Mod2 Mod3 Mod4 │
   └─────────────────────┘

4. Line Chart (Trend)
   ┌─────────────────────┐
   │      /\   /\        │
   │    /    \/   \      │
   │  /            \     │
   └─────────────────────┘

5. Module Breakdown
   ┌─────────────────────┐
   │ Login Module        │
   │ Total: 50 ✓45 ✗5   │
   │ [████████░] 90%     │
   └─────────────────────┘
```

### Filter Modal

#### Filter Interface
```
┌─────────────────────────────────┐
│ Filters                    [X]  │
├─────────────────────────────────┤
│                                 │
│ Date Range                      │
│ [From Date] [To Date]           │
│                                 │
│ Tester                          │
│ [All] [John] [Jane] [Mike]...   │
│                                 │
│ Module                          │
│ [All] [Login] [Payment]...      │
│                                 │
│ Build                           │
│ [All] [v1.0.0] [v1.0.1]...     │
│                                 │
├─────────────────────────────────┤
│ [Clear All]        [Apply]      │
└─────────────────────────────────┘
```

---

## 📊 Charts & Visualizations

### 1. Pie Chart - Pass/Fail Distribution

#### Description
Donut chart showing overall pass/fail ratio with pass rate in center.

#### Data Display
```javascript
{
  Passed: 694 tests (Green segment)
  Failed: 42 tests (Red segment)
  Center: 94.29% pass rate
}
```

#### Features
- Donut style with hollow center
- Pass rate percentage prominently displayed
- Color-coded segments
- Legend with exact counts
- Updates in real-time

#### Use Case
Quick visual assessment of overall testing quality.

### 2. Bar Chart - Test Results by Tester

#### Description
Grouped bar chart showing total, passed, and failed tests for each tester.

#### Data Display
```
Tester      Total   Passed  Failed
John Doe    [███]   [███]   [█]
Jane Smith  [███]   [███]   [█]
Mike J.     [███]   [███]   [█]
Sarah W.    [███]   [███]   [█]
```

#### Features
- 3 bars per tester (Total, Passed, Failed)
- Color coding: Blue (Total), Green (Passed), Red (Failed)
- Horizontally scrollable
- Shows first names for space efficiency
- Animated bars on load

#### Use Case
Compare individual tester performance and identify top performers.

### 3. Bar Chart - Test Results by Module

#### Description
Grouped bar chart showing top 6 modules by test volume.

#### Data Display
```
Module      Total   Passed  Failed
Login       [███]   [███]   [█]
Payment     [███]   [███]   [█]
Dashboard   [███]   [███]   [█]
Settings    [███]   [███]   [█]
Profile     [███]   [███]   [█]
Reports     [███]   [███]   [█]
```

#### Features
- Shows top 6 modules only
- Same color scheme as tester chart
- Horizontally scrollable
- Module names truncated if too long
- Sorted by total test volume

#### Use Case
Identify which modules receive most testing attention and their quality.

### 4. Line Chart - Trend Over Time

#### Description
Area line chart showing daily test case progression.

#### Data Display
```
Test Cases
    ^
 50 |      ╱╲    ╱╲
 40 |    ╱    ╲╱  ╲
 30 |  ╱          ╲
 20 |╱              
    └────────────────> Date
    02-01  02-05  02-10
```

#### Features
- Smooth curved line
- Area fill with gradient
- Date labels (MM-DD format)
- Data point markers
- Y-axis scale auto-adjusts

#### Use Case
Track testing volume trends and identify patterns over time.

### 5. Module Breakdown Cards

#### Description
Detailed statistics for all modules with progress bars.

#### Card Layout
```
┌────────────────────────────────┐
│ Login Module                    │
│ Total: 75  ✓ 70  ✗ 5  90.0%   │
│ [████████████████░░] 90%       │
└────────────────────────────────┘
```

#### Features
- Shows ALL modules (not just top 6)
- Pass rate percentage
- Visual progress bar
- Color-coded statistics
- Scrollable list

#### Use Case
Detailed analysis of each module's testing performance.

### Chart Interactions

#### Real-time Updates
- All charts auto-refresh every 30 seconds
- Manual refresh via pull-to-refresh gesture
- Smooth transitions on data updates

#### Filter Integration
- All charts respect active filters
- Instant updates when filters change
- Visual feedback during loading

#### Touch Interactions
- Tap to view (where applicable)
- Horizontal scroll for bar charts
- Vertical scroll for full page
- Pinch to zoom (not enabled to maintain consistency)

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8001/api
```

### Authentication
No authentication required (configure for production use).

### Endpoints

#### 1. GET /api/test-data

**Description**: Fetch test data from Google Sheets with optional filters.

**URL**: `/api/test-data`

**Method**: `GET`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| tester | string | No | Filter by tester name |
| module | string | No | Filter by module name |
| build | string | No | Filter by build version |
| date_from | string | No | Filter from date (YYYY-MM-DD) |
| date_to | string | No | Filter to date (YYYY-MM-DD) |

**Request Examples**:
```bash
# Get all data
GET /api/test-data

# Filter by tester
GET /api/test-data?tester=John Doe

# Filter by module
GET /api/test-data?module=Login

# Filter by date range
GET /api/test-data?date_from=2024-02-01&date_to=2024-02-10

# Combine filters
GET /api/test-data?tester=John Doe&module=Login&build=v1.0.0
```

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
  },
  {
    "date": "2024-02-01",
    "tester": "Jane Smith",
    "module": "Payment",
    "test_cases": 30,
    "passed": 28,
    "failed": 2,
    "build": "v1.0.0"
  }
]
```

**Status Codes**:
- `200 OK`: Success
- `500 Internal Server Error`: Google Sheets API error

---

#### 2. GET /api/test-data/summary

**Description**: Get aggregated test statistics.

**URL**: `/api/test-data/summary`

**Method**: `GET`

**Query Parameters**: Same as `/api/test-data`

**Request Examples**:
```bash
# Get overall summary
GET /api/test-data/summary

# Get summary for specific tester
GET /api/test-data/summary?tester=John Doe

# Get summary for date range
GET /api/test-data/summary?date_from=2024-02-01&date_to=2024-02-10
```

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

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| total_tests | integer | Total number of test cases |
| total_passed | integer | Total passed test cases |
| total_failed | integer | Total failed test cases |
| pass_rate | float | Pass rate percentage (0-100) |
| total_testers | integer | Number of unique testers |
| total_modules | integer | Number of unique modules |
| total_builds | integer | Number of unique builds |

**Status Codes**:
- `200 OK`: Success
- `500 Internal Server Error`: Server error

---

#### 3. GET /api/test-data/filters

**Description**: Get available filter options (testers, modules, builds).

**URL**: `/api/test-data/filters`

**Method**: `GET`

**Query Parameters**: None

**Request**:
```bash
GET /api/test-data/filters
```

**Response**:
```json
{
  "testers": [
    "Jane Smith",
    "John Doe",
    "Mike Johnson",
    "Sarah Williams"
  ],
  "modules": [
    "API Integration",
    "Accessibility",
    "Analytics",
    "Charts",
    "Dashboard",
    "Database",
    "Email",
    "Export",
    "Filter",
    "Import",
    "Login",
    "Mobile View",
    "Notifications",
    "Payment",
    "Performance",
    "Profile",
    "Registration",
    "Reports",
    "Responsive",
    "Search",
    "Security",
    "Settings",
    "Validation"
  ],
  "builds": [
    "v1.0.0",
    "v1.0.1",
    "v1.0.2",
    "v1.0.3",
    "v1.0.4",
    "v1.0.5",
    "v1.0.6",
    "v1.0.7",
    "v1.0.8",
    "v1.0.9",
    "v1.1.0"
  ]
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| testers | array | Sorted list of unique tester names |
| modules | array | Sorted list of unique module names |
| builds | array | Sorted list of unique build versions |

**Status Codes**:
- `200 OK`: Success
- `500 Internal Server Error`: Server error

---

### Error Handling

#### Error Response Format
```json
{
  "detail": "Error message description"
}
```

#### Common Errors
- **404 Not Found**: Invalid endpoint
- **500 Internal Server Error**: Google Sheets API error, server error
- **422 Unprocessable Entity**: Invalid query parameters

---

## 🔍 Filters & Search

### Filter Types

#### 1. Date Range Filter
**Type**: Date picker
**Input**: Two date fields (From and To)
**Format**: YYYY-MM-DD
**Behavior**: Inclusive range

**Example**:
```
From: 2024-02-01
To: 2024-02-10
Result: Shows all tests from Feb 1 to Feb 10 (inclusive)
```

#### 2. Tester Filter
**Type**: Chip selection
**Options**: All available testers
**Behavior**: Single selection, "All" to clear

**Example**:
```
Options: [All] [John Doe] [Jane Smith] [Mike Johnson] [Sarah Williams]
Selection: John Doe
Result: Shows only John Doe's tests
```

#### 3. Module Filter
**Type**: Chip selection
**Options**: All available modules
**Behavior**: Single selection, "All" to clear

**Example**:
```
Options: [All] [Login] [Payment] [Dashboard] ...
Selection: Login
Result: Shows only Login module tests
```

#### 4. Build Filter
**Type**: Chip selection
**Options**: All available build versions
**Behavior**: Single selection, "All" to clear

**Example**:
```
Options: [All] [v1.0.0] [v1.0.1] [v1.0.2] ...
Selection: v1.0.0
Result: Shows only v1.0.0 build tests
```

### Filter Combinations

Filters can be combined for precise data selection:

**Example Combinations**:
```
1. Tester + Date Range
   John Doe + Feb 1-10
   = John's tests from Feb 1-10

2. Module + Build
   Login + v1.0.0
   = Login module tests in v1.0.0

3. All Filters
   John Doe + Login + v1.0.0 + Feb 1-10
   = John's Login tests in v1.0.0 from Feb 1-10
```

### Filter Application

#### How Filters Work
1. User opens filter modal
2. Selects desired filters
3. Taps "Apply"
4. API call with query parameters
5. Data refreshes across all views
6. Filter badge appears on filter button

#### Clear Filters
- "Clear All" button in filter modal
- Resets all filters to default
- Refreshes data immediately

### Visual Indicators

**Active Filters**:
- Red badge dot on filter button
- Active chips highlighted in blue
- Selected date ranges displayed

**No Filters**:
- No badge on filter button
- All chips show "All" selected
- No date range selected

---

## 📱 Android Studio Setup

### Generate Android Project

#### Method 1: Using Script
```bash
cd frontend
./generate-android.sh
```

#### Method 2: Manual Command
```bash
cd frontend
npx expo prebuild --platform android --clean
```

This creates a native Android project in `frontend/android/`.

### Open in Android Studio

1. **Launch Android Studio**
2. **Open Project**:
   - File → Open
   - Navigate to `frontend/android`
   - Click "OK"
3. **Wait for Gradle Sync**:
   - Android Studio will sync automatically
   - Wait for "Sync successful" message
4. **Select Device**:
   - Choose emulator or connected device from dropdown
5. **Run**:
   - Click green play button
   - Or press `Shift + F10`

### Build APK

#### Debug APK
```bash
cd frontend/android
./gradlew assembleDebug
# Output: frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

#### Release APK
1. **Generate Keystore** (first time only):
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Gradle**:
Edit `frontend/android/gradle.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=****
MYAPP_RELEASE_KEY_PASSWORD=****
```

3. **Build Release**:
```bash
cd frontend/android
./gradlew assembleRelease
# Output: frontend/android/app/build/outputs/apk/release/app-release.apk
```

### Build AAB (Android App Bundle)

#### For Google Play Store
```bash
cd frontend/android
./gradlew bundleRelease
# Output: frontend/android/app/build/outputs/bundle/release/app-release.aab
```

### Using EAS Build (Recommended)

#### Setup
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure
```

#### Build
```bash
# Development build
eas build --platform android --profile development

# Preview build
eas build --platform android --profile preview

# Production build
eas build --platform android --profile production
```

### Troubleshooting Android Studio

#### Gradle Sync Failed
```bash
cd frontend/android
./gradlew clean
cd ..
yarn android
```

#### Module Not Found
```bash
cd frontend
rm -rf node_modules
yarn install
npx expo prebuild --platform android --clean
```

#### Java Version Issues
Check Java version:
```bash
java -version
# Should be Java 11 or higher
```

Set JAVA_HOME if needed:
```bash
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-11

# Mac/Linux
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
```

---

## 📊 Data Structure

### Google Sheets Format

#### Required Columns (Order Matters)
| Column | Header | Type | Description | Example |
|--------|--------|------|-------------|---------|
| A | Date | String | Test date | 2024-02-01 |
| B | Tester | String | Tester name | John Doe |
| C | Module | String | Module name | Login |
| D | Test Cases | Number | Total test cases | 25 |
| E | Passed | Number | Passed test cases | 23 |
| F | Failed | Number | Failed test cases | 2 |
| G | Build | String | Build version | v1.0.0 |

#### Sample Data
```
| Date       | Tester     | Module   | Test Cases | Passed | Failed | Build   |
|------------|------------|----------|------------|--------|--------|---------|
| 2024-02-01 | John Doe   | Login    | 25         | 23     | 2      | v1.0.0  |
| 2024-02-01 | Jane Smith | Payment  | 30         | 28     | 2      | v1.0.0  |
| 2024-02-02 | John Doe   | Register | 15         | 15     | 0      | v1.0.1  |
```

### Data Validation Rules

#### Date
- Format: YYYY-MM-DD
- Must be valid date
- Used for trend analysis

#### Tester
- String (any characters)
- Case-sensitive for filtering
- Used for tester performance tracking

#### Module
- String (any characters)
- Used for module analysis
- Appears in charts and filters

#### Test Cases, Passed, Failed
- Must be numbers
- Non-negative integers
- Test Cases should equal Passed + Failed

#### Build
- String (any format)
- Typically version format (v1.0.0)
- Used for build comparison

### Data Flow

```
1. Tester updates Google Sheets
   ↓
2. Backend fetches data via Google Sheets API
   ↓
3. Backend processes and aggregates data
   ↓
4. Frontend requests data via REST API
   ↓
5. Frontend displays in Dashboard/Table/Charts
   ↓
6. Auto-refresh every 30 seconds (loop back to step 2)
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Backend Not Connecting

**Symptom**: Frontend shows "Loading..." indefinitely

**Possible Causes**:
- Backend not running
- Wrong backend URL in frontend .env
- Firewall blocking port 8001

**Solutions**:
```bash
# Check if backend is running
curl http://localhost:8001/api/test-data/summary

# Verify .env file
cat frontend/.env
# Should show: EXPO_PUBLIC_BACKEND_URL=http://localhost:8001

# Check firewall (Windows)
netsh advfirewall firewall show rule name=all | findstr 8001

# Start backend if not running
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

#### 2. Google Sheets Error

**Symptom**: Backend returns 500 error with Google API message

**Possible Causes**:
- Invalid API key
- Wrong Sheet ID
- Sheet not accessible

**Solutions**:
```bash
# Verify API key in backend/.env
cat backend/.env | grep GOOGLE_SHEETS_API_KEY

# Test API key manually
curl "https://sheets.googleapis.com/v4/spreadsheets/SHEET_ID/values/A:G?key=API_KEY"

# Check sheet permissions
# 1. Open Google Sheet
# 2. Click "Share"
# 3. Make sure "Anyone with link can view" is enabled
```

#### 3. Metro Bundler Issues

**Symptom**: Expo shows bundling errors or stuck at loading

**Solutions**:
```bash
# Clear Metro cache
cd frontend
yarn start --reset-cache

# Clear watchman cache (Mac/Linux)
watchman watch-del-all

# Reinstall node_modules
rm -rf node_modules
yarn install

# Clear yarn cache
yarn cache clean
```

#### 4. Android Emulator Connection

**Symptom**: App shows "Network Error" on Android emulator

**Solution**:
```env
# Update frontend/.env to use Android emulator network address
EXPO_PUBLIC_BACKEND_URL=http://10.0.2.2:8001
```

#### 5. Physical Device Connection

**Symptom**: App shows "Network Error" on physical device

**Solution**:
```bash
# Find your computer's IP
# Windows:
ipconfig
# Look for "IPv4 Address"

# Mac:
ifconfig
# Look for "inet" under active network

# Update frontend/.env
EXPO_PUBLIC_BACKEND_URL=http://YOUR_COMPUTER_IP:8001
# Example: EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:8001

# Make sure device is on same WiFi network
```

#### 6. Charts Not Displaying

**Symptom**: Chart tab shows blank or "No data"

**Possible Causes**:
- Missing expo-linear-gradient package
- Data not loaded
- API error

**Solutions**:
```bash
# Install missing dependency
cd frontend
yarn add expo-linear-gradient

# Restart Expo
yarn start

# Check console for errors
# In Expo Go app, shake device → Show Dev Menu → Debug Remote JS
```

#### 7. Filter Not Working

**Symptom**: Filters don't change displayed data

**Solutions**:
```bash
# Check browser/app console for errors
# Verify API is receiving filters:
curl "http://localhost:8001/api/test-data?tester=John%20Doe"

# Clear app data and restart (Expo Go)
# Settings → Apps → Expo Go → Clear Data
```

#### 8. MongoDB Connection Error

**Symptom**: Backend crashes with MongoDB connection error

**Note**: MongoDB is optional for this app (used only for demo routes)

**Solutions**:
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Or comment out MongoDB routes in server.py if not needed
```

### Debugging Tips

#### Enable Debug Mode
```bash
# Frontend
cd frontend
EXPO_DEBUG=true yarn start

# Backend
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload --log-level debug
```

#### Check Logs
```bash
# Frontend (Expo)
# Logs appear in terminal where you ran "yarn start"

# Backend
# Logs appear in terminal where you ran uvicorn

# Android Logcat
adb logcat | grep -i "react"
```

#### Network Inspection
```javascript
// Add to frontend code temporarily
fetch(url)
  .then(res => {
    console.log('Response:', res.status);
    return res.json();
  })
  .then(data => console.log('Data:', data))
  .catch(err => console.error('Error:', err));
```

---

## ⚡ Performance

### Optimization Strategies

#### 1. Auto-Refresh Timing
- Default: 30 seconds
- Adjustable in code: `setInterval(fetchData, 30000)`
- Balance between freshness and API calls

#### 2. Data Caching
- React state holds fetched data
- Reduces unnecessary API calls
- Refreshes only on interval or pull-to-refresh

#### 3. Efficient Rendering
- Uses React hooks for optimal re-renders
- List virtualization with FlashList (optional)
- Memoization for computed values

#### 4. Network Efficiency
- Parallel API calls for initial load
- Query parameters reduce data transfer
- GZIP compression on backend responses

#### 5. Chart Performance
- Top 6 modules in bar chart (not all 23)
- Data aggregation on backend
- Smooth animations with hardware acceleration

### Performance Metrics

**Target Performance**:
- Initial load: < 3 seconds
- Filter application: < 1 second
- Chart rendering: < 500ms
- Auto-refresh: < 2 seconds

**Optimization Recommendations**:
```javascript
// Debounce filter changes
const debouncedFilter = debounce(applyFilters, 300);

// Lazy load charts
const ChartView = lazy(() => import('./ChartView'));

// Optimize images (if any)
<Image resizeMode="contain" />
```

---

## 🔒 Security

### Current Implementation

**Note**: Current configuration is for development. Implement these for production:

#### 1. API Security

**Add Authentication**:
```python
# Example: JWT authentication
from fastapi.security import HTTPBearer

security = HTTPBearer()

@api_router.get("/test-data")
async def get_data(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Verify token
    ...
```

**Rate Limiting**:
```python
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.get("/api/test-data")
@limiter.limit("100/minute")
async def get_data():
    ...
```

#### 2. CORS Configuration

**Production Settings**:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-production-domain.com"
    ],  # Restrict to specific domains
    allow_credentials=True,
    allow_methods=["GET"],  # Only allow necessary methods
    allow_headers=["*"],
)
```

#### 3. Environment Variables

**Never Commit**:
- API keys
- Sheet IDs (if sensitive)
- Database credentials

**Use**:
- `.gitignore` to exclude `.env` files
- Environment variable managers
- Secret management tools

#### 4. Google Sheets Access

**Best Practices**:
- Use service accounts (not API keys)
- Restrict Sheet to read-only
- Monitor API usage
- Set up alerts for unusual activity

#### 5. Input Validation

Already implemented:
- Pydantic models validate input
- Query parameter sanitization
- Error handling for invalid data

#### 6. HTTPS

**Production Requirement**:
```bash
# Use HTTPS for all production APIs
EXPO_PUBLIC_BACKEND_URL=https://api.yourdomain.com
```

### Security Checklist

Before production deployment:
- [ ] Add authentication to API
- [ ] Implement rate limiting
- [ ] Restrict CORS to specific domains
- [ ] Use service accounts for Google Sheets
- [ ] Enable HTTPS
- [ ] Remove debug/logging statements
- [ ] Implement error logging service
- [ ] Set up monitoring and alerts
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## 📚 Additional Resources

### Documentation Links
- [React Native Documentation](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [MongoDB Documentation](https://docs.mongodb.com)

### Community Support
- [Expo Forums](https://forums.expo.dev)
- [React Native Community](https://www.reactnative.dev/community/overview)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

### Tools Used
- **VS Code**: Code editor
- **Postman**: API testing
- **Android Studio**: Android development
- **Xcode**: iOS development
- **Git**: Version control

---

## 📝 License

MIT License - Free to use for any purpose.

---

## 🆘 Support

For issues or questions:
1. Check this documentation
2. Review troubleshooting section
3. Check error logs
4. Search community forums
5. Open GitHub issue

---

## 🔄 Version History

### Version 1.0.0 (Current)
- Initial release
- Dashboard, Table, and Chart views
- Multiple chart types (Pie, Bar, Line)
- Advanced filtering
- Real-time updates
- Google Sheets integration
- Android/iOS support

---

**Built with ❤️ using React Native, Expo, and FastAPI**

*Last Updated: February 2026*
