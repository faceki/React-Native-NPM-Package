<h1 align="center">
    🎈React Native NPM Packege For FACEKI KYC V2
</h1>

<p align="center">
  <strong>Faceki V2 Know Your Customer</strong><br>
</p>

<p align="center">
  <a href="https://github.com/teslamotors/react-native-camera-kit/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="React Native Camera Kit is released under the MIT license." />
  </a>
  <a href="https://www.npmjs.org/package/react-native-camera-kit">
    <img src="https://badge.fury.io/js/react-native-camera-kit.svg" alt="Current npm package version." />
  </a>
</p>

## Client Id and Client Secret:

To obtain a client ID and secret for using our API, you will need to create an account on the Faceki dashboard by visiting the following URL: https://apps.faceki.com/.

# Tutorial For Client ID and Secret:
 
URL: https://kycdocv2.faceki.com/quick-guides/integration-setting

Once you have created an account, navigate to the "Integrations" section of the dashboard and click on the "Client ID" option. From there, you can create a new client ID by following the on-screen instructions.

Please make sure to keep your client ID and secret secure, as they are used to authenticate your application and access our API data.

## Installation (RN >= 0.72)

```
npm i @faceki/react-native-sdk
npm i react-native-camera-kit
```

Add Kotlin to your project. It is required by react-native-camera-kit:

add this in android/build.gradle

```
buildscript {
ext {
...
kotlin_version = '1.7.20'
minSdkVersion = 23
}
dependencies {
... classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version")
}
}

```

## Permissions

#### Android:

Add the following uses-permission to your AndroidManifest.xml (usually found at: android/app/src/main/)

```
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

```

#### IOS

Add the following usage descriptions to your Info.plist (usually found at: ios/PROJECT_NAME/)

```
<key>NSCameraUsageDescription</key>
<string>For taking photos for kyc</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>For saving photos</string>

```

## Troubleshoot for react-native-vector-icons

#### Android

Add this in your android/app/build.gradle If not already added.

```
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

#### IOS

Add this to info.plist if you have issues in showing icons from react native vector icons

```
<key>UIAppFonts</key>
	<array>
		<string>AntDesign.ttf</string>
		<string>Entypo.ttf</string>
		<string>EvilIcons.ttf</string>
		<string>Feather.ttf</string>
		<string>FontAwesome.ttf</string>
		<string>FontAwesome5_Brands.ttf</string>
		<string>FontAwesome5_Regular.ttf</string>
		<string>FontAwesome5_Solid.ttf</string>
		<string>Fontisto.ttf</string>
		<string>Foundation.ttf</string>
		<string>Ionicons.ttf</string>
		<string>MaterialCommunityIcons.ttf</string>
		<string>MaterialIcons.ttf</string>
		<string>Octicons.ttf</string>
		<string>SimpleLineIcons.ttf</string>
		<string>Zocial.ttf</string>
	</array>

```

Add this in your podfile

```
target 'targetPackage' do
config = use_native_modules!

  pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons' 👈 Add this for vector icons
```

RUN

```
cd ios && pod install && cd ..
```

## USAGE

```jsx
import FacekiApp from 'faceki-rnkyc';

<>
  <FacekiApp
    clientId="######################"
    clientSecret="######################"
    onError={onError}
    onComplete={onComplete}
  />
</>;
```

if you want to change images in the project

```jsx
import FacekiApp from 'faceki-rnkyc';

<>
  <FacekiApp
    clientId="######################"
    clientSecret="######################"
    onError={onError}
    onComplete={onComplete}
    logoURL="https://www.logo.com"
    loadingURL="https://www.logo.com"
    slides={[
      {
        url: 'https://images.unsplash.com/photo-1457195740896-7f345efef228?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        heading: 'Document Scan',
        subHeading: 'Will ask you to take a picture of your document',
      },
      {
        url: 'https://images.unsplash.com/photo-1457195740896-7f345efef228?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        heading: 'Document Scan',
        subHeading: 'Will ask you to take a picture of your document',
      },
      {
        url: 'https://images.unsplash.com/photo-1457195740896-7f345efef228?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        heading: 'Document Scan',
        subHeading: 'Will ask you to take a picture of your document',
      },
    ]}
  />
</>;
```

## NOTE:

To request camera permissions from users on iOS in a your app, you can utilize the 'react-native-permissions' package. However, for Android devices, the camera permission is by default handled by the package.
https://www.npmjs.com/package/react-native-permissions

## Troubleshoot

Vector icons are causing an issue in release build in version <= 9.2.0 in android. There is an ongoing discussion about it. Simple fix until new verion is released.

Go to node_modules/react-native-vector-icons/fonts.gradle

Add this 👇

    android.applicationVariants.all { def variant ->
        def targetName = variant.name.capitalize()
        // 👉 patch
           def lintVitalAnalyzeTask = tasks.findByName("lintVitalAnalyze${targetName}")
           if (lintVitalAnalyzeTask) {
             lintVitalAnalyzeTask.dependsOn(fontCopyTask)
           }
        // patch ends
        def generateAssetsTask = tasks.findByName("generate${targetName}Assets")
        generateAssetsTask.dependsOn(fontCopyTask)
    }

You can read on 👉 https://github.com/oblador/react-native-vector-icons/issues/1508

Sometimes its better to reinstall all the node_modules and pods again

```
rm -rf node_modules && rm -rf yarn.lock && watchman watch-del-all && cd ios && rm -rf Pods && rm -rf Podfile.lock && pod deintegrate && pod cache clean --all && cd ..

```

```
npm i
```

```
cd ios && pod install
```
