import axios from "axios";
import { baseURL2 } from "../../utility/data";

// const userData = JSON.parse(localStorage.getItem('userData'))

export const addProjects = (values, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
    return axios
      .post(`${baseURL2}/LinkSellingSystem/public/api/add-project`, {
        name: values.projectName,
        domain: values.webAddress,
        language: values.publicationLang,
      }, {headers})
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };


  export const projectList = (accessToken) => {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': `*/*`,
      'content-type' : 'application/json'
    }
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/projects`, { headers })
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };

  export const projectChangeStatus = (id, accessToken) => {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': `*/*`,
      'content-type' : 'application/json'
    }
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/project-change-status/${id}`, {headers})
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };

  export const getProject = (id, accessToken) => {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': `*/*`,
      'content-type' : 'application/json'
    }
    return axios
      .get(`${baseURL2}/LinkSellingSystem/public/api/edit-project/${id}`, { headers })
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };


  export const editProject = (values , id, accessToken) => {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': `*/*`,
      'content-type' : 'application/json'
    }
    return axios
      .put(`${baseURL2}/LinkSellingSystem/public/api/update-project/${id}`, {
        name: values.projectName,
        domain: values.webAddress,
        language: values.publicationLang,
      }, {headers})
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        console.log(error);
        return error.response.data;
      });
  };

  export const searchProject = (values, status, accessToken) => {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': `*/*`,
      'content-type' : 'application/json'
    }
    return axios
      .post(`${baseURL2}/LinkSellingSystem/public/api/search-project`, {
        language: values.language ? values.language : "" ,
        name: values.title,
        status: status,
      }, {headers})
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

export const viewPurchaseDomainlist = (pId, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/project-show-links/${pId}`, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const uploadDocx = (docx, lang, accessToken) => {

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `application/json`,
    'content-type' : 'multipart/from-data'
  }
  const formData = new FormData();
  formData.append("file", docx);

  return axios
  .post(`${baseURL2}/LinkSellingSystem/public/api/readDocsFile?lang=${lang}`, formData, { headers })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};
