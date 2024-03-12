import axios from "axios";
import { baseURL2 } from "../../utility/data";


export const getMarketPlaceList = (userId) => {
    return axios
        .get(`${baseURL2}/LinkSellingSystem/public/api/get-market-place/${userId}`)
        .then((res) => {
            return res?.data;
        })
        .catch((error) => {
            console.log(error);
            return error.response.data;
        });
};


export const addToCart = (userId, domainId, serviceType) => {
    const formData = new FormData();
    formData.append("domain_id", domainId === undefined ? "" : domainId);
    formData.append("service_type", serviceType);
    return axios
        .post(`${baseURL2}/LinkSellingSystem/public/api/single-add-to-card/${userId}`, formData)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            console.log(error);
            return error.response.data;
        });
};

export const getCart = (accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': `*/*`,
        'content-type' : 'application/json'
      }
    return axios
        .get(`${baseURL2}/LinkSellingSystem/public/api/get-cart`, { headers })
        .then((res) => {
            return res?.data;
        })
        .catch((error) => {
            console.log(error);
            return error.response.data;
        });
}

export const deleteCart = (userId, id) => {
    const formData = new FormData();
    formData.append("id", id);
    return axios
        .post(`${baseURL2}/LinkSellingSystem/public/api/delete-cart-data/${userId}`, formData)
        .then((res) => {
            return res?.data;
        })
        .catch((error) => {
            console.log(error);
            return error.response.data;
        });
}

export const buyNow = (domainId , serviceType, articleType, accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': `*/*`,
        'content-type' : 'application/json'
      }

    const formData = new FormData();
    formData.append('domain_id', domainId)
    formData.append('service_type', serviceType)
    formData.append('article_type', articleType)

    return axios
        .post(`${baseURL2}/LinkSellingSystem/public/api/all-buy-now`, formData, {headers})
        .then((res) => {
            return res?.data
        })
        .catch((error) => {
            console.log(error);
            return error.response.data
        })
}

export const getInvoices = (accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': `*/*`,
        'content-type' : 'application/json'
      }
    return axios
        .get(`${baseURL2}/LinkSellingSystem/public/api/get-invoices`, {headers})
        .then((res) => {
            return res?.data;
        })
        .catch((error) => {
            console.log(error);
            return error.response.data;
        });
}




