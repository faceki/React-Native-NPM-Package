<h1 align="center">
    🎈React Native NPM Packege For FACEKI KYC V2
</h1>

<p align="center">
  <strong>Faceki V2 Know Your Customer</strong><br>
</p>

## If you are new to FACEKI, we suggest you to move to BLAZE 3.0  which is the latest version of Faceki and it's more powerful than this package.
### Note: This PACKAGE will no longer get any update. We Suggest you to migrate if you are facing any issue. Contact us: https://wa.me/+13026131330

## Client Id and Client Secret:

To obtain a client ID and secret for using our API, you will need to create an account on the Faceki dashboard by visiting the following URL: https://apps.faceki.com/.

# Tutorial For Client ID and Secret:
 
URL: https://kycdocv2.faceki.com/quick-guides/integration-setting

Once you have created an account, navigate to the "Integrations" section of the dashboard and click on the "Client ID" option. From there, you can create a new client ID by following the on-screen instructions.

Please make sure to keep your client ID and secret secure, as they are used to authenticate your application and access our API data.

## Installation (RN >= 0.72)

```
npm i @faceki/react-native-sdk
npm i react-native-vision-camera
npm i lottie-react-native
npm i @bam.tech/react-native-image-resizer@3.0.7
```

This SDK is tested with @bam.tech/react-native-image-resizer version 3.0.7, you can use latest if doesn't work. Kindly use version 3.0.7



## Permissions

#### Android:

Add the following uses-permission to your AndroidManifest.xml (usually found at: android/app/src/main/)

```
<uses-permission android:name="android.permission.CAMERA" />

```

#### IOS

Add the following usage descriptions to your Info.plist (usually found at: ios/PROJECT_NAME/)

```
<key>NSCameraUsageDescription</key>
<string>$(PRODUCT_NAME) needs access to your Camera.</string>


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

You would need to generate EKYC Link through the API here:

https://docs.faceki.com/api-integration/verification-apis/generate-kyc-link

In the response use the key "data" to initiate the SDK


```jsx
import FacekiApp from '@faceki/react-native-sdk';

<>
  <FacekiApp
    verification_url="XXXX-XXXX-xxxX-XxXXX"
    onError={onError}
    onComplete={onComplete}
  />
</>;
```

Advance Usage

```jsx
import FacekiApp from '@faceki/react-native-sdk';
import { Branding } from '@faceki/react-native-sdk/src/service/types/interfaces';

 const CustomBranding:Branding ={
    colors: {
      primary: '#F8B427',
      secondary: '#343333',
      buttonColor: 'rgba(253, 181, 40, 0.10)',
      success: '#59C547',
      danger: '#FF3B30',
      warning: '#FF9500',
      info: '#5AC8FA',
      light: '#F5F5F5',
      dark: '#1C1C1E',
      background: '#f5f5f5',
      backgroundSecondary: '#eeeeee',
      backgroundCaptureBtn: '#F6F6F7',
      textDefault: '#444343',
      textSecondary: '#3E3E3E',
      fontRegular:"Inter",
      fontMedium:"Inter-Medium",
      fontBold:"Inter-Bold"
    },
    images:{
      card_guidance:"", //optional
      selfie_guidance:"" //optional
    }
  }
  
<>

      <FacekiApp
        verification_url="XXXX-XXXX-xxxX-XxXXX"
        onError={(error) => { console.log("ERROR", error) }}
        onComplete={(data) => {

          if(data instanceof MultiDocumentKYCResponseClass){
            console.log("Multi Response")

          }else if(data instanceof SingleDocumentKYCResponseClass)
          {
            console.log("Single Response")
          }

         }}
        resultContent={{
          success:{
            heading:"",
            subHeading:""
          },
          fail:{
            heading:"",
            subHeading:""
          }
        }}

        consenttermofuseLink='https://faceki.com'
        logoURL='http://xyz.com/zyx.png'
        skipFirstScreen={true}. // true | false (If you want to disable first getting started screen)
        allowSingleOverride={false} // true | false (if you want customer to select the document)
        skipGuidanceScreens={true} // true | false (if you want to hide the guidance screens)
        skipResultScreen={true} // true | false (if you want to skip the result screen and manage your logic by onError or onComplete method)
        singleVerificationDoc="Driving License" (If you want to verify specific document with allowSingleOverride)
        branding={CustomBranding}
        skipFunc={
          ()=>{
            /// Logic To Skip SDK or Navigate
          }
        }

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



# Changelog

All notable changes to this project will be documented in this file.

## [2.0.9] - 16-05-2024
### Changed
- README UPDATES

## [2.0.8] - 16-05-2024
### Changed
- Remove Client ID and Secret, replaced with Verification LINK
- Added SKIP button in header

## [2.0.7] - 13-02-2024
### Changed
- Upgraded React Vision Camera to V3

## [2.0.6] - 22-12-2023
### Changed
- Added Quality/Liveness Check While Capturing