import {StyleSheet, Dimensions} from 'react-native';
import branding from '../../branding';

const {width, height} = Dimensions.get('screen');

export const styles = StyleSheet.create({
  column: {
    display: 'flex',
    alignItems: 'center',
  },
  brick: {
    backgroundColor: branding.colors.primary,
    width: width / 2.5,
    height: height / 24,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brickText: {
    color: branding.colors.background,
  },
  borderCamera: {
    borderColor: 'lightgray',
    borderWidth: 4,
  },
  border: {
    width: width / 1.13,
    height: height / 2.3,
  },
  cameraSubtitles: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  heading: {
    color: branding.colors.textDefault,
  },
  subheading: {
    color: branding.colors.primary,
  },
  buttonContainer: {
    display: 'flex',
    width: width / 1.1,
    height: height / 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flipButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtn: {
    backgroundColor: branding.colors.backgroundCaptureBtn,
    width: 70,
    height: 70,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: branding.colors.primary,
    borderWidth: 1,
  },
  right: {
    width: width / 6,
  },
  opacity: {
    opacity: 0.3,
  },
});
