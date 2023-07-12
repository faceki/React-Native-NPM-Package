import {useColorScheme, ScrollView} from 'react-native';
import React from 'react';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Footer from '../components/footer/footer.component';
import Header from '../components/header/header.component';
import {useMyStepsVerification} from '../provider/verification.context';
import CustomCarousel from '../components/carousel/carousel.component';
import KYCForm from '../components/KYC-form/KYC-form.component';
import {styles} from './styles';
import RequirementsDocuments from '../components/requirements-documents/requirements-documents';
import CaptureUserWebcam from '../components/capture-user-webcam/capture-user-webcam.component';
import PassportPhotoGuide from '../components/passport-photo-guide/passport-photo-guide';
import ClarityCheck from '../components/clarity-check/clarity-check.component';
import SelfieGuide from '../components/selfie-guide/selfie-guide.component';
import CaptureSelfie from '../components/capture-selfie/capture-selfie.component';
import Loading from '../components/loading/loading.component';
import Confirmation from '../components/confirmation/confirmation.component';
import {SlideType} from '../../App';

type props = {
  slides?: SlideType[];
  logoURL?: string;
  loadingURL?: string;
};

/**
 * Renders a slideshow with a series of verification steps.
 *
 * @param {Object} props - The component props.
 * @param {Array<string>} props.slides - An array of image URLs to display in the slideshow.
 * @param {string} props.logoURL - The URL of the logo to display in the footer.
 * @param {string} props.loadingURL - The URL of the logo to display in the loading screen.
 * @returns {JSX.Element} - The rendered component as a JSX element.
 */

const CarouselWrapper = ({slides, logoURL, loadingURL}: props) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const {
    handlerUserSteps,
    userStep,
    isChecked,
    handleCheckbox,
    cameraMode,
    flipCamera,
    webcamRef,
    handleSingleCapturePhoto,
    findOutStepContent,
    goBackUserSteps,
    imgUrls,
    selectedOption,
    handleOptionChange,
    routeOfHandler,
    allowedKycDocuments,
    finalResult,
    loading,
    kycRuleError,
    selfiecameraMode,
    flipSelfieCamera,
  } = useMyStepsVerification();

  const content = (userStep: number) => {
    // show content based on user step
    switch (userStep) {
      case 1:
        return <CustomCarousel slides={slides} />;
      case 2:
        return (
          <KYCForm
            handleOptionChange={handleOptionChange}
            allowedKycDocuments={allowedKycDocuments}
            loading={loading}
            kycRuleError={kycRuleError}
          />
        );
      case 3:
        return (
          <RequirementsDocuments
            isChecked={isChecked}
            handleCheckbox={handleCheckbox}
            selectedOption={selectedOption}
          />
        );
      case 4:
        return <PassportPhotoGuide />;
      case 5:
        return (
          <CaptureUserWebcam
            cameraMode={cameraMode}
            flipCamera={flipCamera}
            webcamRef={webcamRef}
            handleSingleCapturePhoto={handleSingleCapturePhoto}
            userStep={userStep}
          />
        );
      case 6:
        return (
          <ClarityCheck
            imgUrls={imgUrls}
            selectedOption={selectedOption}
            routeOfHandler={routeOfHandler}
            goBackUserSteps={goBackUserSteps}
            userStep={userStep}
          />
        );

      case 7:
        return (
          <CaptureUserWebcam
            cameraMode={cameraMode}
            flipCamera={flipCamera}
            webcamRef={webcamRef}
            handleSingleCapturePhoto={handleSingleCapturePhoto}
            userStep={userStep}
          />
        );

      case 8:
        return (
          <ClarityCheck
            imgUrls={imgUrls}
            selectedOption={selectedOption}
            routeOfHandler={routeOfHandler}
            goBackUserSteps={goBackUserSteps}
            userStep={userStep}
          />
        );
      case 9:
        return <SelfieGuide />;
      case 10:
        return (
          <CaptureSelfie
            webcamRef={webcamRef}
            cameraMode={selfiecameraMode}
            userStep={userStep}
            findOutStepContent={findOutStepContent}
            goBackUserSteps={goBackUserSteps}
            buttonText={buttonText}
            handlerUserSteps={handlerUserSteps}
            flipCamera={flipSelfieCamera}
            handleSingleCapturePhoto={handleSingleCapturePhoto}
          />
        );
      case 11:
        return <Loading loadingURL={loadingURL} />;

      case 12:
        return <Confirmation finalResult={finalResult} />;

      default:
        return <CustomCarousel slides={slides} />;
    }
  };

  const buttonText = (userStep: number) => {
    // changes based on steps
    switch (userStep) {
      case 1:
        return 'Next';
      case 2:
        return 'Next';
      case 3:
        return 'Start';
      case 4:
        return 'I’m Ready';
      default:
        return undefined;
      case 9:
        return 'I’m Ready';
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[backgroundStyle]}
      contentContainerStyle={
        userStep !== 10 && userStep !== 11
          ? styles.mainContainer
          : styles.cameraContainer
      }>
      <Header
        userStep={userStep}
        findOutStepContent={findOutStepContent}
        goBackUserSteps={goBackUserSteps}
      />
      {content(userStep)}
      <Footer
        onPress={handlerUserSteps}
        buttonText={buttonText}
        userStep={userStep}
        logoURL={logoURL}
      />
    </ScrollView>
  );
};

export default CarouselWrapper;
