import axios from "axios";
import { baseURL2 } from "../../utility/data";



const userData = JSON.parse(localStorage.getItem('userData'))

export const addArticle = (formValues, editor, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `application/json`,
    'content-type' : 'multipart/form-data'
  }
  const formData = new FormData();
  formData.append("title", formValues.title);
  formData.append("project", formValues.project);
  formData.append("lead", formValues.lead);
  formData.append("document", formValues.document);
  // if (selectedFile) {
  //   formData.append("image", base64ToFile(formValues.image, "image.jpg"));
  // }
  
    formData.append("image", formValues.image);
  
  formData.append("content", editor)
  // formData.append("user_id", id)

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/add-article`, formData, { headers })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const getArticles = (accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/articles`, { headers })
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const readyArticleList = (accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-ready-articles`, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const articlesInProgressList = (accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-inprogress-articles`, { headers })
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const getRequestedArticles = (accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/customer-articles`, { headers })
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const viewRequestedArticles = (articleId, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/article-review/${articleId}`, { headers })
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


// export const searchArticles1 = (values, id, accessToken) => {
//   const headers = {
//     'Authorization': `Bearer ${accessToken}`,
//     'Accept': `*/*`,
//     'content-type' : 'application/json'
//   }
//   return axios
//     .post(`${baseURL2}/LinkSellingSystem/public/api/search-article/${id}`, { headers } {
//       title: values.title,
//       project: values.project,
//       lead: "",
//       date: values.date,
//       status: "",
//     })
//     .then((res) => {
//       return res?.data;
//     })
//     .catch((error) => {
//       console.log(error);
//       return error.response.data;
//     });
// };

export const searchArticles = (values, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': '*/*',
    'Content-Type': 'application/json'
  };

  const requestData = {
    title: values.title,
    project: values.project,
    lead: '',
    date: values.date,
    status: ''
  };

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/search-article`, requestData, { headers })
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};



export const updateRequestedArticles = (viewArticle, suggestion, editor, status) => {
  const formData = new FormData();
  formData.append("status", status);
  formData.append("suggestions", status === "AcceptWithoutChanges" ? "" : suggestion);
  formData.append("content", status === "AcceptWithoutChanges" || status === "RequestChanges" ? "" : editor);
  formData.append("article_title", viewArticle?.article_title);
  formData.append("article_lead ", viewArticle?.short_description);

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/update-customer-article/${viewArticle?.id}`, formData)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error?.response?.data;
    });
};



// export const orderArticles = (formValues, orderPrice, articleType) => {
//   return axios
//     .post(`${baseURL2}/LinkSellingSystem/public/api/order-article`, {
//       quantity: formValues.quantity,
//       article: articleType,
//       project: formValues.project,
//       country: formValues.country,
//       titleOfArticle: formValues.title,
//       attachment: formValues.attachment,
//       placeLink: formValues.placingLink,
//       contactForm: formValues.contactForm,
//       phone: formValues.phone,
//       email: formValues.email,
//       grossAmount: orderPrice,
//       user_id: userData?.id,
//     })
//     .then((res) => {
//       return res?.data;
//     })
//     .catch((error) => {
//       console.log(error);
//       return error.response.data;
//     });
// };


export const orderArticles = (formValues, orderPrice, articleType, linkAnchorPairs, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': '*/*',
    'Content-Type': 'application/json'
  };
  const formData = new FormData();
  formData.append("article", articleType);
  formData.append("project", formValues.project);
  formData.append("gross_amount", orderPrice);
  formData.append("articlesubject", formValues.writeSubject ? formValues.writeSubject : "we provide subject");
  formData.append("order_link_list", linkAnchorPairs.map((item=>item.link)));
  formData.append("order_requestAnchor_list", linkAnchorPairs.map((item=>item.requestAnchor)));
  formData.append("suggestion", formValues.suggestion);
  // formData.append("user_id", userData?.id)

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/order-article`, formData, {headers})
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

