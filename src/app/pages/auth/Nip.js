import React, { useState } from 'react'
import { Card, Container, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import LanguageSelect from '../../Components/Language/languageSelect'
import { registerNip } from '../../../services/authServices/authservices'
import globalLoader from '../../../assets/images/loader.svg'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../../Context/languageContext'

const Nip = () => {


    const initialValues = {
        email: "",
        nipNumber: "",
    };

    const { id } = useParams()

    const { t } = useTranslation();

    const navigate = useNavigate()

    const { languageData } = useLanguage();


    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})
    const [loader, setLoader] = useState(false)



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };



    const validate = (value) => {
        let error = {};
        let isValid = true;
        // const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const nipReg = /^[0-9]*$/;

        // if (!value.email) {
        //     error.email =  languageData &&  languageData?.filter((item) => item.title === 'signUpEmailError')[0]?.value || 'signUpEmailError';
        //     isValid = false;
        // } else if (!emailReg.test(value.email)) {
        //     error.email = languageData &&  languageData?.filter((item) => item.title === 'signUpEmailError2')[0]?.value || 'signUpEmailError2';
        //     isValid = false;
        // }
        if (!value.nipNumber) {
            error.nipNumber = "Nip jest wymagany"
            isValid = false;
        } else if (!nipReg.test(value.nipNumber)) {
            error.nipNumber = "Proszę wpisać tylko numer"
            isValid = false;
        }

        setFormErrors(error);
        return isValid;
    };




    const nipRegisterServices = async () => {
        setLoader(true)
        const res = await registerNip(formValues, id)
        console.log(res);

        if (res?.success === true && res.message === "NIP response get successfully.") {
            toast("Dane zostały zapisane pomyślnie", {
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

            setLoader(false)
            setTimeout(() => {
                navigate('/nipDetails')
            }, 1000);
            let nipData = JSON.stringify(res?.response)
            localStorage.setItem('nipData', nipData)
            let userData = JSON.stringify(res?.user)
            localStorage.setItem('userData', userData)
            localStorage.setItem('accessToken', res?.access_token)


        } else if (res?.success === false && res?.message === "This nip number already registered") {
            toast("Ten numer NIP już jest zarejestrowany", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                type: 'warning'
            });
            setLoader(false);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        }
        else if (res?.success === false && res?.errors?.email[0] === "The email has already been taken.") {
            toast("E-mail został już zajęty", {
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
            setLoader(false)
        } else if (res?.message === "Invalid NIP Number." && res?.success === false) {
            toast("Nieprawidłowy numer NIP", {
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
            setLoader(false)
        }

    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (validate(formValues)) {
                nipRegisterServices();
            }
        }
    };



    return (
        <div className='ltr login-img' onKeyPress={handleKeyPress}>
            <ToastContainer />
            <div className=' justify-content-end mt-2 me-2 d-none' >
                <LanguageSelect />
            </div>
            <div className='page'>
                <div>
                    <Container className="col col-login mx-auto text-center">
                        <h2 className='text-white fw-bold'>{t('authHeading')}</h2>
                    </Container>
                    <Container className="container-login100">
                        <div className='wrap-0login10 p-0'>
                            <Card >
                                <Card.Body>
                                    <Form className="login100-form validate-form">
                                        <span className="login100-form-title">{t('nipHeading')}</span>
                                        <div className="wrap-input100 validate-input mb-0 mt-2">
                                            <input className="input100" type="number" name="nipNumber" placeholder={t('nipPlaceHolder')} onChange={(e) => handleChange(e)} onKeyUp={() => validate(formValues)} />
                                            <span className="focus-input100"></span>
                                            <span className="symbol-input100">
                                                <i className="mdi mdi-domain" aria-hidden="true"></i>
                                            </span>
                                        </div>
                                        <div className='text-danger mb-2 mt-1 text-sm-12'>{formErrors.nipNumber}</div>
                                        <div className="submit mt-4">
                                            {loader ?

                                                <img src={globalLoader} alt='loader' width={20} className='d-flex justify-content-center mx-auto' /> :
                                                <a className="btn btn-primary d-grid" onClick={() => validate(formValues) ? nipRegisterServices() : ""}>{t('submit')}</a>}
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>

                        </div>

                    </Container>
                </div>

            </div>
        </div>
    )
}

export default Nip