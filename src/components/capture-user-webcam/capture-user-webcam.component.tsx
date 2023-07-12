import {Text, View, Pressable} from 'react-native';
import React, {useRef} from 'react';
import {styles} from './styles';
import {Camera, CameraType} from 'react-native-camera-kit';

import {globalStyles} from '../../../globalStyles';
import CaptureButton from '../../design-system/capture-button/capture-button.component';
import FlipButton from '../../design-system/flip-button/flip-button.component';

type props = {
  cameraMode: CameraType;
  flipCamera: () => void;
  webcamRef: React.MutableRefObject<any>;
  handleSingleCapturePhoto: (step: number) => void;
  userStep: number;
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

const CaptureUserWebcam = ({
  cameraMode,
  flipCamera,
  webcamRef,
  handleSingleCapturePhoto,
  userStep,
}: props) => {
  return (
    <View style={styles.column}>
      <View style={styles.brick}>
        <Text style={[styles.brickText, globalStyles.textMedium]}>
          {userStep === 7 ? 'BACK SIDE' : 'FRONT SIDE'}
        </Text>
      </View>
      <View style={styles.borderCamera}>
        <Camera style={styles.border} ref={webcamRef} cameraType={cameraMode} />
      </View>
      <View style={styles.cameraSubtitles}>
        <Text style={[styles.heading, globalStyles.textRegular]}>
          We'll ask you to enable camera access
        </Text>
        <Text style={[styles.subheading, globalStyles.textRegular]}>
          More about verification
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.center}>
          <FlipButton onClick={flipCamera} />
        </View>
        <CaptureButton onClick={() => handleSingleCapturePhoto(userStep)} />

        <View style={styles.right} />
      </View>
    </View>
  );
};

export default CaptureUserWebcam;
