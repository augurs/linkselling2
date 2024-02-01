import React, { useState, useEffect } from 'react';
import { Container, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../../auth/login.css"
import { autoLoginPublisher, loginPublisher, sendingUserLoggedin } from '../../../../services/authServices/authservices';
import globalLoader from '../../../../assets/images/loader.svg'
import { ToastContainer, toast } from 'react-toastify';
import LanguageSelect from '../../../Components/Language/languageSelect';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../Context/languageContext';
import { translate } from '../../../../utility/helper';
import { useLocation } from 'react-router-dom';

function Login() {
  const initialValues = {
    email: "",
    password: "",
  };

  const userData = localStorage.getItem('publisherData');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const LoginAutoId = queryParams.get('id');

  useEffect(() => {
    if (userData) {
      navigate('/publisher')
    }
  }, [])

  useEffect(() => {
    if (LoginAutoId) {
      autoLoginPublisherServices()
    }
  }, [LoginAutoId])

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false)
  const [loginAutoPublisher, setLoginAutoPublisher] = useState([])

  const navigate = useNavigate();

  const { t } = useTranslation();
  const { languageData } = useLanguage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const language = localStorage.getItem('lang')


  const loginSuccessMessage = languageData && languageData?.filter((item) => item.title === 'loginSuccessMessage')[0]?.value || 'loginSuccessMessage';
  const loginFailurMessage1 = languageData && languageData?.filter((item) => item.title === 'loginFailureMessage1')[0]?.value || 'loginFailureMessage1';
  const loginFailureMessage2 = languageData && languageData?.filter((item) => item.title === 'loginFailureMessage2')[0]?.value || 'loginFailureMessage2';
  const alreadyusedLink = languageData && languageData?.filter((item) => item.title === 'alreadyLinkUsed')[0]?.value || 'alreadyLinkUsed';
  const loginSuccessMessageAuto = languageData && languageData?.filter((item) => item.title === 'loginSuccessMessage')[0]?.value || 'loginSuccessMessage';



  const validate = (value) => {
    let error = {};
    let isValid = true;
    const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isEmail = value.email.includes('@');

    if (!value.email) {
      error.email = languageData && languageData?.filter((item) => item.title === 'fieldrequired')[0]?.value || 'fieldrequired';
      isValid = false;
    } else if (isEmail) {
      if (!emailReg.test(value.email)) {
        error.email = languageData && languageData?.filter((item) => item.title === 'signUpEmailError2')[0]?.value || 'signUpEmailError2';
        isValid = false;
      }
    }

    if (!value.password) {
      error.password = languageData && languageData?.filter((item) => item.title === 'signUpPasswordError')[0]?.value || 'signUpPasswordError';
      isValid = false;
    }

    setFormErrors(error);
    return isValid;
  };



  const loginService = async () => {
    setLoading(true)

    localStorage.removeItem('userData');
    const res = await loginPublisher(
      formValues.email.includes('@') ? { email: formValues.email, password: formValues.password } : { username: formValues.email, password: formValues.password },
      language
    );
    console.log(res, "100");
    if (res.success === true) {
      setLoading(false)
      localStorage.setItem('publisherData', JSON.stringify(res))
      if (!language) {
        localStorage.setItem('lang', "pl")
      }
      toast(loginSuccessMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: 'success'
      });
      setTimeout(() => {
        navigate('/publisher')
      }, 1000);

    } else if (res.message === "The provided credentials are incorrect") {
      toast(loginFailurMessage1, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: 'error'
      });
      setLoading(false)
    } else if (res.user_verified === 0) {
      toast(translate(languageData, "YourEmailNotVerifiedPleaseCheckMail"), {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: 'error'
      });
      setLoading(false)
    } else {
      toast(loginFailureMessage2, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: 'error'
      });
      setLoading(false)
    }
  }

  const autoLoginPublisherServices = async () => {
    setLoading(true)
    localStorage.removeItem("userData");
    const res = await autoLoginPublisher(LoginAutoId)
    console.log(res?.user.logged_in, "166");
    if (res?.success === true && res?.user.logged_in == "0") {
      setLoginAutoPublisher(res?.data)
      localStorage.setItem('publisherData', JSON.stringify(res))
      if (!language) {
        localStorage.setItem('lang', "pl")
      }
      toast(loginSuccessMessageAuto, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: 'success'
      });
      setTimeout(() => {
        navigate('/publisher')
      }, 1000);
      setLoading(false)
      sendingUserLoggedin(1, res?.user?.id)
    } else if (res?.user?.logged_in == "1") {
      toast(alreadyusedLink, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: 'error'
      });
      setTimeout(() => {
        navigate('/login/publisher')
      }, 1000);
      setLoading(false)
    }
  }



  return (
    <div className='ltr login-img'>
      <ToastContainer className="position-fixed" style={{ top: "6rem" }} />

      <div className='d-flex justify-content-end mt-2 me-2' >
        <LanguageSelect />
      </div>

      <div className="page">
        <div>
          <Container className="col col-login mx-auto text-center">
            <h2 className='text-white fw-bold'>{languageData && languageData?.filter((item) => item.title === 'publisherTitle')[0]?.value || 'publisherTitle'}</h2>
          </Container>
          <Container className="container-login100">
            <div className="wrap-0login10 p-0">
              <Card>
                <Card.Body>
                  <Form className="login100-form validate-form">
                    <span className="login100-form-title">{languageData && languageData?.filter((item) => item.title === 'signIn')[0]?.value || 'signIn'}</span>
                    <div className="wrap-input100 validate-input mb-0" data-bs-validate="Valid email is required: ex@abc.xyz">
                      <input className="input100" type="text" name="email" placeholder={languageData && languageData?.filter((item) => item.title === 'EmailorUname')[0]?.value || 'EmailorUname'} onChange={(e) => handleChange(e)} onKeyUp={() => validate(formValues)} />
                      <span className="focus-input100"></span>
                      <span className="symbol-input100">
                        <i className="zmdi zmdi-email" aria-hidden="true"></i>
                      </span>
                    </div>
                    <div className='text-danger mb-2 mt-1 text-sm-12'>{formErrors.email}</div>
                    <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                      <input className="input100" type="password" name="password" placeholder={languageData && languageData?.filter((item) => item.title === 'passwordSignUp')[0]?.value || 'passwordSignUp'} onChange={(e) => handleChange(e)} onKeyUp={() => validate(formValues)} />
                      <span className="focus-input100"></span>
                      <span className="symbol-input100">
                        <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                      </span>
                    </div>
                    <div className='text-danger mt-1 text-sm-12'>{formErrors.password}</div>
                    <div className="text-end pt-1">
                      <p className="mb-0">
                        <a onClick={() => navigate("/forgotpassword")} className="text-primary ms-1" style={{ cursor: "pointer" }}>{languageData && languageData?.filter((item) => item.title === 'forgotPassword')[0]?.value || 'forgotPassword'}?</a>
                      </p>
                    </div>
                    <div class="container-login100-form-btn text-primary">
                      {loading ? <img src={globalLoader} alt='loader' width={50} /> :
                        <a class="login100-form-btn btn-primary" style={{ cursor: "pointer" }} onClick={() => validate(formValues) ? loginService() : ""}>
                          {languageData && languageData?.filter((item) => item.title === 'signIn')[0]?.value || 'signIn'}
                        </a>}
                    </div>
                    <div className="text-center pt-3">
                      <p className="text-dark mb-0">
                        {languageData && languageData?.filter((item) => item.title === 'haveAnAccount')[0]?.value || 'haveAnAccount'}
                        <a className="text-primary ms-1" onClick={() => navigate('/signUp/publisher')} style={{ cursor: "pointer" }}>{languageData && languageData?.filter((item) => item.title === 'haveAnAccount2')[0]?.value || 'haveAnAccount2'}</a>
                      </p>
                      <p className="text-dark mb-0">
                        OR
                      </p>
                      <p className="text-dark mb-0">
                        {languageData && languageData?.filter((item) => item.title === 'loginWithUser')[0]?.value || 'loginWithUser'}
                        <a className="text-primary ms-1" onClick={() => navigate('/login')} style={{ cursor: "pointer" }}>{languageData && languageData?.filter((item) => item.title === 'clickHere')[0]?.value || 'clickHere'}</a>
                      </p>
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

  );
}

export default Login;
