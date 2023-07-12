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
} from '../service/facekiAPI';
import {CameraType} from 'react-native-camera-kit';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {HEADINGS, HEADING_TYPE} from '../wrapper/HEADINGS';
import type {PropsWithChildren} from 'react';

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
  goBackUserSteps: () => void;
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
        icon: string;
        heading: string;
        subText: string;
        success: boolean;
      }
    | undefined;
  flipCamera: () => void;
  cameraMode: CameraType;
  routeOfHandler: () => void;
  allowedKycDocuments: string[];
  isChecked: boolean;
  handleCheckbox: () => void;
  initializeClientIdAndSecret: (clientId: string, clientSecret: string) => void;
  loading: boolean;
  kycRuleError: boolean;
  selfiecameraMode: CameraType;
  flipSelfieCamera: () => void;
};

type VerificationProviderProps = PropsWithChildren<{
  clientId: string;
  clientSecret: string;
  onError: (message: Error) => void;
  onComplete: (message: string) => void;
}>;

// Create the context
const VerificationContext = createContext<ContextType>({} as ContextType);

const RESULTS = [
  {
    success: {
      icon: 'checkcircleo',
      heading: 'Successful',
      subText: 'Your ID verification successful, thank you for using Faceki',
      success: true,
    },
    error: {
      icon: 'exclamationcircleo',
      heading: 'Extra Verification Required',
      subText:
        'Couldn’t verify your identity, Please contact us on info@faceki.com',
      success: false,
    },
  },
];

