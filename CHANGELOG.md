# Changelog

All notable changes to Tru Photos will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Version management system with automated build number tracking
- Settings screen with profile/server switching and sign out
- About screen with app info, privacy policy, and license viewer
- Markdown viewer screen for displaying formatted documents
- Library dropdown component for switching between photo libraries
- Profile button component for quick access to profile options
- Floating refresh button component
- Legal content auto-generation script (LICENSE and PRIVACY.md to TypeScript)
- In-app browser support for external links
- Husky git hooks for automated version management
- Pre-commit hook for automatic version bumping
- NPM scripts for legal content generation (runs before builds)

### Changed
- Improved photo and folder grid spacing (4px margins)
- Updated photo thumbnails with rounded corners

### Fixed
- Photo sorting now uses Plex's original order

## [1.0.0] - 2026-01-30

### Added
- Initial release
- Plex OAuth authentication
- Multi-server support
- Profile management
- Timeline view with date-based sections
- Folder/album navigation with breadcrumbs
- Full-screen photo viewer
- Photo metadata display
- Download photos to device
- Share photos via native share sheet
- Video playback support
- Photo rating system
- Pull-to-refresh functionality
- Dark theme with Plex orange accents
- 3-column responsive grid layout
- Folder cards with gradient overlays

### Technical
- React Native 0.83.1
- React 19.2.0
- TypeScript 5.8.3
- React Navigation 7.x

---

## Version Format

- **MAJOR.MINOR.PATCH** (Semantic Versioning)
- **Build Numbers**: Auto-incremented for each build
  - iOS: `buildNumber` (string)
  - Android: `versionCode` (integer)

## How to Update Version

```bash
# Patch version (1.0.0 -> 1.0.1) - Bug fixes
npm run version:patch

# Minor version (1.0.0 -> 1.1.0) - New features
npm run version:minor

# Major version (1.0.0 -> 2.0.0) - Breaking changes
npm run version:major
```

After updating version, commit the changes and build:

```bash
git add package.json app.json CHANGELOG.md
git commit -m "chore: bump version to X.Y.Z"
npm run build:android  # or build:ios
```

## Available NPM Scripts

### Development
- `npm start` - Start Metro bundler
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator

### Building
- `npm run build:android` - Build Android release APK
- `npm run install:android` - Install release APK on connected device

### Versioning
- `npm run version:patch` - Bump patch version (bug fixes)
- `npm run version:minor` - Bump minor version (new features)
- `npm run version:major` - Bump major version (breaking changes)

### Utilities
- `npm run generate:legal` - Generate legal content TypeScript constants
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests

### Pre-hooks (automatic)
- `prestart` - Runs `generate:legal` before starting Metro
- `prebuild:android` - Runs `generate:legal` before Android builds
- `prepare` - Sets up Husky git hooks

