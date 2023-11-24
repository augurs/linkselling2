import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./login.css"
import globalLoader from '../../../assets/images/loader.svg'
import { ToastContainer, toast } from 'react-toastify';
import LanguageSelect from '../../Components/Language/languageSelect';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../Context/languageContext';
import { translate } from '../../../utility/helper';
import { portallinksubmit, portalArticleDetails } from "../../../services/Resubmitarticle/resubmitarticle"


function Portallinkupdatewithid() {
    const { id } = useParams();

    const userData = localStorage.getItem('userData');
    const [link, setLink] = useState('');

    const [loading, setLoading] = useState(false)
    const [portalArticleDetail, setPortalArticleDetail] = useState([])

    const navigate = useNavigate();

    const { t } = useTranslation();
    const { languageData } = useLanguage();


    const language = localStorage.getItem('lang')

    

    const submitlinkportal = async () => {
        setLoading(true)
        const res = await portallinksubmit(link, id, "requestarticle")
        if (res.success === true) {
            toast(translate(languageData, "LinkAddedSuccessfully"), {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            setTimeout(() => {
                navigate('#')
            }, 1000);
            setLoading(false)
        } else {
            toast(translate(languageData, "loginFailureMessage2"), {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
            setLoading(false)
        }
    }
    return (
        <div className='ltr login-img'>
            <ToastContainer />
            <div className='d-flex mt-2 me-2 ms-2 mb-2 justify-content-between'>
                <h2 className='text-white'>{translate(languageData, "articleLinkSubmission")}</h2>
                <LanguageSelect />
            </div>
            {loading ? <div className='d-flex'>
                <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
            </div> :
                <Row>
                    <Col>
                        <Card className='h-100'>
                            <Card.Header className='d-flex justify-content-between border-bottom pb-4'>
                                <h3 className='fw-semibold'>{translate(languageData, "linkSubmission")}</h3>
                            </Card.Header>
                            <Card.Body >
                                <div className=''>
                                    <Row className='mt-5'>
                                        <Col xs={12} md={4} className="mt-3 mt-md-0 d-flex align-items-center">
                                            <span>{translate(languageData, "WebUrl")} *</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                                <input className="input100" type="url" name="title" placeholder={translate(languageData, "writingUrl")} style={{ paddingLeft: "15px" }} onChange={(e) => setLink(e.target.value)} />
                                            </div>
                                            {/* <div className='text-danger text-center mt-1'>{formErrors.title}</div> */}
                                        </Col>

                                    </Row>
                                </div>
                            </Card.Body>
                            <Card.Footer className='d-flex justify-content-end'>
                                <Button onClick={() => submitlinkportal()}>{translate(languageData, "submit")}</Button>
                            </Card.Footer>
                        </Card>
                    </Col>

                </Row>
            }
        </div >


    );
}

export default Portallinkupdatewithid;
