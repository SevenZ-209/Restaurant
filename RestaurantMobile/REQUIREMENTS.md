# Restaurant Mobile App - Requirements & Setup

## Project Overview
A modern, cross-platform restaurant mobile application built with React Native, Expo, Redux, and React Navigation.

## System Requirements

### Development Environment
- **Node.js**: v16+ (LTS recommended)
- **npm**: v8+
- **Python**: v3.7+ (for some native modules)
- **Git**: Latest version

### Platform Requirements
- **Android**: Android SDK 25+ (for Android simulator/device)
- **iOS**: Xcode 14+ (for iOS simulator/device)
- **Web**: Modern browser (Chrome, Firefox, Safari, Edge)

## Installation Prerequisites

### 1. Node.js & npm
```bash
# Check versions
node --version
npm --version

# If not installed: https://nodejs.org/
```

### 2. Expo CLI
```bash
npm install -g expo-cli

# Verify installation
expo --version
```

### 3. Android Emulator (Optional)
- Install Android Studio
- Set up Android SDK
- Create/run Android Virtual Device

### 4. iOS Simulator (Optional, macOS only)
- Install Xcode from App Store
- Command: `xcode-select --install`

## Project Dependencies

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| expo | ~54.0.31 | React Native development framework |
| react | 19.1.0 | UI library |
| react-native | 0.81.5 | Mobile framework |
| react-native-paper | ^5.14.5 | Material Design UI components |

### State Management
| Package | Version | Purpose |
|---------|---------|---------|
| @reduxjs/toolkit | ^2.11.2 | Redux state management |
| react-redux | ^9.2.0 | React bindings for Redux |
| redux | ^5.0.1 | Core Redux library |

### Navigation
| Package | Version | Purpose |
|---------|---------|---------|
| @react-navigation/native | ^7.1.8 | Navigation container |
| @react-navigation/native-stack | ^7.9.0 | Stack navigator |
| @react-navigation/bottom-tabs | ^7.4.0 | Bottom tab navigator |

### HTTP & API
| Package | Version | Purpose |
|---------|---------|---------|
| axios | ^1.13.2 | HTTP client for API calls |

### UI & Icons
| Package | Version | Purpose |
|---------|---------|---------|
| @expo/vector-icons | ^15.0.3 | Icon library |
| react-native-reanimated | ~4.1.1 | Animation library |
| react-native-gesture-handler | ~2.28.0 | Touch & gesture handling |

## Setup Instructions

### 1. Clone Repository
```bash
git clone <repository-url>
cd RestaurantMobile
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env.local` file:
```
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### 4. Start Development Server

#### Web
```bash
npm start
# Then press 'w' for web
# Opens: http://localhost:8081
```

#### Android
```bash
npm run android
# or
npx expo start --android
```

#### iOS
```bash
npm run ios
# or
npx expo start --ios
```

## Project Structure
```
RestaurantMobile/
├── App.js                 # Root component with providers
├── index.js              # Entry point
├── screens/
│   ├── Home/
│   │   ├── Home.js       # Main export
│   │   ├── HomePage.js   # Home screen component
│   │   └── HomeStyle.js  # Styling
│   ├── About/
│   │   └── About.js
│   └── User/
│       └── User.js
├── store/
│   ├── store.js          # Redux store configuration
│   └── dishesSlice.js    # Dishes reducer & thunks
├── utils/
│   ├── Apis.js           # API functions
│   └── contexts/
├── assets/
│   ├── home/             # Food images
│   └── images/           # App assets
└── package.json          # Dependencies
```

## API Integration

### Backend Server
- **Base URL**: `http://127.0.0.1:8000/api`
- **Framework**: Django REST Framework
- **Default Port**: 8081 (Expo), 8000 (Django)

### Endpoints Used
- `GET /api/dishes/` - Fetch all dishes

## Key Features

✅ **Multi-screen Navigation** - Home, About, User profiles
✅ **Redux State Management** - Centralized dish data
✅ **API Integration** - Axios for async data fetching
✅ **Material Design UI** - react-native-paper components
✅ **Responsive Layout** - Works on mobile, tablet, web
✅ **Bottom Tab Navigation** - Easy screen switching
✅ **Top Bar Authentication** - Login/Sign Up buttons
✅ **Image Loading** - Optimized with Expo Image

## Development Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run linting
npm run lint

# Reset project (clears cache)
npm run reset-project

# Install new package
npm install package-name --save
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8081   # Windows
```

### Clear Cache
```bash
npx expo start --clear
npm start -- --reset-cache
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## Code Standards

- **Language**: JavaScript (ES6+)
- **Styling**: StyleSheet (React Native)
- **State**: Redux Toolkit
- **Navigation**: React Navigation
- **Naming**: camelCase for variables, PascalCase for components

## Git Workflow

### Ignored Files
- `.vscode/` - IDE settings
- `.github/` - GitHub configuration
- `.env.local` - Environment variables
- `node_modules/` - Dependencies
- `.expo/` - Expo cache

### Before Committing
```bash
git status
npm run lint
git add .
git commit -m "your message"
git push
```

## Performance Considerations

- Images optimized with react-native-image
- Redux selectors for component re-renders
- Lazy loading for navigation stacks
- Virtual lists for long item lists (future)

## Security

⚠️ **Never commit**:
- API keys
- Auth tokens
- Database credentials
- Private keys
- `.env` files (use `.env.example`)

## Support & Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Material Design](https://material.io/design/)

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-08 | Initial setup with home, about, user screens |

## License
Private

---
**Last Updated**: January 8, 2026
