import axios from "axios";
import { baseURL2 } from "../../utility/data";


export const walletBalance = (id) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/user-wallet-amount/${id}`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const showReferralLink = (id) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-refer-code/${id}`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};



export const referralList = (id) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-refer-list/${id}`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};



export const updateWallet = (data) => {
  const { id, amount } = data;
  const formData = new FormData();
  formData.append("id", id);
  formData.append('amount', amount);

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/update-user-wallet`, formData)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const withdrawalReferral = (formValues, id) => {

  const formData = new FormData();
  formData.append("enter_amount", formValues.amount);
  formData.append("referral_pdf", formValues.ReferralPdf);
  formData.append("id", id);


  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/referWithdrawalAmount`, formData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};




export const redeemCode = (formValues, id) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/getRedeem/${formValues?.redeemCode}/${id}`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};