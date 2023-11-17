import axios from "axios";
import { baseURL2 } from "../../utility/data";





export const requestArticle = (data) => {

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("customer_id", data.id);

  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/request-article-writing`, formData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const getPublisherArticles = (page, search, anchorType, userId) => {

  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/publisher-articles?page=${page}&per_page=10&dofollow=${search?.doFollow}&promotion=${search?.promotions}&min_dr=${search?.drMin}&max_dr=${search?.drMax}&min_link=${search?.minLinks}&max_link=${search?.maxLinks}&min_href=${search?.ahrefMin}&max_href=${search?.ahrefMax}&type_of_anchor=${anchorType}&user_id=${userId}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const getPublisherArticleDetails = (domain, userId) => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/article-details/${userId}/${domain?.portalLink}`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error?.response?.data;
    });
}

export const articleTypeList = () => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/article-types`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error?.response?.data;
    });
}


export const addToCartArticles = (data, isAddNew) => {

  const formData = new FormData();
  formData.append("domain_id", data?.domainId);
  formData.append("service_type", 2);
  formData.append("article_type", data.articleType);
  formData.append("title", data.articleTitle);
  formData.append("article_quality", data.articleQuality);
  formData.append("traffice_guarantee", data.trafficGuarantee);
  formData.append("month_guarantee", data.monthGuarantee);
  formData.append("amount", data.amount);
  formData.append("article_amount", data.article_amount);
  {!isAddNew && formData.append("article_id", data.article_id); }
  formData.append("content", data.content);
  formData.append("image", data.image);
  formData.append("project", data.project);
  formData.append("date", data.date);
  formData.append("links", data.links);


  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/single-add-to-card/${data.userId}`, formData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

