export class VerificationResultClass {
    constructor(public passed: boolean, public result: ResultClass) {}
  }
  
  export class ResultClass {
    constructor(public face: boolean, public notexpired: boolean) {}
  }
  
  
  
  export class FaceDataClass {
    constructor(public isIdentical: boolean, public confidence: number) {}
  }
  
  export class ConfidenceDataClass {
    constructor(
      public backSideId: number,
      public issuerOrg_full: number,
      public issuerOrg_iso2: number,
      public issuerOrg_iso3: number,
      public document: number,
      public documentName: number,
      public documentNumber: number,
      public documentSide: number,
      public documentType: number,
      public face: number,
      public face0: number,
      public firstName: number,
      public fullName: number,
      public internalId: number,
      public lastName: number,
      public middleName: number,
      public nationality_full: number,
      public reverseId: number,
      public signature: number,
      public signature0: number
    ) {}
  }
   
  export class AuthenticationBreakdownClass {
    constructor(
      public recapture_check: { passed: boolean },
      public data_visibility: { passed: boolean },
      public image_quality: { passed: boolean },
      public feature_referencing: { passed: boolean },
      public exif_check: { passed: boolean },
      public publicity_check: { passed: boolean },
      public text_analysis: { passed: boolean },
      public biometric_analysis: { passed: boolean },
      public security_feature_check: { passed: boolean }
    ) {}
  }
  
  export class VerificationDataClass {
    constructor(
      public verification: VerificationResultClass,
      public face: FaceDataClass,
      public confidence: ConfidenceDataClass,
      public result: ConfidenceDataClass,
      public authentication: AuthenticationBreakdownClass,
      public aml: any[], // You can replace 'any' with a more specific type if available
      public responseID: string,
      public requestId:string,
      public images: {
        doc_front_image: string;
        doc_back_image: string;
        selfie_image: string;
      }
    ) {}
  }
  
  export class KYCDataClass {
    constructor(public responseCode: number, public data: VerificationDataClass) {}
  }
  
  export class SingleDocumentKYCResponseClass {
    type!: 'SingleDocumentKYCResponse';
    data!: VerificationDataClass;
    responseCode!: number;
  
   
  }
  
  export class MultiDocumentKYCResponseClass {
    type!: 'MultiDocumentKYCResponse';
    data!: {
      requestId: string;
      ppKycData?: KYCDataClass;
      dlKycData?: KYCDataClass;
      idKycData?: KYCDataClass;
    };
    responseCode!: number;
  
  
  }