import React, { useState } from 'react'
import { Card, Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { signUpPublisher } from '../../../../services/authServices/authservices';
import { ToastContainer, toast } from 'react-toastify';
import globalLoader from '../../../../assets/images/loader.svg'
import LanguageSelect from '../../../Components/Language/languageSelect';
import { useLanguage } from '../../../Context/languageContext';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
const SignUp = () => {

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: '',
    phoneNumber: "",
    terms: false,
    marketing: false,
    privacy: false,
  };

  const { languageData } = useLanguage();

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [signUpLoading, setSignUpLoading] = useState(false)

  const currLang = localStorage.getItem('lang');

  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };


  const handlePhoneNumberChange = (value) => {
    setFormValues({ ...formValues, phoneNumber: value });
  };

  console.log(formValues)
  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormValues({ ...formValues, [name]: checked });
    validate({ ...formValues, [name]: checked });
  }




  const validate = (values) => {
    let error = {};
    let isValid = true;
    const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^(\+\d{1,3})?\d{9,12}$/;
    if (!values.username) {
      error.username = languageData && languageData?.filter((item) => item.title === 'signUpUserError')[0]?.value || 'signUpUserError'
      isValid = false
    }
    if (!values.email) {
      error.email = languageData && languageData?.filter((item) => item.title === 'signUpEmailError')[0]?.value || 'signUpEmailError';
      isValid = false;
    } else if (!emailReg.test(values.email)) {
      error.email = languageData && languageData?.filter((item) => item.title === 'signUpEmailError2')[0]?.value || 'signUpEmailError2';
      isValid = false;
    }
    if (!values.password) {
      error.password = languageData && languageData?.filter((item) => item.title === 'signUpPasswordError')[0]?.value || 'signUpPasswordError';
      isValid = false;
    }
    if (!values.phoneNumber) {
      error.phoneNumber = languageData && languageData?.filter((item) => item.title === 'PleaseEnterPhoneNumber')[0]?.value || 'PleaseEnterPhoneNumber';
      isValid = false;
    } else if (!phoneRegex.test(values.phoneNumber)) {
      error.phoneNumber = languageData && languageData?.filter((item) => item.title === 'InvalidPhoneFormat')[0]?.value || 'InvalidPhoneFormat';;
      isValid = false;
  }
    if (!values.confirmPassword) {
      error.confirmPassword = languageData && languageData?.filter((item) => item.title === 'confirmPasswordError')[0]?.value || 'confirmPasswordError';
      isValid = false;
    } else if (values.password !== values.confirmPassword) {
      error.confirmPassword = languageData && languageData?.filter((item) => item.title === 'confirmPasswordMismatch')[0]?.value || 'confirmPasswordMismatch';
      isValid = false;
    }
    if (!values.terms) {
      error.terms = languageData && languageData?.filter((item) => item.title === 'terms')[0]?.value || 'terms';
      isValid = false;
    }
    if (!values.marketing) {
      error.marketing = languageData && languageData?.filter((item) => item.title === 'marketing')[0]?.value || 'marketing';
      isValid = false;
    }

    if (!values.privacy) {
      error.privacy = languageData && languageData?.filter((item) => item.title === 'privacy')[0]?.value || 'privacy';
      isValid = false;
    }
    setFormErrors(error);
    return isValid;
  }

  const phoneRegex = /^(\+\d{1,3})?\d{9,12}$/;


  const signUpSuccessMessage = languageData && languageData?.filter((item) => item.title === 'signUpSuccessMessage')[0]?.value || 'signUpSuccessMessage';
  const signUpErrorsMessage = languageData && languageData?.filter((item) => item.title === 'signUpErrorMessage')[0]?.value || 'signUpErrorMessage';
  const loginFailureMessage2 = languageData && languageData?.filter((item) => item.title === 'loginFailureMessage2')[0]?.value || 'loginFailureMessage2';
  const passwordDoNotMatch = languageData && languageData?.filter((item) => item.title === 'passwordDoNotMatch')[0]?.value || 'passwordDoNotMatch';
  const userNameAlredyTaken = languageData && languageData?.filter((item) => item.title === 'userNameAlredyTaken')[0]?.value || 'userNameAlredyTaken';


  const signUpServices = async () => {
    setSignUpLoading(true);
    if (!formValues.terms) {
      toast(languageData && languageData?.filter((item) => item.title === 'terms')[0]?.value || 'terms', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: "error",
      });
      setSignUpLoading(false);
      return;
    }
    if (!formValues.phoneNumber) {
      toast(languageData && languageData?.filter((item) => item.title === 'PleaseEnterPhoneNumber')[0]?.value || 'Please Enter Phone Number', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: "error",
      });
      setSignUpLoading(false);
      return;
    }
    if (!phoneRegex.test(formValues.phoneNumber)) {
      toast(languageData && languageData?.filter((item) => item.title === 'InvalidPhoneFormat')[0]?.value || 'Invalid Phone Format', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: "error",
      });
      setSignUpLoading(false);
      return;
    }
    if (!formValues.marketing) {
      toast(languageData && languageData?.filter((item) => item.title === 'marketing')[0]?.value || 'marketing', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: "error",
      });
      setSignUpLoading(false);
      return;
    }
    if (!formValues.privacy) {
      toast(languageData && languageData?.filter((item) => item.title === 'privacy')[0]?.value || 'privacy', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: "error",
      });
      setSignUpLoading(false);
      return;
    }
    if (formValues.password !== formValues.confirmPassword) {
      toast(passwordDoNotMatch, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        type: 'error',
      });
      setSignUpLoading(false);
      return;
    }
    let values = {
      ...formValues,
      language: currLang
    }
    const res = await signUpPublisher(values, currLang);
    if (res.success === true) {
      toast(signUpSuccessMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: 'success'
      });
      setSignUpLoading(false)
      setFormValues({ username: "", password: "", email: "", terms: false, marketing: false, privacy: false, confirmPassword: '' })
      setTimeout(() => {
        navigate('/RegistrationDone')
      }, 2000);
    } else if (res.message[0] === "The email has already been taken.") {
      toast(signUpErrorsMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: 'error'
      });
      setSignUpLoading(false)
      setFormValues({ username: "", password: "", email: "", terms: false, marketing: false, privacy: false, confirmPassword: '' })
    }
    else if (res.message[0] === "The username has already been taken.") {
      toast(userNameAlredyTaken, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: 'error'
      });
      setSignUpLoading(false)
      setFormValues({ username: "", password: "", email: "", terms: false, marketing: false, privacy: false, confirmPassword: '' })
    }
    else {
      toast(loginFailureMessage2, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: 'error'
      });
      setSignUpLoading(false)
      setFormValues({ username: "", password: "", email: "", terms: false, confirmPassword: "" })
    }
  }

  return (
    <div className='ltr login-img'>
      <ToastContainer />
      <div className='d-flex justify-content-end mt-2 me-2' >
        <LanguageSelect />
      </div>
      <div className="page">
        <div>
          <Container className="col col-login mx-auto text-center">
            <h2 className='text-white fw-bold'>{languageData && languageData?.filter((item) => item.title === 'publisherTitle')[0]?.value || 'publisherTitle'} </h2>
          </Container>
          <Container className="container-login100">
            <div className="wrap-0login10 p-0">
              <Card>
                <Card.Body>
                  <Form className="login100-form validate-form">
                    <span className="login100-form-title">{languageData && languageData?.filter((item) => item.title === 'register')[0]?.value || 'register'}</span>
                    <div className="wrap-input100 validate-input mb-0">
                      <input className="input100" type="text" name="username" placeholder={languageData && languageData?.filter((item) => item.title === 'userNameSignUp')[0]?.value || 'userNameSignUp'} onChange={(e) => handleChange(e)} onKeyUp={() => validate(formValues)} value={formValues.username} />
                      <span className="focus-input100"></span>
                      <span className="symbol-input100">
                        <i className="mdi mdi-account" aria-hidden="true"></i>
                      </span>
                    </div>
                    <div className='mt-1 mb-2 text-danger text-sm-12'>{formErrors.username}</div>
                    <div className="wrap-input100 validate-input mb-0 mt-2">
                      <input className="input100" type="text" name="email" placeholder={languageData && languageData?.filter((item) => item.title === 'emailSignUp')[0]?.value || 'emailSignUp'} onChange={(e) => handleChange(e)} onKeyUp={() => validate(formValues)} value={formValues.email} />
                      <span className="focus-input100"></span>
                      <span className="symbol-input100">
                        <i className="zmdi zmdi-email" aria-hidden="true"></i>
                      </span>
                    </div>
                    <div className='mt-1 mb-2 text-danger text-sm-12'>{formErrors.email}</div>
                    <div className="wrap-input100 validate-input mb-0 mt-2" >
                      <input className="input100" type="password" name="password" placeholder={languageData && languageData?.filter((item) => item.title === 'passwordSignUp')[0]?.value || 'passwordSignUp'} onChange={(e) => handleChange(e)} onKeyUp={() => validate(formValues)} value={formValues.password} />
                      <span className="focus-input100"></span>
                      <span className="symbol-input100">
                        <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                      </span>
                    </div>
                    <div className='mt-1 mb-2 text-danger text-sm-12'>{formErrors.password}</div>
                    <div className='wrap-input100 validate-input mb-0 mt-2'>
                      <input
                        className='input100'
                        type='password'
                        name='confirmPassword'
                        placeholder={languageData && languageData?.filter((item) => item.title === 'confirmPassword')[0]?.value || 'confirmPassword'}
                        onChange={(e) => handleChange(e)}
                        onKeyUp={() => validate(formValues)}
                        value={formValues.confirmPassword}
                      />
                      <span className='focus-input100'></span>
                      <span className='symbol-input100'>
                        <i className='zmdi zmdi-lock' aria-hidden='true'></i>
                      </span>
                    </div>
                    <div className='mt-1 mb-2 text-danger text-sm-12'>{formErrors.confirmPassword}</div>
                    <div className='wrap-input100 validate-input mb-0 mt-2'>
                      <PhoneInput
                        className='input100 px-3 d-flex flex-Row'
                        international
                        defaultCountry="PL"
                        placeholder={languageData && languageData?.filter((item) => item.title === 'PleaseEnterPhoneNumber')[0]?.value || 'PleaseEnterPhoneNumber'}
                        value={formValues.phoneNumber}
                        onChange={(e) => handlePhoneNumberChange(e)}
                        onKeyUp={() => validate(formValues)}
                      />
                    </div>
                    <div className='mt-1 mb-2 text-danger text-sm-12'>{formErrors.phoneNumber}</div>
                    <label className="custom-control custom-checkbox mt-4">
                      <input type="checkbox" className="custom-control-input" name='terms' onChange={handleCheckbox} checked={formValues.terms} />
                      <span className="custom-control-label mt-2">{languageData && languageData?.filter((item) => item.title === 'singUpTermsAndCondition')[0]?.value || 'singUpTermsAndCondition'} <a>{languageData && languageData?.filter((item) => item.title === 'singUpTermsAndCondition2')[0]?.value || 'singUpTermsAndCondition2'}</a></span>
                    </label>
                    <div className='mt-1 mb-2 text-danger text-sm-12 fs-6'>{formErrors.terms}</div>

                    <label className="custom-control custom-checkbox mt-4">
                      <input type="checkbox" className="custom-control-input" name='marketing' onChange={handleCheckbox} checked={formValues.marketing} />
                      <span className="custom-control-label mt-2">{languageData && languageData?.filter((item) => item.title === 'singUpTermsAndCondition')[0]?.value || 'singUpTermsAndCondition'} <a>{languageData && languageData?.filter((item) => item.title === 'marketingPolicy')[0]?.value || 'marketingPolicy'}</a></span>
                    </label>
                    <div className='mt-1 mb-2 text-danger text-sm-12 fs-6'>{formErrors.marketing}</div>

                    <label className="custom-control custom-checkbox mt-4">
                      <input type="checkbox" className="custom-control-input" name='privacy' onChange={handleCheckbox} checked={formValues.privacy} />
                      <span className="custom-control-label mt-2">{languageData && languageData?.filter((item) => item.title === 'singUpTermsAndCondition')[0]?.value || 'singUpTermsAndCondition'} <a>{languageData && languageData?.filter((item) => item.title === 'privacyPolicy')[0]?.value || 'privacyPolicy'}</a></span>
                    </label>
                    <div className='mt-1 mb-2 text-danger text-sm-12 fs-6'>{formErrors.privacy}</div>
                    <div className="container-login100-form-btn text-primary">
                      {signUpLoading ? <img src={globalLoader} alt='loader' width={50} /> :
                        <a onClick={() => signUpServices()} className="login100-form-btn btn-primary" style={{ cursor: "pointer" }}>
                          {languageData && languageData?.filter((item) => item.title === 'register')[0]?.value || 'register'}
                        </a>}
                    </div>
                    <div className="text-center pt-3">
                      <p className="text-dark mb-0"> {languageData && languageData?.filter((item) => item.title === 'alreadyHaveAnAccount')[0]?.value || 'alreadyHaveAnAccount'}<a onClick={() => navigate('/login/publisher')} className="text-primary ms-1" style={{ cursor: "pointer" }}> {languageData && languageData?.filter((item) => item.title === 'alreadyHaveAnAccount2')[0]?.value || 'alreadyHaveAnAccount2'}</a></p>
                      <p className="text-dark mb-0"> {languageData && languageData?.filter((item) => item.title === 'OR')[0]?.value || 'OR'}</p>
                      <p className="text-dark mb-0"> {languageData && languageData?.filter((item) => item.title === 'registeredWithUser')[0]?.value || 'registeredWithUser'}<a onClick={() => navigate('/signUp')} className="text-primary ms-1" style={{ cursor: "pointer" }}> {languageData && languageData?.filter((item) => item.title === 'clickHere')[0]?.value || 'clickHere'}</a></p>
                    </div>
                  </Form>
                </Card.Body>

                <Card.Footer className='text-center'>
                  <a href="javascript:void(0);" className="social-login text-center me-4 ">
                    <i className="fa fa-youtube-play"></i>
                  </a>
                </Card.Footer>
              </Card>
            </div>
          </Container>

        </div>
      </div>
    </div>

  )
}

export default SignUp