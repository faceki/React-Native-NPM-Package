import React from 'react';
import FacekiApp from '@faceki/react-native-sdk';

import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        contentContainerStyle={styles.container}>
        {/* will start faceki kyc flow */}
        <FacekiApp
          clientId="####" // client id from faceki dashboard
          clientSecret="#####" // client secret from faceki dashboard
          // error function from kyc request
          onError={message => {
            console.log(message);
          }}
          // success request function from kyc request
          onComplete={message => {
            console.log(message);
          }}
          logoURL="https://www.logo.com" // (optional) for footer logo
          loadingURL="https://www.logo.com" // (optional) for loading screen logo
          // images with text for slides 1,2,3
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    height: 50,
    width: 200,
    backgroundColor: 'lightblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('screen').height,
  },
});

export default App;
