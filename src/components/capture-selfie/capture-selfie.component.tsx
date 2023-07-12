import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Camera, CameraType} from 'react-native-camera-kit';
import {styles} from './styles';
import Header from '../header/header.component';
import Footer from '../footer/footer.component';
import CaptureButton from '../../design-system/capture-button/capture-button.component';
import FlipButton from '../../design-system/flip-button/flip-button.component';
import {globalStyles} from '../../../globalStyles';

type props = {
  webcamRef: React.MutableRefObject<any>;
  cameraMode: CameraType;
  userStep: number;
  findOutStepContent: () => {
    step: number;
    heading: string;
    subHeading: string;
  };
  goBackUserSteps: () => void;
  handlerUserSteps: () => void;
  buttonText: (userStep: number) => any;
  handleSingleCapturePhoto: (step: number) => void;
  flipCamera: () => void;
};

/**
 * A component for capturing a selfie using the device's camera.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.webcamRef - A mutable ref object for accessing the camera component.
 * @param {string} props.cameraMode - The type of camera to use (front or back).
 * @param {number} props.userStep - The current step in the user verification process.
 * @param {Function} props.findOutStepContent - A function that returns an object with the heading and subheading text for the current verification step.
 * @param {Function} props.goBackUserSteps - A function that allows the user to go back to the previous verification step.
 * @param {Function} props.handlerUserSteps - A function that handles the user's progress through the verification steps.
 * @param {Function} props.buttonText - A function that returns the text to display on the footer button based on the current verification step.
 * @param {Function} props.handleSingleCapturePhoto - A function that handles capturing a single photo for the current verification step.
 * @param {Function} props.flipCamera - A function that switches between the front and back camera.
 * @returns {JSX.Element} - The rendered component as a JSX element.
 */

const CaptureSelfie = ({
  webcamRef,
  cameraMode,
  userStep,
  findOutStepContent,
  goBackUserSteps,
  handlerUserSteps,
  buttonText,
  handleSingleCapturePhoto,
  flipCamera,
}: props) => {
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={webcamRef} cameraType={cameraMode} />
      <View style={styles.blurredContainer} />
      <View style={[styles.absoluteContainer, StyleSheet.absoluteFill]}>
        <Header
          userStep={2}
          findOutStepContent={findOutStepContent}
          goBackUserSteps={goBackUserSteps}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.footer}>
            <Footer
              onPress={handlerUserSteps}
              buttonText={buttonText}
              userStep={userStep}
            />
          </View>
          <View style={styles.centerContainer}>
            <CaptureButton onClick={() => handleSingleCapturePhoto(userStep)} />
            <Text style={[styles.selfieHeading, globalStyles.textRegular]}>
              Take a selfie
            </Text>
            <Text style={[styles.selfieSubHeading, globalStyles.textMedium]}>
              More about face verification
            </Text>
          </View>
          <View style={styles.right}>
            <FlipButton onClick={flipCamera} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CaptureSelfie;
