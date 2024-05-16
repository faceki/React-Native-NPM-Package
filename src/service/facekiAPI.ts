import api from './axios';

// more pages in this api

export const getAccessTokenFacekiAPI = async (
  clientId: string,
  clientSecret: string,
) => {
  // https://kycdocv2.faceki.com/api-integration/verification-apis/generate-token
  try {
    const response = await api.get(
      `/auth/api/access-token?clientId=${clientId}&clientSecret=${clientSecret}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    const access_token = response?.data?.data?.access_token;
    // set the header token
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    return access_token;
  } catch (err) {
    console.log('getAccessTokenFacekiAPI', err);
    throw err;
  }
};



export const getKYCRulesAPI = async (url:any) => {
   
  return await  api.get('/kycverify/api/kycverify/validate-kyc-verify-link',{
    params:{url}
  }).then((res) => res.data).catch((err) => {
    return err.message;
  });
};

export const postMultiKYCVerificationAPI = async (body: FormData) => {
  try {

    const response = await api.post(
      `/kycverify/api/kycverify/multiple-kyc-verification`,
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response?.data;
  } catch (err) {
    const error = err as unknown as Error;
    console.log(error, error.name, error.message);
    throw err;
  }
};

export const postSingleKYCVerificationAPI = async (body: FormData) => {
  try {

    const response = await api.post(
      `/kycverify/api/kycverify/request-kyc`,
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response?.data;
  } catch (err) {
    console.log(err)
    const error = err as unknown as Error;
    console.log(error, error.name, error.message);
    throw err;
  }
};

