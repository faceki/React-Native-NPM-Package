import {View, Image, Pressable, Text} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {ImgUrlsType} from '../../provider/verification.context';
import {globalStyles} from '../../../globalStyles';

type props = {
  imgUrls: ImgUrlsType;
  selectedOption: string;
  routeOfHandler: () => void;
  goBackUserSteps: () => void;
  userStep: number;
};

/**
 * A component for displaying an image captured by the user and allowing the user to confirm or retake the photo.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.imgUrls - An object containing the image URLs for the front and back of the ID card and the user's selfie.
 * @param {string} props.selectedOption - The currently selected option for the ID card type.
 * @param {Function} props.routeOfHandler - A function that handles the user's confirmation of the photo.
 * @param {Function} props.goBackUserSteps - A function that allows the user to go back to the previous verification step.
 * @param {number} props.userStep - The current step in the user verification process.
 * @returns {JSX.Element} - The rendered component as a JSX element.
 */

const ClarityCheck = ({
  imgUrls,
  selectedOption,
  routeOfHandler,
  goBackUserSteps,
  userStep,
}: props) => {
  let userImage =
    userStep === 8
      ? imgUrls[selectedOption].backImage
      : imgUrls[selectedOption].frontImage;

  // when i need to test selfie image only
  if (userStep === 10) {
    userImage = imgUrls[selectedOption].selfie;
  }

  return (
    <View>
      <Image
        style={[styles.tinyLogo, styles.border]}
        source={{
          uri: userImage.uri,
        }}
        resizeMode="cover"
      />
      <View style={styles.center}>
        <Pressable
          style={({pressed}) =>
            pressed ? [styles.cta, styles.opacity] : styles.cta
          }
          onPress={routeOfHandler}>
          <Text style={[styles.ctaText, globalStyles.textMedium]}>
            Looks Good
          </Text>
        </Pressable>
        <Pressable
          style={({pressed}) =>
            pressed ? [styles.retake, styles.opacity] : styles.retake
          }
          onPress={goBackUserSteps}>
          <Text style={[styles.retakeButtonText, globalStyles.textMedium]}>
            Retake the photo
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ClarityCheck;
