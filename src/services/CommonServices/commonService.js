import axios from "axios";
import { baseURL2 } from "../../utility/data";


export const getLanguages = (lang) => {
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/translates/${lang ? lang : "pl"}`,)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };


 // Update language when user chnage language
export const updateLanguages = (data, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  const { id, language } = data;
  const formData = new FormData();
  formData.append("id", id);
  formData.append('language', language);

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/update-language`, formData, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};
