import React, { useState } from 'react'
import { forgotPassword } from '../../../services/authServices/authservices'
import { ToastContainer, toast } from 'react-toastify'
import globalLoader from '../../../assets/images/loader.svg'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSelect from '../../Components/Language/languageSelect'
import { useLanguage } from '../../Context/languageContext'
import { Container} from 'react-bootstrap';
const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const { t } = useTranslation();

    const { languageData } = useLanguage();


    const signUpEmailError = languageData && languageData?.filter((item) => item.title === 'signUpEmailError')[0]?.value || 'signUpEmailError'
    const signUpEmailError2 = languageData && languageData?.filter((item) => item.title === 'signUpEmailError2')[0]?.value || 'signUpEmailError2'

    const validate = () => {
        const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!email) {
            setErrors(signUpEmailError)
        } else if (!emailReg.test(email)) {
            setErrors(signUpEmailError2)
        } else {
            setErrors("")
        }
    }


    const passwordResetMessage = languageData && languageData?.filter((item) => item.title === 'passwordResetMessage')[0]?.value || 'passwordResetMessage'
    const passwordResetErrorsMessage = languageData && languageData?.filter((item) => item.title === 'emailnotregistered')[0]?.value || 'emailnotregistered'
    const passwordResetFailureMessage2 = languageData && languageData?.filter((item) => item.title === 'emailfieldisrequired')[0]?.value || 'emailfieldisrequired'


    const forgotPasswordServices = async () => {
        setLoading(true)

        const res = await forgotPassword(email)
        console.log(res.data, "46");
        if (res.status === 200 && res.data === "Password reset email successfully sent.") {
            toast(passwordResetMessage, {
                containerId: 'custom-toast-container',
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
            setLoading(false)
        } else if (res.data === "The email is not registered") {
            toast(passwordResetErrorsMessage, {
                containerId: 'custom-toast-container',
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
            setLoading(false)
        } else {
            toast(passwordResetFailureMessage2, {
                containerId: 'custom-toast-container',
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
            setLoading(false)
        }
    }


    return (
        <div className='ltr login-img'>
            <ToastContainer className="position-fixed" style={{top: "6rem"}} />
            <div className='d-flex justify-content-end mt-2 me-2' >
                <LanguageSelect />
            </div>
            <div className="page">
                <div>
                    <Container className="col col-login mx-auto text-center">
                        <h2 className='text-white fw-bold'>{languageData && languageData?.filter((item) => item.title === 'title')[0]?.value || 'title'}</h2>
                    </Container>
                    <div className="col mx-auto text-center">
                        <a href="../../index.html">
                            <img src="../../assets/images/brand/logo.png" className="header-brand-img" alt="" />
                        </a>
                    </div>
                    <div className="col-12 container-login100">
                        <div className="row">
                            <div className="col col-login mx-auto">
                                <form className="card shadow-none" method="post">
                                    <div className="card-body">
                                        <div className="text-center">
                                            <span className="login100-form-title">
                                                {languageData && languageData?.filter((item) => item.title === 'forgotPassword')[0]?.value || 'forgotPassword'}
                                            </span>
                                            <p className="text-muted">{languageData && languageData?.filter((item) => item.title === 'forgotPasswordSubHeading')[0]?.value || 'forgotPasswordSubHeading'}</p>
                                        </div>
                                        <div className="pt-3" id="forgot">
                                            <div className="form-group mb-0">
                                                <label className="form-label" for="eMail">E-Mail:</label>
                                                <input className="form-control" id="eMail" placeholder={languageData && languageData?.filter((item) => item.title === 'enterforgetmail')[0]?.value || 'forgotPasswordPlaceHolder'} type="email" onChange={(e) => setEmail(e.target.value)} onKeyUp={() => validate()} />
                                            </div>
                                            <div className='mt-1 mb-2 text-danger text-sm-12'>{errors}</div>


                                            <div className="submit">
                                                {loading ?
                                                    <img src={globalLoader} alt='loader' width={20} className='d-flex justify-content-center mx-auto' /> :
                                                    <a className="btn btn-primary d-grid" onClick={() => !errors ? forgotPasswordServices() : ""}>{languageData && languageData?.filter((item) => item.title === 'submit')[0]?.value || 'submit'}</a>}
                                            </div>
                                            <div className="text-center mt-4">
                                                <p className="text-dark mb-0" onClick={() => navigate('/login')}>{languageData && languageData?.filter((item) => item.title === 'forgotPasswordFooterText')[0]?.value || 'forgotPasswordFooterText'}<a className="text-primary ms-1" href="#">{languageData && languageData?.filter((item) => item.title === 'forgotPasswordFooterText2')[0]?.value || 'forgotPasswordFooterText2'}</a></p>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="card-footer">
                                        <div className="d-flex justify-content-center my-3">
                                            {/* <a href="javascript:void(0);" className="social-login  text-center me-4">
												<i className="fa fa-google"></i>
											</a>
											<a href="javascript:void(0);" className="social-login  text-center me-4">
												<i className="fa fa-facebook"></i>
											</a>
											<a href="javascript:void(0);" className="social-login  text-center">
												<i className="fa fa-twitter"></i>
											</a> */}
                                            <a href="javascript:void(0);" className="social-login text-center me-4 ">
                                                <i className="fa fa-youtube-play"></i>
                                            </a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ForgotPassword