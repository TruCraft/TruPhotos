#!/usr/bin/env bash

# Script to generate all app icons from the SVG source
# Requires: ImageMagick (convert command)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎨 Generating app icons from SVG...${NC}"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}❌ Error: ImageMagick is not installed${NC}"
    echo "Install it with: brew install imagemagick"
    exit 1
fi

# Paths
SVG_FILE="assets/icon-design.svg"
SVG_LAUNCHER_FILE="assets/icon-app-launcher.svg"
TEMP_PNG="assets/icon-temp.png"
TEMP_LAUNCHER_PNG="assets/icon-launcher-temp.png"
ICON_PNG="assets/icon.png"

# Check if SVG exists
if [ ! -f "$SVG_FILE" ]; then
    echo -e "${RED}❌ Error: $SVG_FILE not found${NC}"
    exit 1
fi

echo -e "${YELLOW}📐 Converting SVG to PNG (1024x1024)...${NC}"
convert -background none -density 300 "$SVG_FILE" -resize 1024x1024 "$TEMP_PNG"
cp "$TEMP_PNG" "$ICON_PNG"

echo -e "${YELLOW}📱 Generating iOS icons...${NC}"

# iOS icon sizes
IOS_SIZES=(40 60 58 87 80 120 180 1024)
IOS_DIR="ios/TruPhotos/Images.xcassets/AppIcon.appiconset"

for size in "${IOS_SIZES[@]}"; do
    echo "  → icon-${size}.png"
    convert "$TEMP_PNG" -resize ${size}x${size} "${IOS_DIR}/icon-${size}.png"
done

echo -e "${YELLOW}🤖 Generating Android icons...${NC}"

# Android icon sizes (mipmap densities)
# Format: "density:size"
ANDROID_SIZES=(
    "mdpi:48"
    "hdpi:72"
    "xhdpi:96"
    "xxhdpi:144"
    "xxxhdpi:192"
)

for entry in "${ANDROID_SIZES[@]}"; do
    density="${entry%%:*}"
    size="${entry##*:}"
    dir="android/app/src/main/res/mipmap-${density}"
    echo "  → ${density}: ${size}x${size}"

    # Generate launcher icon
    convert "$TEMP_PNG" -resize ${size}x${size} "${dir}/ic_launcher.png"

    # Generate round launcher icon
    convert "$TEMP_PNG" -resize ${size}x${size} "${dir}/ic_launcher_round.png"
done

# Generate Android foreground (for adaptive icons)
echo -e "${YELLOW}🎯 Generating Android adaptive icon foreground...${NC}"

# Convert the launcher SVG to PNG at the exact size needed
convert -background none -density 300 "$SVG_LAUNCHER_FILE" -resize 432x432 "$TEMP_LAUNCHER_PNG"

ANDROID_FOREGROUND_SIZE=432
for entry in "${ANDROID_SIZES[@]}"; do
    density="${entry%%:*}"
    dir="android/app/src/main/res/mipmap-${density}"
    echo "  → ${density}: ${ANDROID_FOREGROUND_SIZE}x${ANDROID_FOREGROUND_SIZE}"
    cp "$TEMP_LAUNCHER_PNG" "${dir}/ic_launcher_foreground.png"
done

# Clean up temp files
rm "$TEMP_PNG"
rm "$TEMP_LAUNCHER_PNG"

echo -e "${GREEN}✅ All icons generated successfully!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "  1. Review the generated icons"
echo "  2. Rebuild the app to see the new icons"
echo "  3. For Android: ./gradlew clean in android/"
echo "  4. For iOS: pod install in ios/"

