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

export const getPublisherArticles = (page, search, anchorType, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }

  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/publisher-articles?page=${page}&per_page=10&dofollow=${search?.doFollow}&promotion=${search?.promotions}&min_dr=${search?.drMin}&max_dr=${search?.drMax}&min_link=${search?.minLinks}&max_link=${search?.maxLinks}&min_href=${search?.ahrefMin}&max_href=${search?.ahrefMax}&type_of_anchor=${anchorType}`,  { headers })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const getPublisherArticleDetails = (domain, accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/article-details/${domain?.portalLink}`, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error?.response?.data;
    });
}

export const articleTypeList = (accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `*/*`,
    'content-type' : 'application/json'
  }
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/article-types`, {headers})
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error?.response?.data;
    });
}


export const addToCartArticles = (data, isAddNew, accessToken) => {

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': `application/json`,
    'content-type' : 'multipart/form-data'
  }

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
  formData.append("article_id", data.article_id); 
  formData.append("content", data.content);
  formData.append("image", data.image);
  formData.append("project", data.project);
  formData.append("date", data.date);
  formData.append("links", data.links);
  formData.append("anchorurl", data.anchorurl);
  formData.append("anchor", data.anchor);
  formData.append("suggestion", data.suggestion);
  formData.append("articlesubject", data.articlesubject);
  formData.append("art_id", data.artId);
  formData.append("publisher_msg", data.publisherMsgText);
  formData.append("lead", data.addArtiLead);
  formData.append("imageUrl", data.imageUrl);



  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/single-add-to-card`, formData, {headers})
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

