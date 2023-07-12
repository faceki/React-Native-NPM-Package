import {StyleSheet, Dimensions} from 'react-native';
import branding from '../../branding';

const {width, height} = Dimensions.get('screen');

export const styles = StyleSheet.create({
  border: {
    borderColor: 'lightgray',
    borderWidth: 4,
  },
  tinyLogo: {
    width: width / 1.13,
    height: height / 2.3,
  },
  cta: {
    backgroundColor: branding.colors.buttonColor,
    width: width / 2,
    height: 50,
    borderRadius: 4,
    borderColor: branding.colors.primary,
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retake: {
    width: width / 2,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    color: branding.colors.primary,
    textTransform: 'uppercase',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
  },
  retakeButtonText: {
    color: branding.colors.textDefault,
  },
  opacity: {
    opacity: 0.3,
  },
});
