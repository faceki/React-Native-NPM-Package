import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  getAccessTokenFacekiAPI,
  getKYCRulesAPI,
  postMultiKYCVerificationAPI,
  postSingleKYCVerificationAPI,
} from '../service/facekiAPI';
import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import {HEADINGS, HEADING_TYPE} from '../wrapper/HEADINGS';
import type {PropsWithChildren} from 'react';
import ml from '@react-native-firebase/ml';
import {
  MultiDocumentKYCResponseClass,
  SingleDocumentKYCResponseClass,
} from '../service/types/facekiresponse';
import {Camera} from 'react-native-vision-camera';
import { Branding } from '../service/types/interfaces';
const Resizer = require('@bam.tech/react-native-image-resizer');

type userStepsType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type modeType = 'user' | {exact: 'environment'};

const CONTENT = ['ID Card', 'Passport', 'Driving License'];

type ContentType = (typeof CONTENT)[number];

export type ImgUrlsType = {
  [key in ContentType]: {
    frontImage: {uri: string; path: string};
    backImage: {uri: string; path: string};
    selfie: {uri: string; path: string};
  };
};

// Define the type of the context value
type ContextType = {
  userStep: userStepsType;
  handlerUserSteps: () => void;
  goBackUserSteps: (index?: number) => void;
  HEADINGS: HEADING_TYPE;
  findOutStepContent: () => {
    step: number;
    heading: string;
    subHeading: string;
  };
  selectedOption: string;
  handleOptionChange: (event: string) => void;
  webcamRef: React.MutableRefObject<any | null>;
  handleSingleCapturePhoto: (step: number) => void;
  imgUrls: ImgUrlsType;
  finalResult:
    | {
        heading: string;
        subText: string;
        success: boolean;
      }
    | undefined;
  routeOfHandler: () => void;
  allowedKycDocuments: string[];
  isChecked: boolean;
  handleCheckbox: () => void;
  loading: boolean;
  kycRuleError: boolean;
  allowSingle: boolean;
  skipGuidanceScreens?: boolean;
  consenttermofuseLink?: string;
  skipFirstScreen?: boolean;
  skipResultScreen?: boolean;
  branding?:Branding
  livenessScoreOverride?:number,
  skipFunc?:any,
  resultContent?: {
    success: {
      heading: string;
      subHeading: string;
    };
    fail: {
      heading: string;
      subHeading: string;
    },
    verification:{
      heading: string;
    }
  };
};

type VerificationProviderProps = PropsWithChildren<{
  verification_url:string,
  onError: (
    message:
      | MultiDocumentKYCResponseClass
      | SingleDocumentKYCResponseClass
      | Error,
  ) => void;
  onComplete: (
    message: MultiDocumentKYCResponseClass | SingleDocumentKYCResponseClass,
  ) => void;
  skipGuidanceScreens?: boolean;
  consenttermofuseLink?: string;
  allowSingleOverride?: boolean;
  skipFirstScreen?: boolean;
  skipResultScreen?: boolean;
  resultContent?: {
    success: {
      heading: string;
      subHeading: string;
    },
    fail: {
      heading: string;
      subHeading: string;
    },
    verification:{
      heading: string;
    }
  };
  singleVerificationDoc?: 'Passport' | 'ID Card' | 'Driving License';
  branding?:Branding,
  livenessScoreOverride?:number,
  skipFunc?:any
}>;

// Create the context
const VerificationContext = createContext<ContextType>({} as ContextType);

var RESULTS = [
  {
    success: {
      heading: 'Successful',
      subText: 'Your identity verification successful',
      success: true,
    },
    error: {
      heading: 'Extra Verification Required',
      subText: 'Couldn’t verify your identity, please contact us',
      success: false,
    },
  },
];

