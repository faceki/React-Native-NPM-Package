import {Pressable, Text} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {globalStyles} from '../../../globalStyles';
import {styles} from './style';
import branding from '../../branding';

type props = {
  onClick: () => void;
};

const FlipButton = ({onClick}: props) => {
  return (
    <Pressable
      style={({pressed}) =>
        pressed ? [styles.flipButton, styles.opacity] : styles.flipButton
      }
      onPress={onClick}>
      <Icon
        name="ios-camera-reverse"
        size={32}
        color={branding.colors.textDefault}
      />
      <Text style={[styles.flipCamera, globalStyles.textRegular]}>
        Flip Camera
      </Text>
    </Pressable>
  );
};

export default FlipButton;
