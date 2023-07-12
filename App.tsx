import React from 'react';

import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {VerificationProvider} from './src/provider/verification.context';
import CarouselWrapper from './src/wrapper/carousel-wrapper';

export type SlideType = {url: string; heading: string; subHeading: string};

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
  clientId: string;
  clientSecret: string;
  logoURL?: string;
  loadingURL?: string;
  slides?: SlideType[];
  onError: (message: Error) => void;
  onComplete: (message: string) => void;
};
function App({
  clientId,
  clientSecret,
  logoURL,
  slides,
  onError,
  onComplete,
  loadingURL,
}: props): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <VerificationProvider
        clientId={clientId}
        clientSecret={clientSecret}
        onError={onError}
        onComplete={onComplete}>
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
    </SafeAreaView>
  );
}

export default App;
