# Tru Photos

A React Native mobile app for browsing and managing your Plex photo libraries. View your photos in a beautiful timeline or folder-based interface, with support for multiple servers, profiles, and photo libraries.

## Features

### Core Functionality
- 🔐 **Plex OAuth Authentication** - Secure login with your Plex account
- 👥 **Multi-Profile Support** - Switch between Plex home users
- 🖥️ **Multi-Server Support** - Connect to multiple Plex servers
- 📚 **Multiple Photo Libraries** - Switch between different photo libraries
- 📅 **Timeline View** - Browse photos chronologically with date-based sections
- 📁 **Folder/Album Navigation** - Explore your photo collection by folders
- 🔍 **Breadcrumb Navigation** - Easy navigation through nested folders

### Photo Viewing
- 🖼️ **Full-Screen Photo Viewer** - Immersive photo viewing experience
- 🔍 **Pinch to Zoom** - Zoom up to 5x with smooth gestures
- 📊 **Photo Metadata Display** - View camera settings, date, location, and more
- ⭐ **Photo Rating System** - Rate your favorite photos (0-10 scale)
- 🎥 **Video Playback Support** - Watch videos from your library
- 💾 **Download Photos** - Save photos to your device
- 📤 **Share Photos** - Share via native share sheet

### User Interface
- 🌙 **Dark Theme** - Beautiful dark interface with Plex orange accents
- 📱 **3-Column Responsive Grid** - Optimized layout for mobile devices
- 🎨 **Rounded Thumbnails** - Modern photo grid with 4px spacing
- 🔄 **Pull-to-Refresh** - Refresh your photo library
- ⚙️ **Settings Screen** - Manage profiles, servers, and preferences
- ℹ️ **About Screen** - App info, privacy policy, and license

### Developer Features
- 📦 **Automated Versioning** - Git hooks for automatic version management
- 🔢 **Build Number Tracking** - Auto-incremented build numbers for iOS/Android
- 📝 **Legal Content Generation** - Auto-generate TypeScript constants from LICENSE/PRIVACY.md
- 🔗 **In-App Browser** - View external links without leaving the app

## Prerequisites

> **Note**: Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

### Required
- **Node.js** >= 20
- **React Native CLI** - For building and running the app
- **Plex Account** - With access to at least one Plex server with photo libraries
- **Android Studio** (for Android) or **Xcode** (for iOS)

### For iOS Development
- **macOS** - Required for iOS development
- **CocoaPods** - Installed via Ruby bundler
- **Xcode** - Latest version recommended

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/jacobtruman/TruPhotos.git
cd TruPhotos

# Install dependencies
npm install
```

### 2. iOS Setup (macOS only)

```bash
# Install Ruby dependencies (CocoaPods)
bundle install

# Install iOS pods
cd ios
bundle exec pod install
cd ..
```

### 3. Run the App

#### Start Metro Bundler

```bash
npm start
```

#### Run on Android

In a new terminal:

```bash
npm run android
```

#### Run on iOS

In a new terminal:

```bash
npm run ios
```

### 4. First Launch

1. **Login** - Sign in with your Plex account
2. **Select Profile** - Choose a Plex home user (if applicable)
3. **Select Server** - Choose a Plex server with photo libraries
4. **Select Library** - Choose a photo library to browse
5. **Browse Photos** - Enjoy your photos in Timeline or Folders view!

## Building for Production

### Android Release Build

```bash
# Build release APK
npm run build:android

# Install on connected device
npm run install:android
```

The APK will be located at: `android/app/build/outputs/apk/release/app-release.apk`

### iOS Release Build

1. Open `ios/TruPhotos.xcworkspace` in Xcode
2. Select your signing team and provisioning profile
3. Select **Product** → **Archive**
4. Follow the App Store submission process

## Development

### Project Structure

```
TruPhotos/
├── src/
│   ├── components/      # Reusable UI components
│   ├── constants/       # App constants and generated content
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # App screens
│   ├── services/        # API services (Plex, auth, download)
│   ├── theme/           # Colors, typography, styles
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── assets/              # Images, icons, SVGs
├── docs/                # Documentation
├── scripts/             # Build and utility scripts
└── android/ios/         # Native platform code
```

### Available Scripts

See [CHANGELOG.md](CHANGELOG.md#available-npm-scripts) for a complete list of available npm scripts.

### Versioning

This project uses automated versioning with git hooks. See [docs/VERSIONING.md](docs/VERSIONING.md) and [docs/GIT_HOOKS.md](docs/GIT_HOOKS.md) for details.

```bash
# Bump version (automatically increments build numbers)
npm run version:patch  # Bug fixes
npm run version:minor  # New features
npm run version:major  # Breaking changes
```

## Troubleshooting

### Common Issues

#### Metro Bundler Issues

If you encounter issues with Metro:

```bash
# Clear Metro cache
npm start -- --reset-cache
```

#### iOS Build Issues

```bash
# Clean iOS build
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install
cd ..
```

#### Android Build Issues

```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

### Getting Help

- Check the [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting) guide
- Review [Plex API Documentation](https://www.plexopedia.com/plex-media-server/api/)
- Open an issue on [GitHub](https://github.com/jacobtruman/TruPhotos/issues)

## Tech Stack

- **React Native** 0.83.1 - Mobile framework
- **React** 19.2.0 - UI library
- **TypeScript** 5.8.3 - Type safety
- **React Navigation** 7.x - Navigation
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Touch gestures
- **Plex API** - Photo library integration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Privacy

See [PRIVACY.md](PRIVACY.md) for our privacy policy.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

**Jacob Truman**
- GitHub: [@jacobtruman](https://github.com/jacobtruman)
- Website: [jacobtruman.com](https://jacobtruman.com)

