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

