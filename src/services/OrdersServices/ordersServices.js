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


export const ordersListArticle = (id) => {
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/view-order-detail/addnewarticle/${id}`)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };


  export const ordersListArticle1 = (id) => {
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/view-order-detail/requestarticle/${id}`)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };

  export const chatSectionService = (id, articleType) => {
    // console.log(id, "45");
    // console.log(articleType, "45");

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