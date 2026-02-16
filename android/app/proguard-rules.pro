# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.react.** { *; }

# Hermes
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.hermes.**

# Keep native methods
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# React Native SVG
-keep public class com.horcrux.svg.** { *; }

# Keychain
-keep class com.oblador.keychain.** { *; }
-dontwarn com.oblador.keychain.**

# Keep JavaScript interface methods
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# OkHttp (used by React Native networking)
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# Keep annotations
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keepattributes Signature
-keepattributes Exceptions

# For stack traces
-renamesourcefileattribute SourceFile
