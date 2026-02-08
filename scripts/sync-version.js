#!/usr/bin/env node

/**
 * Sync version from package.json to native iOS and Android projects
 * Also increments build numbers for iOS and Android
 */

const fs = require('fs');
const path = require('path');

// Read package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageJson.version;

// Update iOS project.pbxproj
const pbxprojPath = path.join(__dirname, '..', 'ios', 'TruPhotos.xcodeproj', 'project.pbxproj');
if (fs.existsSync(pbxprojPath)) {
  let pbxprojContent = fs.readFileSync(pbxprojPath, 'utf8');

  // Update MARKETING_VERSION (user-facing version string)
  pbxprojContent = pbxprojContent.replace(
    /MARKETING_VERSION = [^;]+;/g,
    `MARKETING_VERSION = ${version};`
  );

  // Increment CURRENT_PROJECT_VERSION (build number)
  const buildNumberMatch = pbxprojContent.match(/CURRENT_PROJECT_VERSION = (\d+);/);
  if (buildNumberMatch) {
    const currentBuild = parseInt(buildNumberMatch[1], 10);
    const newBuild = currentBuild + 1;
    pbxprojContent = pbxprojContent.replace(
      /CURRENT_PROJECT_VERSION = \d+;/g,
      `CURRENT_PROJECT_VERSION = ${newBuild};`
    );
    console.log(`📱 iOS build number: ${newBuild}`);
  }

  fs.writeFileSync(pbxprojPath, pbxprojContent);
  console.log(`📱 iOS version: ${version}`);
}

// Update Android build.gradle
const buildGradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');
if (fs.existsSync(buildGradlePath)) {
  let gradleContent = fs.readFileSync(buildGradlePath, 'utf8');

  // Update versionName
  gradleContent = gradleContent.replace(
    /versionName\s+"[^"]+"/,
    `versionName "${version}"`
  );

  // Increment versionCode
  const versionCodeMatch = gradleContent.match(/versionCode\s+(\d+)/);
  if (versionCodeMatch) {
    const currentCode = parseInt(versionCodeMatch[1], 10);
    const newCode = currentCode + 1;
    gradleContent = gradleContent.replace(
      /versionCode\s+\d+/,
      `versionCode ${newCode}`
    );
    console.log(`🤖 Android version code: ${newCode}`);
  }

  fs.writeFileSync(buildGradlePath, gradleContent);
}

console.log(`✅ Version synced to ${version}`);

