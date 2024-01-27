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
