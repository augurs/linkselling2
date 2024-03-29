import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Form, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { readSpecialCode, signup } from '../../../services/authServices/authservices';
import { ToastContainer, toast } from 'react-toastify';
import globalLoader from '../../../assets/images/loader.svg'
import LanguageSelect from '../../Components/Language/languageSelect';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../Context/languageContext';
import { useLocation } from 'react-router-dom';
import { translate } from '../../../utility/helper';
const SignUp = () => {

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: '',
    specialCode: '',
    terms: false,
    marketing: false,
    privacy: false,
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const refId = queryParams.get('ref');

  const { languageData } = useLanguage();

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [specialCodeData, setSpecialCodeData] = useState('')
  const [typingTimeout, setTypingTimeout] = useState(null);
  const currLang = localStorage.getItem('lang');

  // const currentLanguage = i18n.language;


  // useEffect(() => {
  //   validate(formValues);
  // }, [formValues]);




  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.trim().length === 0) {
      setFormValues((prevValues) => ({ ...prevValues, [name]: '' }));
    } else if (!value.startsWith(' ')) {
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
      // setSpecialCodeData('');
    }
  };

  const handleSpecialCodeChange = (e) => {
    const { name, value } = e.target;
    if (value.trim().length === 0) {
      setFormValues((prevValues) => ({ ...prevValues, [name]: '' }));
    } else if (!value.startsWith(' ')) {
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
      setSpecialCodeData('');
    }
  };

  useEffect(() => {
    if (formValues.specialCode) {
      clearTimeout(typingTimeout);
      const timeout = setTimeout(readSpecialCodeShow, 1000);
      setTypingTimeout(timeout);
    }
  }, [formValues.specialCode]);

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormValues({ ...formValues, [name]: checked });
    validate({ ...formValues, [name]: checked });
  }

  // useEffect(() => {
  //   if (formValues?.specialCode) {
  //     chatSectionShow()
  //   }
  // }, [formValues?.specialCode])


  const validate = (values) => {
    let error = {};
    let isValid = true;
    const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    // if (!values.username) {
    //   error.username = languageData && languageData?.filter((item) => item.title === 'signUpUserError')[0]?.value || 'signUpUserError'
    //   isValid = false
    // }
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
    } else if (!passwordReg.test(values.password)) {
      error.password = languageData && languageData?.filter((item) => item.title === 'passwordValidationError')[0]?.value || 'Hasło musi mieć co najmniej 8 znaków, w tym co najmniej 1 znak specjalny, 1 cyfrę i 1 alfabet.';
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




  const signUpSuccessMessage = languageData && languageData?.filter((item) => item.title === 'signUpSuccessMessage')[0]?.value || 'signUpSuccessMessage';
  const signUpErrorsMessage = languageData && languageData?.filter((item) => item.title === 'signUpErrorMessage')[0]?.value || 'signUpErrorMessage';
  const loginFailureMessage2 = languageData && languageData?.filter((item) => item.title === 'loginFailureMessage2')[0]?.value || 'loginFailureMessage2';
  const passwordDoNotMatch = languageData && languageData?.filter((item) => item.title === 'passwordDoNotMatch')[0]?.value || 'passwordDoNotMatch';
  const userNameAlredyTaken = languageData && languageData?.filter((item) => item.title === 'userNameAlredyTaken')[0]?.value || 'userNameAlredyTaken';
  const wrongSpecialCode = languageData && languageData?.filter((item) => item.title === 'wrongSpecialCode')[0]?.value || 'wrongSpecialCode';
  const expiredSpecialCode = languageData && languageData?.filter((item) => item.title === 'theSpecialCodeIsExpired')[0]?.value || 'Kod specjalny wygasł.';


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
    const res = await signup(values, currLang, refId ? refId : '');
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
      // setFormValues({ username: "", password: "", email: "", terms: false, marketing: false, privacy: false, confirmPassword: '', specialCode: '' })
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
      // setFormValues({ username: "", password: "", email: "", terms: false, marketing: false, privacy: false, confirmPassword: '', specialCode: ''  })
    } else if (res.success === false && res.message[0] === "The Special code does not exist.") {
      toast(wrongSpecialCode, {
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
      // setFormValues({ username: "", password: "", email: "", terms: false, marketing: false, privacy: false, confirmPassword: '', specialCode: ''  })
    } else if (res.success === false && res.message[0] === "The Special code is expired.") {
      toast(expiredSpecialCode, {
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
      // setFormValues({ username: "", password: "", email: "", terms: false, marketing: false, privacy: false, confirmPassword: '', specialCode: ''  })
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
      // setFormValues({ username: "", password: "", email: "", terms: false, confirmPassword: "" })
    }
  }

  const readSpecialCodeShow = async () => {
    setSignUpLoading(true);
    const res = await readSpecialCode(formValues.specialCode);

    if (res) {
      setSpecialCodeData(res);
    } else {
      console.error('API request failed:', res?.msg);
    }

    setSignUpLoading(false);
  };

  return (
    <div className='ltr login-img'>
      <ToastContainer />
      <div className='d-flex justify-content-end mt-2 me-2' >
        <LanguageSelect />
      </div>
      <div className="page">
        <div>
          {signUpLoading && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ zIndex: 1050, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <img src={globalLoader} alt="Loading..." className='w-25 h-25' />
            </div>)}
          <Container className="col col-login mx-auto text-center">
            <h2 className='text-white fw-bold'>{languageData && languageData?.filter((item) => item.title === 'title')[0]?.value || 'title'} </h2>
          </Container>
          <Container className="container-login100">
            <div className="wrap-0login10 p-0">
              <Card>
                <Card.Body>
                  <Form className="login100-form validate-form">
                    <span className="login100-form-title">{languageData && languageData?.filter((item) => item.title === 'register')[0]?.value || 'register'}</span>
                    {/* <div className="wrap-input100 validate-input mb-0">
                      <input className="input100" type="text" name="username" placeholder={languageData && languageData?.filter((item) => item.title === 'userNameSignUp')[0]?.value || 'userNameSignUp'} onChange={(e) => handleChange(e)} onKeyUp={() => validate(formValues)} value={formValues.username} />
                      <span className="focus-input100"></span>
                      <span className="symbol-input100">
                        <i className="mdi mdi-account" aria-hidden="true"></i>
                      </span>
                    </div>
                    <div className='mt-1 mb-2 text-danger text-sm-12'>{formErrors.username}</div> */}
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
                    <div className="wrap-input100 validate-input mb-0 mt-2">
                      <input className="input100" type="text" name="specialCode" placeholder={languageData && languageData?.filter((item) => item.title === 'specialCode')[0]?.value || 'Special Code'} onChange={(e) => handleSpecialCodeChange(e)} value={formValues.specialCode} />
                      <span className="focus-input100"></span>
                      <span className="symbol-input100">
                        <i className="mdi mdi-ticket-percent" aria-hidden="true"></i>
                      </span>
                    </div>
                    {formValues?.specialCode?.length > 0 ? (
                      specialCodeData.success == true ? <div className='mt-1 mb-2 text-primary text-sm-12'>{specialCodeData.description}</div> : specialCodeData?.success === false && specialCodeData?.message == "Wrong code" ? <div className='mt-1 mb-2 text-danger text-sm-12'>{translate(languageData, "wrongCode")}</div> : specialCodeData.success === false && specialCodeData.message === "This Redeem code is expired" ? <div className='mt-1 mb-2 text-danger text-sm-12'>{translate(languageData, "theSpecialCodeIsExpired")}</div> : specialCodeData.success === false && specialCodeData.message === "This Redeem code is doesn't exist" ? <div className='mt-1 mb-2 text-danger text-sm-12'>{translate(languageData, "RedeemCodeDoesn'tExist")}</div> : "")
                      : ("")}
                    {/* {formValues?.specialCode?.length > 0 ? (
                      specialCodeData.success === false && specialCodeData.message === "This Redeem code is expired" ? <div className='mt-1 mb-2 text-danger text-sm-12'>{translate(languageData, "expiredSpecialCode")}</div> : "")
                      : ("")} */}

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
                      {/* {signUpLoading ? <img src={globalLoader} alt='loader' width={50} /> : */}
                      <Button onClick={() => signUpServices()} className="login100-form-btn btn-primary" disabled={formErrors.privacy || formErrors.marketing || formErrors.terms || formErrors.confirmPassword || formErrors.password || formErrors.email }>
                        {languageData && languageData?.filter((item) => item.title === 'register')[0]?.value || 'register'}
                      </Button>
                    </div>
                    <div className="text-center pt-3">
                      <p className="text-dark mb-0"> {languageData && languageData?.filter((item) => item.title === 'alreadyHaveAnAccount')[0]?.value || 'alreadyHaveAnAccount'}<a onClick={() => navigate('/Login')} className="text-primary ms-1" style={{ cursor: "pointer" }}> {languageData && languageData?.filter((item) => item.title === 'alreadyHaveAnAccount2')[0]?.value || 'alreadyHaveAnAccount2'}</a></p>
                      <p className="text-dark mb-0"> {languageData && languageData?.filter((item) => item.title === 'OR')[0]?.value || 'OR'}</p>
                      <p className="text-dark mb-0"> {languageData && languageData?.filter((item) => item.title === 'registeredwithpublisher')[0]?.value || 'registeredwithpublisher'}<a onClick={() => navigate('/signUp/publisher')} className="text-primary ms-1" style={{ cursor: "pointer" }}> {languageData && languageData?.filter((item) => item.title === 'clickHere')[0]?.value || 'clickHere'}</a></p>
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
          {/* CONTAINER CLOSED */}
        </div>
      </div>
      {/* <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your NIP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="wrap-input100 validate-input mb-0 mt-2">
            <input className="input100" type="text" name="nip" placeholder="NIP" style={{ paddingLeft: "15px" }} />
          </div></Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-primary' onClick={() => signUpServices()}>{t('submit')}</Button>
          <Button variant="danger" onClick={() => handleClose()}>{t('close')}</Button>

        </Modal.Footer>
      </Modal> */}
    </div>

  )
}

export default SignUp