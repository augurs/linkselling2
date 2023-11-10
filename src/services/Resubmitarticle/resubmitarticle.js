import axios from "axios";
import { baseURL2 } from "../../utility/data";

const userData = JSON.parse(localStorage.getItem('userData'))


export const resubmitarticle = (id) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-resubmit-article/${id}`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const updaterResubmitarticle = (data, id) => {

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("image", data.image);
  formData.append("publication_date", data.date);
  formData.append("max_links", data.link);
  formData.append("comment", data.comment);


  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/update-resubmit-article/${id}`, formData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const portalArticleDetails = (id) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-portal-article-detail/${id}`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const portallinksubmit = (link, id) => {

  const formData = new FormData();
  formData.append("link", link);


  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/update-portal-link/${id}`, formData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};