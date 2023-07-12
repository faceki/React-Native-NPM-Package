import {StyleSheet} from 'react-native';
import branding from '../../branding';

export const styles = StyleSheet.create({
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 'auto',
  },
  tinyLogo: {
    width: 40,
    height: 40,
    objectFit: 'contain',
    marginTop: 40,
  },
  cta: {
    width: 150,
    height: 40,
    borderRadius: 4,
    backgroundColor: branding.colors.primary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  ctaText: {
    color: branding.colors.background,
  },
  icon: {
    paddingLeft: 10,
  },
  opacity: {
    opacity: 0.5,
  },
});
