# Privacy Policy for Tru Photos

**Last Updated: February 13, 2026**

## Overview

Tru Photos is a mobile application that allows you to browse and manage photos from your Jellyfin Media Server. This privacy policy explains how the app handles your data.

## Data Collection

### What We Collect

Tru Photos does **NOT** collect, store, or transmit any personal data to third-party servers. All data remains on your device and your Jellyfin Media Server.

The app stores the following information **locally on your device only**:

- **Jellyfin Authentication Token**: Used to authenticate with your Jellyfin server
- **Selected Server**: Your chosen Jellyfin Media Server
- **Selected Library**: Your chosen photo library
- **App Preferences**: Settings like selected tab, grid size, etc.

### What We Don't Collect

- We do **NOT** collect analytics or usage data
- We do **NOT** track your location
- We do **NOT** access your device's camera or microphone
- We do **NOT** share your data with third parties
- We do **NOT** display advertisements

## Data Storage

All data is stored locally on your device using:

- **React Native Keychain**: For sensitive data like authentication tokens
- **AsyncStorage**: For app preferences and settings

This data is **never transmitted** to any server except your own Jellyfin Media Server.

## Third-Party Services

### Jellyfin Media Server

Tru Photos connects directly to your Jellyfin Media Server for accessing your photos.

Please refer to [Jellyfin's documentation](https://jellyfin.org/) for information about Jellyfin.

### No Other Third Parties

Tru Photos does not use:
- Analytics services (e.g., Google Analytics, Firebase)
- Crash reporting services
- Advertising networks
- Social media integrations

## Permissions

The app requests the following permissions:

- **Internet Access**: Required to connect to your Jellyfin Media Server
- **Media Library Access**: Optional, only if you choose to download photos to your device
- **Storage Access**: Optional, only if you choose to download photos

## Data Security

- Authentication tokens are stored securely using React Native Keychain
- All communication with Jellyfin servers uses HTTPS encryption
- No data is transmitted to servers other than your Jellyfin server

## Your Rights

You have the right to:

- **Delete Your Data**: Uninstalling the app removes all locally stored data
- **Sign Out**: Removes authentication tokens from the device
- **Change Servers**: Change which Jellyfin server you use

## Children's Privacy

Tru Photos does not knowingly collect data from children under 13. The app is designed for users who have access to a Jellyfin Media Server.

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be reflected in the app and on the GitHub repository.

## Open Source

Tru Photos is open source software. You can review the source code at:
https://github.com/jacobtruman/TruPhotos

## Contact

For questions or concerns about privacy, please open an issue on GitHub:
https://github.com/jacobtruman/TruPhotos/issues

## Summary

**TL;DR**: Tru Photos is a privacy-focused app that:
- ✅ Stores data only on your device
- ✅ Connects only to your Jellyfin servers
- ✅ Does not collect analytics or tracking data
- ✅ Does not share data with third parties
- ✅ Is open source and transparent

Your photos and data remain private and under your control.

