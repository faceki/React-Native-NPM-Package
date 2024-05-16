import React, { useEffect } from 'react';

import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { VerificationProvider } from './src/provider/verification.context';
import CarouselWrapper from './src/wrapper/carousel-wrapper';
import { MultiDocumentKYCResponseClass, SingleDocumentKYCResponseClass } from './src/service/types/facekiresponse';
import { Branding } from './src/service/types/interfaces';
import {getBranding, updateBranding} from './src/branding'
export type SlideType = { url: string; heading: string; subHeading: string };
import Toast from 'react-native-toast-message';

/**
 * An object containing the props for the KYC verification component.
 *
 * @param {string} clientId - The client ID for the KYC verification service.
 * @param {string} clientSecret - The client secret for the KYC verification service.
 * @param {string} logoURL - The URL for the image to display in the footer of the KYC verification process. (optional)
 * @param {string} loadingURL - The URL for the image to display in the loading animation on loading screen. (optional)
 * @param {Array} slides - An array of objects representing the slides to display in the KYC verification process with heading and subHeading. (optional)
 * @param {Function} onError - A function that handles errors that occur during the KYC verification process.
 * @param {Function} onComplete - A function that is called when the KYC verification process is complete.
 */

type props = {
  verification_url: string;
  logoURL?: string;
  loadingURL?: string;
  slides?: SlideType[];
  onError: (message: MultiDocumentKYCResponseClass | SingleDocumentKYCResponseClass | Error) => void;
  onComplete: (message: MultiDocumentKYCResponseClass | SingleDocumentKYCResponseClass) => void;
  allowSingleOverride?: boolean
  skipGuidanceScreens?: boolean
  consenttermofuseLink?: string
  skipFirstScreen?:boolean;
  skipResultScreen?:boolean;
  singleVerificationDoc?: "Passport" | "ID Card" | "Driving License"
  resultContent?: {
    success: {
      heading: string;
      subHeading: string
    },
    fail: {
      heading: string;
      subHeading: string
    },
    verification:{
      heading: string;
    }
  },
  branding?:Branding,
  livenessScoreOverride?:number,
  skipFunc?:any

};

function App({
  verification_url,
  logoURL,
  slides,
  onError,
  onComplete,
  loadingURL,
  allowSingleOverride=true,
  skipGuidanceScreens,
  consenttermofuseLink,
  skipFirstScreen,
  skipResultScreen,
  resultContent,
  singleVerificationDoc,
  branding,
  livenessScoreOverride,
  skipFunc
}: props): JSX.Element {
  useEffect(()=>{
    if(!branding)
    {
      console.log("Using Default Branding")
      branding  = getBranding()
    }else{
      updateBranding(branding)
      console.log("Using Custom Branding")
    }
  },[branding])

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <VerificationProvider
        verification_url={verification_url}
        onError={onError}
        onComplete={onComplete}
        allowSingleOverride={allowSingleOverride}
        skipGuidanceScreens={skipGuidanceScreens}
        consenttermofuseLink={consenttermofuseLink}
        skipFirstScreen={skipFirstScreen}
        skipResultScreen={skipResultScreen}
        resultContent={resultContent}
        singleVerificationDoc={singleVerificationDoc}
        branding={branding}
        livenessScoreOverride={livenessScoreOverride}
        skipFunc={skipFunc}
      >
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <CarouselWrapper
          slides={slides}
          logoURL={logoURL}
          loadingURL={loadingURL}
        />
         

      </VerificationProvider>
      <Toast />
    </SafeAreaView>
  );
}

export default App;
