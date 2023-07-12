import App from './App';
import {
  useMyStepsVerification,
  VerificationProvider,
} from './src/provider/verification.context';

export {useMyStepsVerification, VerificationProvider};

// wrap the app
// <VerificationProvider>
// // ...
// </VerificationProvider>

export default App;
