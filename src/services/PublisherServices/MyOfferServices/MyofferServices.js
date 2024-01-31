import axios from "axios";
import { baseURL2 } from "../../../utility/data";



  export const categoryofferList = () => {
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/get-portal-category`)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };


  export const addPublisherOffer = (formValues, id, lang) => {
    console.log(formValues, "85");
    const formData = new FormData();
    formData.append("url", formValues?.enterUrl);
    formData.append("publisher_id", id);
    formData.append("language", lang);
  
    return axios
      .post(`${baseURL2}/LinkSellingSystem/public/api/add-domain`, formData)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };