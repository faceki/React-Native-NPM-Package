import {Text, View, Pressable, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {styles} from './styles';

import {globalStyles} from '../../../globalStyles';
import CaptureButton from '../../design-system/capture-button/capture-button.component';
import FlipButton from '../../design-system/flip-button/flip-button.component';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Camera,
  frameRateIncluded,
  useCameraDevices,
} from 'react-native-vision-camera';
import { getBranding } from '../../branding';

type props = {
  webcamRef: React.MutableRefObject<any>;
  handleSingleCapturePhoto: (step: number) => void;
  userStep: number;
  skipGuidanceScreens?: boolean;
  goBackUserSteps: (index?: number) => void;
  findOutStepContent: () => {
    step: number;
    heading: string;
    subHeading: string;
  };
};

/**
 * A component for capturing an image of the user with the device's camera.
 *
 * @param {Object} props - The component props.
 * @param {string} props.cameraMode - The type of camera to use (front or back).
 * @param {Function} props.flipCamera - A function that switches between the front and back camera.
 * @param {Object} props.webcamRef - A mutable ref object for accessing the camera component.
 * @param {Function} props.handleSingleCapturePhoto - A function that handles capturing a single photo for the current verification step.
 * @param {number} props.userStep - The current step in the user verification process.
 * @returns {JSX.Element} - The rendered component as a JSX element.
 */
import overlayImage from '../../assets/faceki-overlay-camera.png';
import branding from '../../branding';

const CaptureUserWebcam = ({
  webcamRef,
  handleSingleCapturePhoto,
  userStep,
  goBackUserSteps,
  findOutStepContent,
  skipGuidanceScreens,
}: props) => {
  const devices: any = useCameraDevices();
  const [device, setDevice] = useState(devices.back);
  useEffect(() => {
    if (devices) {
      setDevice(devices.back);
    }
  }, [devices]);
  const flipCamera = () => {
    if (device == devices.front) {
      setDevice(devices.back);
    } else {
      setDevice(devices.front);
    }
  };

  return (
    <View key="main" style={{flex: 1}}>
      {/* Camera Screen */}

      {device && (
        <Camera
          style={[styles.overlayContainer, {flex: 1, width: '100%', zIndex: 1}]}
          device={device}
          isActive={true}
          ref={webcamRef}
          photo={true}
          video={true}
        />
      )}

      {/* Overlay Image Screen */}
      <View
        key="imageContain"
        style={[
          styles.overlayContainer,
          {position: 'absolute', top: 0, left: 0, zIndex: 1},
        ]}>
        <Image
          key="overlayImage"
          source={overlayImage}
          style={styles.overlayImage}
          resizeMode="cover"
        />
      </View>

      {/* Header Component */}

      <View key="topContent" style={styles.topContent}>
        <Pressable
          key={'gobackButton'}
          onPress={() => {
            skipGuidanceScreens && userStep != 7
              ? goBackUserSteps(2)
              : goBackUserSteps();
          }}
          style={({pressed}) => pressed && styles.opacity}>
          <Icon name="arrow-back" size={30} color={'white'} />
        </Pressable>

        <View key={'con'} style={{alignItems: 'center'}}>
          <Text
            key={'heading1'}
            style={[
              styles.heading,
              globalStyles.textMedium,
              {
                color: getBranding().colors.primary,
              },
            ]}>
            {findOutStepContent()?.heading}
          </Text>
          <Text
            key={'heading2'}
            style={[
              styles.subheading,
              globalStyles.textMedium,
              {color: 'white'},
            ]}>
            {findOutStepContent()?.subHeading}
          </Text>
          <Text
            key={'subtitle'}
            style={[
              styles.subheading,
              globalStyles.textMedium,
              {color: getBranding().colors.primary, marginTop: 30},
            ]}>
            {userStep === 7 ? 'BACK SIDE' : 'FRONT SIDE'}
          </Text>
        </View>

        <Pressable
          key={'info'}
          style={({pressed}) => pressed && styles.opacity}>
          <Icon
            name="information-circle-outline"
            size={30}
            style={{opacity: 0}}
          />
        </Pressable>
      </View>

      {/* Footer Component */}

      <View
        key="bottomContent"
        style={[styles.captureButtonContainer, {zIndex: 9999}]}>
        <View style={styles.buttonRow}>
          <View key={'flip'} style={styles.flipButtonWrapper}>
            <FlipButton onClick={flipCamera} />
          </View>
          <View key={'capture'} style={styles.captureButtonWrapper}>
            <CaptureButton onClick={() => handleSingleCapturePhoto(userStep)} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CaptureUserWebcam;
