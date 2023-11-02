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

