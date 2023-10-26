import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Form, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { signup } from '../../../services/authServices/authservices';
import { ToastContainer, toast } from 'react-toastify';
import globalLoader from '../../../assets/images/loader.svg'
import LanguageSelect from '../../Components/Language/languageSelect';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../Context/languageContext';

const SignUp = () => {

  const initialValues = {
    username: "",
    email: "",
    password: "",
    terms: "",
  };

  const { t, i18n } = useTranslation()

  const { languageData } = useLanguage();

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [isCheckboxChecked, setIsCheckboxChecked] = useState();
  const [showModal, setShowModal] = useState(false)

  const currLang = localStorage.getItem('lang');

  // const currentLanguage = i18n.language;


  useEffect(() => {
    if (isCheckboxChecked || isCheckboxChecked === false) {
      validate(formValues);
    }
  }, [isCheckboxChecked])




  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormValues({ ...formValues, [name]: checked })
    setIsCheckboxChecked(checked)
  }



  const validate = (values) => {
    let error = {};
    let isValid = true;
    const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
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
    if (!values.terms) {
      error.terms = languageData && languageData?.filter((item) => item.title === 'terms')[0]?.value || 'terms';
      isValid = false;
    }
    setFormErrors(error);
    return isValid;
  }




  const signUpSuccessMessage = languageData && languageData?.filter((item) => item.title === 'signUpSuccessMessage')[0]?.value || 'signUpSuccessMessage';
  const signUpErrorsMessage = languageData && languageData?.filter((item) => item.title === 'signUpErrorMessage')[0]?.value || 'signUpErrorMessage';
  const loginFailureMessage2 = languageData && languageData?.filter((item) => item.title === 'loginFailureMessage2')[0]?.value || 'loginFailureMessage2';






  const signUpServices = async () => {
    setSignUpLoading(true)
    let values = {
      ...formValues,
      language: currLang
    }
    const res = await signup(values , currLang);
    if (res.success === true) {
      toast(signUpSuccessMessage, {
        position: "top-right",
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
      setFormValues({ username: "", password: "", email: "", terms: false })
      setTimeout(() => {
        navigate('/RegistrationDone')
      }, 2000);
    } else if (res.message[0] === "The email has already been taken.") {
      toast(signUpErrorsMessage, {
        position: "top-right",
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
      setFormValues({ username: "", password: "", email: "", terms: false })
    } else {
      toast(loginFailureMessage2, {
        position: "top-right",
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
      setFormValues({ username: "", password: "", email: "", terms: false })
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
            <h2 className='text-white fw-bold'>{languageData && languageData?.filter((item) => item.title === 'title')[0]?.value || 'title'} </h2>
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
                    {/* <div className="text-end pt-1">
                      <p className="mb-0">
                        <a href="forgot-password.html" className="text-primary ms-1">Forgot Password?</a>
                      </p>
                    </div> */}
                    <label className="custom-control custom-checkbox mt-4">
                      <input type="checkbox" className="custom-control-input" name='terms' onChange={(e) => {
                        handleCheckbox(e);

                      }} checked={formValues.terms} />
                      <span className="custom-control-label mt-2">{languageData && languageData?.filter((item) => item.title === 'singUpTermsAndCondition')[0]?.value || 'singUpTermsAndCondition'} <a>{languageData && languageData?.filter((item) => item.title === 'singUpTermsAndCondition2')[0]?.value || 'singUpTermsAndCondition2'}</a></span>
                    </label>
                    <div className='mt-1 mb-2 text-danger text-sm-12'>{formErrors.terms}</div>
                    <div className="container-login100-form-btn text-primary">
                      {signUpLoading ? <img src={globalLoader} alt='loader' width={50} /> :
                        <a onClick={() => validate(formValues) ? signUpServices() : ""} className="login100-form-btn btn-primary" style={{ cursor: "pointer" }}>
                          {languageData && languageData?.filter((item) => item.title === 'register')[0]?.value || 'register'}
                        </a>}
                    </div>
                    <div className="text-center pt-3">
                      <p className="text-dark mb-0"> {languageData && languageData?.filter((item) => item.title === 'alreadyHaveAnAccount')[0]?.value || 'alreadyHaveAnAccount'}<a onClick={() => navigate('/Login')} className="text-primary ms-1" style={{ cursor: "pointer" }}> {languageData && languageData?.filter((item) => item.title === 'alreadyHaveAnAccount2')[0]?.value || 'alreadyHaveAnAccount2'}</a></p>
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