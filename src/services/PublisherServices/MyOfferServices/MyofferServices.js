import axios from "axios";
import { baseURL2 } from "../../../utility/data";



export const categoryofferList = (accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }

  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-portal-category`, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const addPublisherOffer = (formValues, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  const formData = new FormData();
  formData.append("price", formValues?.price);
  formData.append("category", formValues?.category);
  formData.append("language", formValues?.language);
  formData.append("type_of_anchor", formValues?.typeofAnchors);
  formData.append("max_links", formValues?.maxLinks);
  formData.append("nofollow", formValues?.Nofollow);
  formData.append("contact_email", formValues?.contactMail);
  formData.append("Article_goes_home_page", formValues?.ArticleGoesToHomepage);
  formData.append("no_of_days", formValues?.numberOfDays);
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
  // formData.append("publisher_id", id);
  formData.append("domain", formValues?.enterDomain);
  formData.append("crypto", formValues?.acceptsCrypto);


  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/add-offer`, formData, {headers})
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const listoffer = (accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-offer-list`, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const viewUpdateoffer = (id, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-view-offer/${id}`, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};



export const updatePublisherOffer = (formValues, domainId, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  const formData = new FormData();
  formData.append("price", formValues?.price);
  formData.append("category", formValues?.category);
  formData.append("language", formValues?.language);
  formData.append("type_of_anchor", formValues?.typeofAnchors);
  formData.append("max_links", formValues?.maxLinks);
  formData.append("nofollow", formValues?.Nofollow);
  formData.append("contact_email", formValues?.contactMail);
  formData.append("contact_phone", formValues?.contactPhone);
  formData.append("Article_goes_home_page", formValues?.ArticleGoesToHomepage);
  formData.append("no_of_days", formValues?.numberOfDays);
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
  // formData.append("publisher_id", id);
  formData.append("domain_id", domainId);
  formData.append("domain", formValues?.enterDomain);
  formData.append("crypto", formValues?.acceptsCrypto);


  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/update-offer`, formData, {headers})
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const viewOffer = (DomainUrl, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  const formData = new FormData();
    formData.append("url", DomainUrl);

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/view-all-offer`, formData, {headers})
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};