import axios from "axios";
import { baseURL2 } from "../../utility/data";


const userData = JSON.parse(localStorage.getItem('userData'))

export const addArticle = (formValues, editor, id) => {
  const formData = new FormData();
  formData.append("title", formValues.title);
  formData.append("project", formValues.project);
  formData.append("lead", formValues.lead);
  formData.append("document", formValues.document);
  formData.append("image", formValues.image);
  formData.append("content", editor)
  formData.append("user_id", id)

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/add-article`, formData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const getArticles = (id) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/articles/${id}`,)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const getRequestedArticles = (id) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/customer-articles/${id}`,)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const viewRequestedArticles = (customerId, articleId) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/article-review/${customerId}/${articleId}`,)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};










export const searchArticles = (values) => {
  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/search-article`, {
      title: values.title,
      project: values.project,
      lead: "",
      date: values.date,
      status: ""
    })
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


export const orderArticles = (formValues, orderPrice, articleType) => {
  console.log(formValues, "85");
  const formData = new FormData();
  formData.append("quantity", formValues.quantity);
  formData.append("article", articleType);
  formData.append("project", formValues.project);
  formData.append("country", formValues.country);
  formData.append("title_of_article", formValues.title);
  formData.append("attachment", formValues.attachment)
  formData.append("placing_link", formValues.placingLink)
  formData.append("contact_form", formValues.contactForm)
  formData.append("phone", formValues.phone)
  formData.append("email", formValues.email)
  formData.append("gross_amount", orderPrice)
  formData.append("user_id", userData?.id)
  formData.append("comment", userData?.id)

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/order-article`, formData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

