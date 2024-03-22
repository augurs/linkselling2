import axios from "axios";
import { baseURL2 } from "../../utility/data";


export const walletBalance = (accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/user-wallet-amount`, { headers })
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const showReferralLink = (accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-refer-code`, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};



export const referralList = (accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-refer-list`, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};



export const updateWallet = (amount, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  const formData = new FormData();
  formData.append('amount', amount);

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/update-user-wallet`, formData, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const withdrawalReferral = (formValues, accessToken) => {

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'multipart/form-data'
  }

  const formData = new FormData();
  formData.append("enter_amount", formValues.amount);
  formData.append("referral_pdf", formValues.ReferralPdf);


  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/referWithdrawalAmount`, formData, {headers})
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};




export const redeemCode = (formValues, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'multipart/form-data'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/getRedeem/${formValues?.redeemCode}`, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};