export const VerificationProvider: React.FC<VerificationProviderProps> = ({
  children,
  verification_url,
  onError,
  onComplete,
  allowSingleOverride,
  skipGuidanceScreens,
  consenttermofuseLink,
  skipFirstScreen,
  skipResultScreen,
  resultContent,
  singleVerificationDoc,
  branding,
  livenessScoreOverride,
  skipFunc

}) => {
  const [userStep, setUserStep] = useState<userStepsType>(
    skipFirstScreen ? 2 : 1,
  );
  const webcamRef = useRef<any | null>(null);
  const [allowSingle, setAllowSingle] = useState(false);
  const [allowedKycDocuments, setAllowedKycDocuments] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  // const [clientCredentials, setClientCredentials] = useState({
  //   clientId: clientId,
  //   clientSecret: clientSecret,
  // });
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [kycRuleError, setKycRuleError] = useState(false);

  useEffect(() => {
    if (skipFirstScreen) {
      setUserStep(2);
    }
  }, [skipFirstScreen]);

  const handleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const [finalResult, setFinalResult] = useState<{
    heading: string;
    subText: string;
    success: boolean;
  }>();
  const [selectedOption, setSelectedOption] = useState<
    (typeof CONTENT)[number]
  >(CONTENT[0]);
  const [leftOptions, setLeftOptions] = useState<string[]>([]); // options that are left before moving ahead

  const [imgUrls, setImgUrls] = useState<ImgUrlsType>({
    ['ID Card']: {
      frontImage: {uri: '', path: ''},
      backImage: {uri: '', path: ''},
      selfie: {uri: '', path: ''},
    },
    ['Passport']: {
      frontImage: {uri: '', path: ''},
      backImage: {uri: '', path: ''},
      selfie: {uri: '', path: ''},
    },
    ['Driving License']: {
      frontImage: {uri: '', path: ''},
      backImage: {uri: '', path: ''},
      selfie: {uri: '', path: ''},
    },
  });



  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission != 'granted') {
      const newCameraPermission = await Camera.requestCameraPermission();
      if (newCameraPermission === 'denied') await Linking.openSettings();
    }
    return cameraPermission == 'granted';
  };

  useEffect(() => {
    if (!verification_url) {
      console.error('Please provide verification url for to start SDK');
    }
  }, []);



  useEffect(() => {
    async function getKYCRules() {
      try {

        console.log("EHHEre");
        const rules = await getKYCRulesAPI(verification_url);
  
        var {data} = rules;
  
        const rulesRespose = {
          livenessCheckType: data.livenessCheckType,
          multiKYCEnabled: data.multiKYCEnabled,
          successMessage: data.success.message,
          redirectUrl: data.success.redirect_url,
          declinedMessage: data.declined.message,
          declinedUrl: data.declined.redirect_url,
          invalidMessage: data.invalid.message,
          invalidRedirectUrl: data.invalid.redirect_url,
          allowedKYCDocuments: data.allowedKycDocuments,
        };
        setAllowedKycDocuments(data.allowedKycDocuments as string[]);
        if (
          (data.allowSingle || allowSingleOverride) &&
          singleVerificationDoc
        ) {
          setAllowedKycDocuments([singleVerificationDoc]);
          setSelectedOption(singleVerificationDoc);
        }
        if ((data.allowSingle || allowSingleOverride) && skipFirstScreen) {
          setUserStep(2);
        } else if (skipFirstScreen) {
          setUserStep(3);
        }
        // If Not Overwrite
        if (!singleVerificationDoc) {
          setSelectedOption(data.allowedKycDocuments?.[0]);
        }
  
        if (allowSingleOverride) {
          setAllowSingle(allowSingleOverride);
        } else {
          setAllowSingle(data.allowSingle);
        }
        setLoading(false);
  
        const copyLeftOptions = [...data.allowedKycDocuments];
        copyLeftOptions.shift(); // remove first element from an array
        setLeftOptions(copyLeftOptions);
      } catch (err) {
        console.log(err);
        setKycRuleError(true);
      }
    }
    if(verification_url)
    {
      getKYCRules()
    }
  
  }, [verification_url]);

  const handleSingleCapturePhoto = async (step: number,image?:any,refOverride?:any) => {
    const allowedToAccessCamera = await checkCameraPermission();
 
    // if not allowed to access camera dont proceed
    if (!allowedToAccessCamera) {
      return;
    }

    if(!image)
    {
      if(webcamRef.current)
      {
        var imageSrc = await webcamRef?.current?.takePhoto?.({
          enableShutterSound: false,
          enableAutoStabilization: true,
        });
  
  

      }else{
        var imageSrc = await refOverride?.current?.takePhoto?.({
          enableShutterSound: false,
          enableAutoStabilization: true,
        });
  
  
      }

    }else{

      var imageSrc = image
    }
  



    if (imageSrc?.path) {
      if (step === 5) {
        setImgUrls(prev => ({
          ...prev,
          [selectedOption]: {
            ...prev[selectedOption],
            frontImage: imageSrc,
          },
        }));
      }
      if (step === 7) {
        setImgUrls(prev => ({
          ...prev,
          [selectedOption]: {
            ...prev[selectedOption],
            backImage: imageSrc,
          },
        }));
      }

      if (step === 10) {
        try {
          let result = await Resizer.default.createResizedImage(
            (Platform.OS === 'android' ? 'file://' : '') + imageSrc.path,
            1920,
            1080,
            'JPEG',
            100,
            0,
            undefined,
            false,
            {
              mode: 'contain',
              onlyScaleDown: true,
            },
          );
          console.log(result);
          imageSrc = result;
          // setResizedImage(result);
        } catch (error) {
          console.log(error);
          // Alert.alert('Unable to resize the photo');
        }




        setImgUrls(prev => ({
          ...prev,
          [selectedOption]: {
            ...prev[selectedOption],
            selfie: imageSrc,
          },
        }));

        setUserStep(prev => (prev + 1) as userStepsType);
        if (!allowSingle) {
          let Selfie_image = '';
          let id_front_image = '';
          let id_back_image = '';
          let dl_back_image = '';
          let dl_front_image = '';
          let pp_front_image = '';
          let pp_back_image = '';

          const formData = new FormData();

          // add all documents to imgSrc
          await Promise.all(
            allowedKycDocuments.map(async content => {
              if (content === 'ID Card') {
                id_back_image = imgUrls[content].backImage.path;
                id_front_image = imgUrls[content].frontImage.path;
                formData.append('id_back_image', {
                  uri:  Platform.OS == "android" ?  'file://' +  id_back_image :id_back_image ,
                  type: 'image/jpeg',
                  name: `photo_id_back_image.jpg`,
                });
                formData.append('id_front_image', {
                  uri: Platform.OS == "android" ?  'file://' +  id_front_image : id_front_image,
                  type: 'image/jpeg',
                  name: `photo_id_front_image.jpg`,
                });
              }
              if (content === 'Passport') {
                pp_back_image = imgUrls[content].frontImage.path;
                pp_front_image = imgUrls[content].frontImage.path;

                formData.append('pp_back_image', {
                  uri:  Platform.OS == "android" ?  'file://' + pp_back_image :pp_back_image,
                  type: 'image/jpeg',
                  name: `photo_pp_back_image.jpg`,
                });
                formData.append('pp_front_image', {
                  uri:Platform.OS == "android" ?  'file://' + pp_front_image:pp_front_image,
                  type: 'image/jpeg',
                  name: `photo_pp_front_image.jpg`,
                });
              }
              if (content === 'Driving License') {
                dl_back_image = imgUrls[content].backImage.path;
                dl_front_image = imgUrls[content].frontImage.path;
                // const dlBackBlob = await getBlob(dl_back_image);
                // const dlFrontBlob = await getBlob(dl_front_image);

                formData.append('dl_back_image', {
                  uri: Platform.OS == "android" ?  'file://' + `${dl_back_image}` : `${dl_back_image}`,
                  type: 'image/jpeg',
                  name: `photo_dl_back_image.jpg`,
                });
                formData.append('dl_front_image', {
                  uri: Platform.OS == "android" ?  'file://' + `${dl_front_image}`: `${dl_front_image}`,
                  type: 'image/jpeg',
                  name: `photo_dl_front_image.jpg`,
                });
              }
            }),
          );

          Selfie_image = imageSrc.path;
          // const selfieBlob = await getBlob(Selfie_image);

          formData.append('selfie_image', {
            uri: Platform.OS == "android" ?  'file://' + `${Selfie_image}`: `${Selfie_image}`,
            type: 'image/jpeg',
            name: `photo_selfie_image.jpg`,
          });

          try {
            formData.append("link", verification_url);

            const response = await postMultiKYCVerificationAPI(formData);
            // console.log({response});
            if (response?.responseCode === 0) {
              let responseWithType = Object.assign(
                new MultiDocumentKYCResponseClass(),
                response,
              );

              onComplete && onComplete(responseWithType);
              if (resultContent) {
                let result = RESULTS[0].success;
                result.heading = resultContent.success.heading;
                result.subText = resultContent.success.subHeading;
                setFinalResult(result);
              } else {
                setFinalResult(RESULTS[0].success);
              }

              setUserStep(prev => (prev + 1) as userStepsType);
            } else {
              if (resultContent) {
                let result = RESULTS[0].error;
                result.heading = resultContent.fail.heading;
                result.subText = resultContent.fail.subHeading;
                setFinalResult(result);
              } else {
                setFinalResult(RESULTS[0].error);
              }
              onError && onError(response);
              setUserStep(prev => (prev + 1) as userStepsType);
            }
          } catch (err) {
            onError && onError(err as Error);

            if (resultContent) {
              let result = RESULTS[0].error;
              result.heading = resultContent.fail.heading;
              result.subText = resultContent.fail.subHeading;
              setFinalResult(result);
            } else {
              setFinalResult(RESULTS[0].error);
            }
            setUserStep(prev => (prev + 1) as userStepsType);
          }
        } else {
          const formData = new FormData();
          formData.append('doc_front_image', {
            uri: Platform.OS == "android" ?  'file://' +  imgUrls[selectedOption]?.frontImage?.path : imgUrls[selectedOption]?.frontImage?.path,
            type: 'image/jpeg',
            name: `photo_front_image.jpg`,
          });
          if (selectedOption != 'Passport') {
            formData.append('doc_back_image', {
              uri: Platform.OS == "android" ?  'file://' +  imgUrls[selectedOption]?.backImage?.path: imgUrls[selectedOption]?.backImage?.path,
              type: 'image/jpeg',
              name: `photo_front_image.jpg`,
            });
          } else {
            formData.append('doc_back_image', {
              uri: Platform.OS == "android" ?  'file://' + imgUrls[selectedOption]?.frontImage?.path :  imgUrls[selectedOption]?.frontImage?.path,
              type: 'image/jpeg',
              name: `photo_front_image.jpg`,
            });
          }
          var Selfie_image = imageSrc.path;
          formData.append('selfie_image', {
            uri: Platform.OS == "android" ?  'file://' +`${Selfie_image}` :`${Selfie_image}` ,
            type: 'image/jpeg',
            name: `photo_selfie_image.jpg`,
          });

          if(selectedOption)
          {
            formData.append("selectedDoc",selectedOption)
          }
          formData.append("link", verification_url);

          try {
            // get token always incase token expires
     
            const response = await postSingleKYCVerificationAPI(formData);
            if (response?.responseCode === 0) {
              let responseWithType = Object.assign(
                new SingleDocumentKYCResponseClass(),
                response,
              );

              onComplete && onComplete(responseWithType);

              if (resultContent) {
                let result = RESULTS[0].success;
                result.heading = resultContent.success.heading;
                result.subText = resultContent.success.subHeading;
                setFinalResult(result);
              } else {
                setFinalResult(RESULTS[0].success);
              }
              if (!skipResultScreen) {
                setUserStep(prev => (prev + 1) as userStepsType);
              } else {
                console.log('Skipped Success');
              }
            } else {
              if (resultContent) {
                let result = RESULTS[0].error;
                result.heading = resultContent.fail.heading;
                result.subText = resultContent.fail.subHeading;
                setFinalResult(result);
              } else {
                setFinalResult(RESULTS[0].error);
              }
              onError && onError(response);
              setUserStep(prev => (prev + 1) as userStepsType);
            }
          } catch (err) {
            onError && onError(err as Error);
            if (resultContent) {
              let result = RESULTS[0].error;
              result.heading = resultContent.fail.heading;
              result.subText = resultContent.fail.subHeading;
              setFinalResult(result);
            } else {
              setFinalResult(RESULTS[0].error);
            }
            if (!skipResultScreen) {
              setUserStep(prev => (prev + 1) as userStepsType);
            } else {
              console.log('Skipped Error');
            }
          }
        }

        return;
      }
      if([5,7,10].includes(step))
      {
        setUserStep(prev => prev == step ?  (prev + 1) as userStepsType : prev);

      }
    }
  };

  const handlerUserSteps = () => {
    if (loading && userStep == 1) {
      return;
    }
    if ([3, 8].includes(userStep) && skipGuidanceScreens) {
      setUserStep(prev => (prev + 2) as userStepsType);
      return;
    }

    if (!allowSingle && userStep === 1) {
      setUserStep(prev => (prev + 2) as userStepsType);
      return;
    }
    if (userStep === 2) {
      if (loading || kycRuleError) {
        Alert.alert('Please select kyc type', '', [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'OK', onPress: () => {}},
        ]);
        return;
      }
    }
    if (userStep === 3) {
      if (!isChecked) {
        Alert.alert('Please agree to terms and conditions', '', [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'OK', onPress: () => {}},
        ]);
        return;
      }
    }

    setUserStep(prev => (prev + 1) as userStepsType);
  };

  const routeOfHandler = () => {

    if (userStep === 6 && selectedOption === 'Passport') {
      setUserStep(prev => (prev + 1) as userStepsType);
      moveForwardonlyIfNoLeftOption();
    }

    if (userStep === 8) {
      moveForwardonlyIfNoLeftOption();
    } else {
      handlerUserSteps();
    }
  };

  const moveForwardonlyIfNoLeftOption = () => {
    if (leftOptions.length === 0 || allowSingle) {
      if (skipGuidanceScreens) {
        setUserStep(prev => (prev + 2) as userStepsType);
      } else {
        setUserStep(prev => (prev + 1) as userStepsType);
      }
      return;
    }
    setUserStep(prev => (prev - 3) as userStepsType);

    // make the left option to be selected
    setSelectedOption(leftOptions[0]);

    // remove left option
    const copyLeftOptions = [...leftOptions];
    copyLeftOptions.shift();
    setLeftOptions(copyLeftOptions);
  };

  const goBackUserSteps = (index?: number) => {
    setUserStep((prev: any) => {
      if (index) {
        return (prev - index) as userStepsType;
      } else {
        return (prev - 1) as userStepsType;
      }
    });
  };

  // Function for getting Content
  const findOutStepContent = () => {
    if (userStep === 4 || userStep === 5 || userStep === 6 || userStep === 7) {
      const data = HEADINGS.filter(heading => heading.step === userStep)[0];
      const newData = {...data};
      newData.heading = `${newData.heading} ${selectedOption}`;
      return newData;
    }
    return HEADINGS.filter(heading => heading.step === userStep)[0];
  };

  // Function for selecting document
  const handleOptionChange = (event: string) => {
    setSelectedOption(event);

    const targetIndex = allowedKycDocuments.indexOf(event);

    const copyLeftOptions = [...allowedKycDocuments];

    // sort them based on new selection
    if (targetIndex !== -1) {
      copyLeftOptions.sort((a, b) => {
        if (a === event) {
          return -1; // a should come before b
        } else if (b === event) {
          return 1; // b should come before a
        } else {
          return 0; // leave the order unchanged
        }
      });
    }

    copyLeftOptions.shift();
    setLoading(false);
    // copyLeftOptions.shift(); // remove first element from an array
    setLeftOptions(copyLeftOptions);
  };

  return (
    <VerificationContext.Provider
      value={{
        userStep,
        handlerUserSteps,
        goBackUserSteps,
        HEADINGS,
        findOutStepContent,
        selectedOption,
        handleOptionChange,
        allowedKycDocuments,
        handleSingleCapturePhoto,
        webcamRef,
        imgUrls,
        finalResult,
        routeOfHandler,
        isChecked,
        handleCheckbox,
        loading,
        kycRuleError,
        skipGuidanceScreens,
        allowSingle,
        consenttermofuseLink,
        skipFirstScreen,
        branding,
        resultContent,
        livenessScoreOverride,
        skipFunc

      }}>
      {children}
    </VerificationContext.Provider>
  );
};

export const useMyStepsVerification = () => useContext(VerificationContext);
