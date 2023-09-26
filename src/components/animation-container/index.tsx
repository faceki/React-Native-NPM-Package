import {Image, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const AnimationComponent = (props?: any) => {
  return (
    <>
      {!props?.loading && (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              fontSize: 15,
              textAlign: 'center',
            }}>
            You will need to take a picture of your document and selfie
          </Text>
          <LottieView
            source={require('../../assets/jsons/lottieGuidance.json')}
            autoPlay
            loop
            style={{flex: 1, maxHeight: 400}}
          />

          <Text style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 18}}>
            For the best picture result
          </Text>
          <Text style={{alignSelf: 'center'}}>
            Find an area for good lighting
          </Text>
        </View>
      )}

      {props?.loading && (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <LottieView
            source={require('../../assets/jsons/lottieFirstLoading.json')}
            autoPlay
            loop
            style={{flex: 1, maxHeight: 400}}
          />

          <Text style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 18}}>
            Getting Ready...
          </Text>
        </View>
      )}
    </>
  );
};

export default AnimationComponent;
