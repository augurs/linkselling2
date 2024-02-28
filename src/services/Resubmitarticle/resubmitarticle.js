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


export const uploadimagereqarticle = (id, imgid) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/article-review/${id}/${imgid}`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const updaterResubmitarticle = (data, id, rejectComment) => {

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  if (data.image && (data.image instanceof File || data.image instanceof Blob)) {
    formData.append("image", data.image);
}
  formData.append("publication_date", data.date);
  if (data.userStatus) {
    formData.append("user_status", data.userStatus);
    formData.append("reject_comment", rejectComment);

}
  formData.append("comment", data.comment);
  formData.append("publisher_msg", data.publisherMsgText);
  formData.append("lead", data.lead);




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

export const updaterimagrequestedarticle = (data, id) => {

  const formData = new FormData();
  if (data.image && (data.image instanceof File || data.image instanceof Blob)) {
    formData.append("image", data.image);
} else {
    formData.append("image", "");
  }
  if (data.userStatus) {
    formData.append("user_status", data.userStatus);
}

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/update-image-article/${id}`, formData)
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
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-portal-article-detail/newarticle/${id}`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const requestArticleDetails = (id) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-portal-article-detail/requestarticle/${id}`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};



export const portallinksubmit = (link, id, requestarticle, language) => {

  const formData = new FormData();
  formData.append("link", link);
  formData.append("type", requestarticle);
  formData.append("language", language);


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



export const portalArticleDetailsReject = (id, article, comment) => {

  const formData = new FormData();
  formData.append("comment", comment);
  formData.append("type", article);



  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/portal-reject-article/${id}`, formData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const portalArticleDetailsMessage = (id, article, message) => {

  const formData = new FormData();
  formData.append("message", message);
  formData.append("type", article);



  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/portal-send-message/${id}`, formData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};