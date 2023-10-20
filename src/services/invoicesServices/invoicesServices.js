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

export const getCart = (userId) => {
    return axios
        .get(`${baseURL2}/LinkSellingSystem/public/api/get-cart/${userId}`)
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

export const buyNow = (userId, domainId , serviceType) => {
    const formData = new FormData();
    formData.append("id", userId)
    formData.append('domain_id', domainId)
    formData.append('service_type', serviceType)

    return axios
        .post(`${baseURL2}/LinkSellingSystem/public/api/all-buy-now`, formData)
        .then((res) => {
            return res?.data
        })
        .catch((error) => {
            console.log(error);
            return error.response.data
        })
}

export const getInvoices = (userId) => {
    return axios
        .get(`${baseURL2}/LinkSellingSystem/public/api/get-invoices/${userId}`)
        .then((res) => {
            return res?.data;
        })
        .catch((error) => {
            console.log(error);
            return error.response.data;
        });
}




