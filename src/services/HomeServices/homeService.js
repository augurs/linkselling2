import axios from "axios";
import { baseURL2 } from "../../utility/data";



  export const dashboardprojects = (accessToken) => {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': `*/*`,
      'content-type' : 'application/json'
    }
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/dashboard-projects`, {headers})
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };


  export const dashboardpromotion = (accessToken) => {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': `*/*`,
      'content-type' : 'application/json'
    }
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/dashboard-promotions`, {headers})
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };


  export const todolists = (accessToken) => {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': `*/*`,
      'content-type' : 'application/json'
    }
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/dashboard-todo-articles`, {headers})
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };
