import {StyleSheet} from 'react-native';
import branding from '../../branding';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  heading: {
    fontSize: 24,
    paddingBottom: 20,
    color: branding.colors.textDefault,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 14,
    textAlign: 'center',
    color: branding.colors.textDefault,
  },
  icon: {
    paddingBottom: 20,
  },
});