// Create a provider component to wrap the components that need access to the context
export const VerificationProvider: React.FC<VerificationProviderProps> = ({
  children,
  clientId,
  clientSecret,
  onError,
  onComplete,
}) => {
  const [userStep, setUserStep] = useState<userStepsType>(1);
  const webcamRef = useRef<any | null>(null);
  const [allowedKycDocuments, setAllowedKycDocuments] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [clientCredentials, setClientCredentials] = useState({
    clientId: clientId,
    clientSecret: clientSecret,
  });
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [kycRuleError, setKycRuleError] = useState(false);

  const handleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const [finalResult, setFinalResult] = useState<{
    icon: string;
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

  // camera mode front or back
  const [cameraMode, setCameraMode] = useState(CameraType.Back);

  // camera mode for selfie front or back
  const [selfiecameraMode, setSelfiecameraMode] = useState(CameraType.Front);

  const flipCamera = () => {
    if (cameraMode === CameraType.Front) {
      setCameraMode(CameraType.Back);
    } else {
      setCameraMode(CameraType.Front);
    }
  };

  const flipSelfieCamera = () => {
    if (selfiecameraMode === CameraType.Front) {
      setSelfiecameraMode(CameraType.Back);
    } else {
      setSelfiecameraMode(CameraType.Front);
    }
  };

  const initializeClientIdAndSecret = (
    clientId: string,
    clientSecret: string,
  ) => {
    // function to be called by client library
    setClientCredentials(prev => ({
      ...prev,
      clientId,
      clientSecret,
    }));
  };

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // console.log('You can use the camera');
        } else {
          // console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const requestCameraPermissionIos = async () => {
      try {
        // const isUserAuthorizedCamera = await request(PERMISSIONS.IOS.CAMERA);

        const isUserAuthorizedCamera = 'granted';

        if (isUserAuthorizedCamera === 'granted') {
          // console.log('User is authorized');
        } else {
          // console.log('USer isnot auhtorized');
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (Platform.OS === 'android') {
      requestCameraPermission();
    } else {
      requestCameraPermissionIos();
    }
  }, []);

  const checkAndroidPermission = async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      return granted;
    } catch (error) {
      console.log('Error checking camera permission:', error);
      return false;
    }
  };

  const checkIosPermission = async (): Promise<boolean> => {
    try {
      // ios will be checked by the client app
      const isCameraAuthorized = 'granted';
      return isCameraAuthorized === 'granted';
    } catch (err) {
      console.log('Error checking camera permission:', err);
      return false;
    }
  };

  async function checkCameraPermission(): Promise<boolean> {
    let result = false;
    if (Platform.OS === 'android') {
      result = await checkAndroidPermission();
    }

    if (Platform.OS === 'ios') {
      result = await checkIosPermission();
    }

    if (result) {
      // console.log('Camera permission is granted');
    } else {
      Alert.alert(
        'Camera permission isnot granted',
        'Go to app settings, select "Permissions", and toggle the switch for "Camera" to the "On" position',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'OK', onPress: () => {}},
        ],
      );
    }

    return result;
  }

  useEffect(() => {
    // ADD
    // initializeClientIdAndSecret(
    //   '43se7r1n0vd6muo2ua7la3a1ib',
    //   'faevv80ms370h9i2cmi5mg818m8man1itrlpvnbtfu20ajntfg1',
    // );

    if (!clientCredentials?.clientId) {
      console.error('Please provide client id and secret for faceki kyc');
    }
  }, []);

  async function getToken() {
    try {
      const newToken = await getAccessTokenFacekiAPI(
        clientCredentials.clientId,
        clientCredentials.clientSecret,
      );

      setToken(newToken);
    } catch (err) {
      console.log(err);
    }
  }

  async function getTokenWithoutGettingRules() {
    // used to refresh the token so token hasnot expired
    try {
      await getAccessTokenFacekiAPI(
        clientCredentials.clientId,
        clientCredentials.clientSecret,
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  useEffect(() => {
    if (clientCredentials.clientId) {
      getToken();
    }
  }, [clientCredentials]);

  useEffect(() => {
    async function getKYCRules() {
      try {
        const rules = await getKYCRulesAPI();

        const {data} = rules;
        // Some of the important data you might need from rules :)
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

        setLoading(false);

        setSelectedOption(data.allowedKycDocuments?.[0]);

        const copyLeftOptions = [...data.allowedKycDocuments];
        copyLeftOptions.shift(); // remove first element from an array
        setLeftOptions(copyLeftOptions);
      } catch (err) {
        console.log(err);
        setKycRuleError(true);
      }
    }

    if (token) {
      getKYCRules();
    }
  }, [token]);

  const handleSingleCapturePhoto = async (step: number) => {
    const allowedToAccessCamera = await checkCameraPermission();

    // if not allowed to access camera dont proceed
    if (!allowedToAccessCamera) {
      return;
    }
    const imageSrc = await webcamRef?.current?.capture?.();

    // once user finishes once
    // it will ask for second item in allowedKycDocuments
    // will not move forward until all the items asked are clear
    // we need to know if user is in the

    if (imageSrc.uri) {
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
        setImgUrls(prev => ({
          ...prev,
          [selectedOption]: {
            ...prev[selectedOption],
            selfie: imageSrc,
          },
        }));

        setUserStep(prev => (prev + 1) as userStepsType);
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
              id_back_image = imgUrls[content].backImage.uri;
              id_front_image = imgUrls[content].frontImage.uri;
              formData.append('id_back_image', {
                uri: id_back_image,
                type: 'image/jpeg',
                name: `photo_id_back_image.jpg`,
              });
              formData.append('id_front_image', {
                uri: id_front_image,
                type: 'image/jpeg',
                name: `photo_id_front_image.jpg`,
              });
            }
            if (content === 'Passport') {
              pp_back_image = imgUrls[content].frontImage.uri;
              pp_front_image = imgUrls[content].frontImage.uri;

              formData.append('pp_back_image', {
                uri: pp_back_image,
                type: 'image/jpeg',
                name: `photo_pp_back_image.jpg`,
              });
              formData.append('pp_front_image', {
                uri: pp_front_image,
                type: 'image/jpeg',
                name: `photo_pp_front_image.jpg`,
              });
            }
            if (content === 'Driving License') {
              dl_back_image = imgUrls[content].backImage.uri;
              dl_front_image = imgUrls[content].frontImage.uri;
              // const dlBackBlob = await getBlob(dl_back_image);
              // const dlFrontBlob = await getBlob(dl_front_image);

              formData.append('dl_back_image', {
                uri: `${dl_back_image}`,
                type: 'image/jpeg',
                name: `photo_dl_back_image.jpg`,
              });
              formData.append('dl_front_image', {
                uri: `${dl_front_image}`,
                type: 'image/jpeg',
                name: `photo_dl_front_image.jpg`,
              });
            }
          }),
        );

        Selfie_image = imageSrc.uri;
        // const selfieBlob = await getBlob(Selfie_image);

        formData.append('selfie_image', {
          uri: `${Selfie_image}`,
          type: 'image/jpeg',
          name: `photo_selfie_image.jpg`,
        });

        try {
          // get token always incase token expires
          await getTokenWithoutGettingRules();

          const response = await postMultiKYCVerificationAPI(formData);
          // console.log({response});
          if (response?.responseCode === 0) {
            onComplete && onComplete(response);
            setFinalResult(RESULTS[0].success);
            setUserStep(prev => (prev + 1) as userStepsType);
          } else {
            setFinalResult(RESULTS[0].error);
            onError && onError(response);
            setUserStep(prev => (prev + 1) as userStepsType);
          }
        } catch (err) {
          onError && onError(err as Error);

          setFinalResult(RESULTS[0].error);
          setUserStep(prev => (prev + 1) as userStepsType);
        }
        return;
      }

      setUserStep(prev => (prev + 1) as userStepsType);
    }
  };

  // business logic
  const handlerUserSteps = () => {
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
    if (leftOptions.length === 0) {
      setUserStep(prev => (prev + 1) as userStepsType);
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

  const goBackUserSteps = () => {
    setUserStep(prev => (prev - 1) as userStepsType);
  };

  const findOutStepContent = () => {
    if (userStep === 4 || userStep === 5 || userStep === 6 || userStep === 7) {
      const data = HEADINGS.filter(heading => heading.step === userStep)[0];
      const newData = {...data};
      newData.heading = `${newData.heading} ${selectedOption}`;
      return newData;
    }
    return HEADINGS.filter(heading => heading.step === userStep)[0];
  };

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
        flipCamera,
        cameraMode,
        routeOfHandler,
        isChecked,
        handleCheckbox,
        initializeClientIdAndSecret,
        loading,
        kycRuleError,
        selfiecameraMode,
        flipSelfieCamera,
      }}>
      {children}
    </VerificationContext.Provider>
  );
};

// Create a custom hook to access the context value
export const useMyStepsVerification = () => useContext(VerificationContext);
