import axios from "axios";
import { baseURL2 } from "../../utility/data";



  export const orderslist = (id) => {
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/get-article-orders/${id}`)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };


export const ordersListArticle = (id, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/view-order-detail/addnewarticle/${id}`, { headers })
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };


  export const ordersListArticle1 = (id, accessToken) => {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': `*/*`,
      'content-type' : 'application/json'
    }
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/view-order-detail/requestarticle/${id}`, { headers })
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };

  export const chatSectionService = (id, articleType) => {
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/article-messages/${articleType}/${id}`)
      .then((res) => {
        console.log(id, "45");
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };

  export const sentToPublisherMessage = (id, article, message) => {

    const formData = new FormData();
    formData.append("message", message);
    formData.append("type", article);
  
  
  
    return axios
      .post(`${baseURL2}/LinkSellingSystem/public/api/user-send-message/${id}`, formData)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };

  export const sentUserRejectMessage = (id, article, message) => {

    const formData = new FormData();
    formData.append("comment", message);
    formData.append("type", article);
  
  
  
    return axios
      .post(`${baseURL2}/LinkSellingSystem/public/api/user-reject-article/${id}`, formData)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };