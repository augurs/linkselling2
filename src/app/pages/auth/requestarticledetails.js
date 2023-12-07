import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./login.css"
import globalLoader from '../../../assets/images/loader.svg'
import { ToastContainer, toast } from 'react-toastify';
import LanguageSelect from '../../Components/Language/languageSelect';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../Context/languageContext';
import { translate } from '../../../utility/helper';
import { requestArticleDetails, portalArticleDetailsReject } from "../../../services/Resubmitarticle/resubmitarticle"
import { FaCopy } from 'react-icons/fa';
function Portalarticledetails() {

    const userData = localStorage.getItem('userData');


    const [loading, setLoading] = useState(false)
    const [portalArticleDetail, setPortalArticleDetail] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [comment, setComment] = useState();

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
        const res = await requestArticleDetails(id)
        if (res.success === true) {
            setPortalArticleDetail(res?.data)
            setLoading(false)
        }
    }

    const handleCopyClick = (content) => {
        const tempInput = document.createElement('textarea');
        const textContent = new DOMParser().parseFromString(content, 'text/html').body.textContent;

        tempInput.value = textContent;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        toast.success(translate(languageData, "Contentcopiedtoclipboard"));
    };

    const handleRejectClick = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleRejectSubmit = async () => {
        setShowModal(false);
        setLoading(true)
        const res = await portalArticleDetailsReject(portalArticleDetail[0]?.id, "requestarticle", comment)
        if (res.success === true) {
            toast(translate(languageData, "CommentrejectAddedSuccessfully"), {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            //   setTimeout(() => {
            //     navigate('/thanksPage')
            //   }, 1000);
            setShowModal(false);
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
                                                <button className="copy-button" onClick={() => handleCopyClick(portalArticleDetail[0]?.title)}>
                                                    <FaCopy />
                                                </button>
                                            </div>

                                        </Col>

                                    </Row>
                                    <Row className='mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "sidebarContent")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div id='contentToCopy' className="wrap-input100 validate-input d-flex" data-bs-validate="Password is required">
                                                <div dangerouslySetInnerHTML={{ __html: portalArticleDetail[0]?.content }} />
                                                <button className="copy-button position-relative" onClick={handleCopyClick}>
                                                    <FaCopy />
                                                </button>
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
                                                <a href={`https://linkselling.augurslive.com/LinkSellingSystem/public/articles/${portalArticleDetail[0]?.image}`} download>
                                                    <img src={`https://linkselling.augurslive.com/LinkSellingSystem/public/articles/${portalArticleDetail[0]?.image}`} alt="Article Image" className='w-25' />
                                                </a>
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
                                </div>
                            </Card.Body>
                            <Card.Footer className='d-flex gap-2'>
                            <Link to={`/requestarticledetails/requestarticle/${id}`}><Button>{translate(languageData, "iHavePublishedTheArticle")}</Button></Link>
                            <Button className='btn-danger' onClick={handleRejectClick}>{translate(languageData, "IhaveRejected")}</Button>
                            </Card.Footer>
                        </Card>
                    </Col>

                </Row>
            }
             <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{translate(languageData, "CommentsAndRecommendations")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className='align-items-center mt-2'>
                        <Col xs={12} md={4}>
                            <span>{translate(languageData, "CommentsAndRecommendations")} *</span>
                        </Col>
                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                <textarea className="input100" type="text" name="comment" cols={3} rows={3} style={{ paddingLeft: "5px" }} onChange={(e) => setComment(e.target.value)} />
                            </div>
                            {/* <div className='text-danger text-center mt-1'>{formErrors.comment}</div> */}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        {translate(languageData, "close")}
                    </Button>
                    <Button variant="primary" onClick={handleRejectSubmit}>
                        {translate(languageData, "submit")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >


    );
}

export default Portalarticledetails;
