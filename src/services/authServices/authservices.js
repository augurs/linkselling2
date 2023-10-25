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
      return res?.data;
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