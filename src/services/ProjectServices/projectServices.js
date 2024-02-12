import axios from "axios";
import { baseURL2 } from "../../utility/data";

// const userData = JSON.parse(localStorage.getItem('userData'))

export const addProjects = (values, id) => {
    return axios
      .post(`${baseURL2}/LinkSellingSystem/public/api/add-project`, {
        user_id: id,
        name: values.projectName,
        domain: values.webAddress,
        language: values.publicationLang,
      })
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };


  export const projectList = (id) => {
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/projects/${id}`)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };

  export const projectChangeStatus = (id) => {
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/project-change-status/${id}`)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };

  export const getProject = (id) => {
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/edit-project/${id}`)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };


  export const editProject = (values , id) => {
    return axios
      .put(`${baseURL2}/LinkSellingSystem/public/api/update-project/${id}`, {
        name: values.projectName,
        domain: values.webAddress,
        language: values.publicationLang,
      })
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };

  export const searchProject = (values, id, status) => {
    console.log(values , "66");
    return axios
      .post(`${baseURL2}/LinkSellingSystem/public/api/search-project/${id}`, {
        language: values.language ? values.language : "" ,
        name: values.title,
        status: status,
      })
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };



//   projectName: "",
//   webAddress: "",
//   publicationLang: "",
//   publicationCountry: ""

export const viewPurchaseDomainlist = (uId, pId) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/project-show-links/${uId}/${pId}`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};
