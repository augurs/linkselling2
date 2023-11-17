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
import { portalArticleDetails } from "../../../services/Resubmitarticle/resubmitarticle"

function Portalarticledetails() {

    const userData = localStorage.getItem('userData');


    const [loading, setLoading] = useState(false)
    const [portalArticleDetail, setPortalArticleDetail] = useState([])

    const navigate = useNavigate();

    const { t } = useTranslation();
    const { languageData } = useLanguage();


    const language = localStorage.getItem('lang')
    const {id}= useParams();

    useEffect(() => {
        ordersListServices()
    }, [])

    const ordersListServices = async () => {
        setLoading(true)
        const res = await portalArticleDetails(id)
        if (res.success === true) {
            setPortalArticleDetail(res?.data)
            setLoading(false)
        }
    }


    return (
        <div className='ltr login-img'>
            <ToastContainer />
            <div className='d-flex mt-2 me-2 ms-2 mb-2 justify-content-between'>
                <h2 className='text-white'>{translate(languageData, "portalArticleDetails")}</h2>
                <LanguageSelect />
            </div>
            {loading ? <div className='d-flex'>
                <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
            </div> :
                <Row>
                    <Col>
                        <Card className='h-100'>
                            <Card.Header className='d-flex justify-content-between border-bottom pb-4'>
                                <h3 className='fw-semibold'>{translate(languageData, "ArticleDetails")}</h3>
                            </Card.Header>
                            <Card.Body >
                                <div className=''>
                                    <Row className='mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "TitleOfArticle")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                                {portalArticleDetail[0]?.title}
                                            </div>

                                        </Col>

                                    </Row>
                                    <Row className='mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "sidebarContent")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required" >
                                            <div dangerouslySetInnerHTML={{__html: portalArticleDetail[0]?.content}} />        
                                            </div>
                                        </Col>

                                    </Row>
                                    <Row className='mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "PublicationDate")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                                {portalArticleDetail[0]?.date_of_publication}
                                            </div>

                                        </Col>

                                    </Row>
                                    <Row className='mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "image")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                                <img src={portalArticleDetail[0]?.image}/>
                                            </div>

                                        </Col>

                                    </Row>
                                    <Row className='mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>Status</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                                {portalArticleDetail[0]?.status}
                                            </div>

                                        </Col>

                                    </Row>
                                    <Row className='mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "maxLinks")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                                {portalArticleDetail[0]?.max_links}
                                            </div>

                                        </Col>

                                    </Row>
                                </div>
                            </Card.Body>
                            <Card.Footer>
                            <Link to={`/portalarticledetails/${id}`}><Button>{translate(languageData, "iHavePublishedTheArticle")}</Button></Link>
                            </Card.Footer>
                        </Card>
                    </Col>

                </Row>
            }
        </div >


    );
}

export default Portalarticledetails;
