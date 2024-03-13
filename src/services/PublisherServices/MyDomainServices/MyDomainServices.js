import axios from "axios";
import { baseURL2 } from "../../../utility/data";



export const listDomain = (accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-publisher-portal`, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};



export const addDomainUrl = (formValues, lang, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  const formData = new FormData();
  formData.append("url", formValues?.enterUrl);
  formData.append("language", lang);

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/add-domain`, formData, {headers})
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const suspendOffer = (DomainUrl, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  const formData = new FormData();
  formData.append("url", DomainUrl);

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/change-status-offer`, formData, {headers})
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const uploadCSV = (csv, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'multipart/form-data'
  }

  const formData = new FormData();
  formData.append("file", csv);

  return axios
  .post(`${baseURL2}/LinkSellingSystem/public/api/add-domain-csv`, formData, {headers})
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const downloadSampledCSV = (accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/download-csv`, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};