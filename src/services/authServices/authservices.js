import axios from "axios";
import { baseURL2 } from "../../utility/data";



export const login = (formValues , currLang) => {
  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/login`, {
      email: formValues.email,
      password: formValues.password,
      language : currLang
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};

export const signup = (formValues) => {
  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/register-user`, {
      name: formValues.username,
      email: formValues.email,
      password: formValues.password,
      language: formValues.language
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};



export const forgotPassword = (email) => {
  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/forgot_password`, {
      email: email,
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const registerNip = (values , id) => {
  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/get-gus-response`, {
      nip_number: values.nipNumber,
      user_id: id,
    })
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};


export const thankupage = () => {
  return axios
    .get(`${baseURL2}/LinkSellingSystem/public/api/get-thankyou`)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};



export const userprofileModal = (id, Email, Phone ) => {

  const formData = new FormData();
  formData.append("id", id);
  formData.append("email", Email);
  formData.append("phone_number", Phone);


  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/update-user-info`, formData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};



export const updateNip = (values , id) => {
  return axios
    .post(`${baseURL2}/LinkSellingSystem/public/api/update-nip-details`, {
      apartment_number: values.apartment_number ? values.apartment_number : 0,
      city: values.city,
      community: values.community,
      company_name: values.company_name,
      district: values.district,
      postal_code: values.postal_code,
      property_number: values.property_number,
      province: values.province,
      street: values.street,
      user_id: id,
    })
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response.data;
    });
};