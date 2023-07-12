import {Image, Text, View} from 'react-native';
import React from 'react';
import {styles} from './styles';
const LOGO = '../../assets/ex-id-card.png';

const PassportPhotoGuide = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require(LOGO)} />
    </View>
  );
};

export default PassportPhotoGuide;
