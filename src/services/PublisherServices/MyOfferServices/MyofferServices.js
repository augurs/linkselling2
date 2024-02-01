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


export const addPublisherOffer = (formValues, id) => {
  const formData = new FormData();
  formData.append("price", formValues?.price);
  formData.append("category", formValues?.category);
  formData.append("language", formValues?.language);
  formData.append("type_of_anchor", formValues?.typeofAnchors);
  formData.append("max_links", formValues?.maxLinks);
  formData.append("nofollow", formValues?.Nofollow);
  formData.append("contact_email", formValues?.contactMail);
  formData.append("contact_phone", formValues?.contactPhone);
  formData.append("article_max_length", formValues?.articleMaxLength);
  formData.append("article_min_length", formValues?.articleMinLength);
  formData.append("casino_fee", formValues?.acceptsCasino);
  formData.append("gambling", formValues?.acceptsGambling);
  formData.append("loan", formValues?.acceptsLoan);
  formData.append("erotic", formValues?.acceptsErotic);
  formData.append("dating", formValues?.acceptsDating);
  formData.append("cbd", formValues?.acceptsCBD);
  formData.append("medic", formValues?.acceptsMedic);
  formData.append("lead_length", formValues?.leadLength);
  formData.append("publisher_id", id);
  formData.append("domain_id", formValues?.enterDomain);
  formData.append("crypto", formValues?.acceptsCrypto);


  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/add-offer`, formData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const listoffer = (id) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-offer-list/${id}`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};