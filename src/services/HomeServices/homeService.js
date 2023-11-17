import axios from "axios";
import { baseURL2 } from "../../utility/data";



  export const dashboardprojects = (id) => {
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/dashboard-projects/${id}`)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };


  export const dashboardpromotion = () => {
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/dashboard-promotions`)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };


  export const todolists = (id) => {
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/dashboard-articles-review/${id}`)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };
