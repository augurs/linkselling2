import React, { useState, useEffect} from 'react';
import { Card, Row, Col} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import globalLoader from '../../../assets/images/loader.svg'
import { useLanguage } from '../../Context/languageContext';
import { translate } from '../../../utility/helper';
import { ordersListArticle} from "../../../services/OrdersServices/ordersServices"

function VieworderArticle() {

    const userData = localStorage.getItem('userData');
    const [loading, setLoading] = useState(false)
    const [portalArticleDetail, setPortalArticleDetail] = useState([])
    const { languageData } = useLanguage();
    const { id } = useParams();

    useEffect(() => {
        ordersListServices()
    }, [])

    const ordersListServices = async () => {
        setLoading(true)
        const res = await ordersListArticle(id)
        if (res.success === true) {
            setPortalArticleDetail(res?.data)
            setLoading(false)
        }
    }
    return (
        <div className='ltr'>
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
                                            <div className="wrap-input100 validate-input d-flex" data-bs-validate="Password is required">
                                                <div dangerouslySetInnerHTML={{ __html: portalArticleDetail[0]?.content }} />
                                                
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "image")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                                <a href={`https://linkselling.augurslive.com/LinkSellingSystem/public/articles/${portalArticleDetail[0]?.image}`} download>
                                                    <img src={`https://linkselling.augurslive.com/LinkSellingSystem/public/articles/${portalArticleDetail[0]?.image}`} alt="Article Image" className='w-25' />
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "CommentsAndRecommendations")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0 " data-bs-validate="Password is required">
                                                {portalArticleDetail[0]?.comment}
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
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            }
        </div >


    );
}

export default VieworderArticle;
