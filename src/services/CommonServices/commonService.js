import axios from "axios";
import { baseURL2 } from "../../utility/data";


export const getLanguages = (lang) => {
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/translates/${lang}`,)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };