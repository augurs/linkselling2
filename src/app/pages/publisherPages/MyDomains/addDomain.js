import React from 'react'
import { useState } from 'react';
import { Button, Card, Col, Row} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import globalLoader from '../../../../assets/images/loader.svg'
import { translate } from '../../../../utility/helper';
import { useLanguage } from '../../../Context/languageContext';
import { addDomainUrl } from '../../../../services/PublisherServices/MyDomainServices/MyDomainServices';

const AddDomain = () => {
    const initialValues = {
        enterUrl: ""
    };

    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})
    const [orderLoading, setOrderLoading] = useState(false)
    const navigate = useNavigate()

    const publisherData = JSON.parse(localStorage.getItem("publisherData"))
    const currLang = localStorage.getItem('lang');

    const { languageData } = useLanguage()


    const addDomainServices = async () => {
        setOrderLoading(true);
        if (!formValues.enterUrl) {
            toast(translate(languageData, "DomainFieldNotEmpty"), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });

            setOrderLoading(false);
            return;
        }
        const res = await addDomainUrl(formValues, publisherData?.user?.id, currLang);
        if (res.success === true) {
            toast(translate(languageData, "DomainAddedSuccessfully"), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            setTimeout(() => {
                navigate('/publisher/listDomain')
              }, 1000);
        } else if (res.success === false && res.message.url[0]==="The url has already been taken.") {
            toast(`${translate(languageData, "TheurlHasAlreadyBeenTaken")}: ${res?.admin_email}`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
        }else{
            toast(translate(languageData,"somethingwentwrong"), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
        }

        setOrderLoading(false);
    };


    const validate = (values) => {
        let error = {};
        let isValid = true;
        if (!values.enterUrl) {
            error.enterUrl = translate(languageData, "PleaseEnterArticleTitle");
            isValid = false;
        }

        setFormErrors(error);
        return isValid;
    }

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormValues({ ...formValues, [name]: value });
    // };

    return (
        <div>

            <ToastContainer />
            <Card className='mt-4'>
                <Card.Header className='d-flex justify-content-between border-bottom pb-4'><h4 className='fw-semibold'>{translate(languageData, "addOneORMoreDomain")}</h4><Button className="btn btn-outline-primary" onClick={() => navigate('/publisher/listDomain')}>{translate(languageData, "back")}</Button></Card.Header>
                <Card.Body>
                    <div className='mt-6 border-bottom'>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "enterDomainUrl")} *</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0">
                                    <input className="input100" type="text" name="enterUrl" placeholder={translate(languageData, "enterDomainUrl")} style={{ paddingLeft: "15px" }} onChange={(e) => setFormValues({ ...formValues, enterUrl: e.target.value })} onKeyDown={() => validate(formValues)} />
                                </div>
                            </Col>
                        </Row>
                        <Row className='w-100 d-flex justify-content-end'>

                            <Col lg={6} className='ms-2'>
                            </Col>
                            <Col lg={5} className='mt-5 mb-2'>
                                <Button className='d-flex ms-auto' onClick={() => addDomainServices()}> {orderLoading ? <img src={globalLoader} alt='loader' width={20} /> : translate(languageData, "addDomain")}</Button>
                            </Col>
                        </Row>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default AddDomain