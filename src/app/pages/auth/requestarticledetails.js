import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Image } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./login.css"
import globalLoader from '../../../assets/images/loader.svg'
import { ToastContainer, toast } from 'react-toastify';
import LanguageSelect from '../../Components/Language/languageSelect';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../Context/languageContext';
import { translate } from '../../../utility/helper';
import { requestArticleDetails, portalArticleDetailsReject, portalArticleDetailsMessage } from "../../../services/Resubmitarticle/resubmitarticle"
import { FaCopy } from 'react-icons/fa';
import custImg from "../../../assets/images/users/user.png"
import publisherImg from "../../../assets/images/users/publisher1.png"
import { chatSectionService, sentToPublisherMessage } from '../../../services/OrdersServices/ordersServices';
import { baseURL2 } from '../../../utility/data';
import moment from 'moment';
import { IoCheckmark, IoCheckmarkDoneOutline } from 'react-icons/io5';

function Portalarticledetails() {

    const userData = localStorage.getItem('userData');


    const [loading, setLoading] = useState(false)
    const [portalArticleDetail, setPortalArticleDetail] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [comment, setComment] = useState();
    const [message, setMessage] = useState();
    const [portalLang, setPortalLang] = useState([])
    const [modalType, setModalType] = useState("");
    const [chatData, setChatData] = useState([]);
    const { languageData, setLanguage } = useLanguage();

    const { id } = useParams();


    useEffect(() => {
        const storedLanguage = localStorage.getItem('lang');
        if (storedLanguage) {
            setLanguage(storedLanguage);
        }
    }, [setLanguage]);

    useEffect(() => {
        ordersListServices()
    }, [])

    const ordersListServices = async () => {
        setLoading(true);
        const res = await requestArticleDetails(id);
        if (res.success === true) {
            setPortalArticleDetail(res?.data);
            const apiLanguage = res?.data[0]?.language;
            setPortalLang(apiLanguage);
            if (apiLanguage) {
                setLanguage(apiLanguage);
                localStorage.setItem('lang', apiLanguage);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        if (portalLang === undefined) {
            return (
                <div>
                    Loading...
                </div>
            );
        }
    }, [portalLang])

    useEffect(() => {
        chatSectionShow()
    }, [portalArticleDetail])

    const handleCopyClick = (content) => {
        const tempInput = document.createElement('textarea');
        const textContent = new DOMParser().parseFromString(content, 'text/html').body.textContent;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;

        tempInput.value = textContent;
        document.body.appendChild(tempInput);
        document.body.appendChild(tempDiv);
        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        document.body.removeChild(tempDiv);
        toast(translate(languageData, "Contentcopiedtoclipboard"), {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            type: 'success'
        });
    };

    const handleRejectClick = () => {
        setModalType("reject");
        setShowModal(true);
    };

    const handleSendMsgClick = () => {
        setModalType("message");
        setShowModal(true);
    };

    const handleModalClose = () => {
        setModalType("");
        setShowModal(false);
    };

    const handleSendPublisherMsgClick = () => {
        setModalType("pmessage");
        setShowModal(true);
    };

    const handleRejectSubmit = async () => {
        setShowModal(false);
        setLoading(true);

        let res;
        try {
            if (modalType === "reject") {
                res = await portalArticleDetailsReject(portalArticleDetail[0]?.id, "requestarticle", comment);
            } else if (modalType === "message") {
                res = await portalArticleDetailsMessage(portalArticleDetail[0]?.id, "requestarticle", message);
            } else {
                res = await sentToPublisherMessage(portalArticleDetail[0]?.id, "requestarticle", message);
            }

            if (res.success === true) {
                const successMessage = modalType === "reject"
                    ? translate(languageData, "CommentrejectAddedSuccessfully")
                    : translate(languageData, "dataaddedsuccessfully");

                toast(successMessage, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'success'
                });
                ordersListServices();
                setShowModal(false);
            } else {
                throw new Error('API call failed');
            }
        } catch (error) {
            const errorMessage = translate(languageData, "loginFailureMessage2");
            toast(errorMessage, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const chatSectionShow = async () => {
        setLoading(true);
        const res = await chatSectionService(portalArticleDetail[0]?.id, "requestarticle");

        if (res.success === true) {
            setChatData(res.data);
        } else {
            console.error('API request failed:', res.msg);

            if (res.success === false && res.data.length === 0) {
                setChatData([]);
            }
        }

        setLoading(false);
    };

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
                                            <span>{translate(languageData, "AddArtiLead")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0">
                                                {portalArticleDetail[0]?.lead || "--"}
                                                <button className="copy-button" onClick={() => handleCopyClick(portalArticleDetail[0]?.lead)}>
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
                                                <button className="copy-button position-relative" onClick={() => handleCopyClick(portalArticleDetail[0]?.content)}>
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
                                                <a href={`${baseURL2}/LinkSellingSystem/public/articles/${portalArticleDetail[0]?.image}`} download>
                                                    <img src={`${baseURL2}/LinkSellingSystem/public/articles/${portalArticleDetail[0]?.image}`} alt="Article Image" className='w-25' />
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
                                                {portalArticleDetail[0]?.comment || "--"}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mt-5">
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "communicationPanel")}</span>
                                        </Col>
                                        {chatData.length > 0 ? (
                                            <Col xs={12} md={8} className="mt-3 mt-md-0 border border-3 timeline">
                                                {chatData.map((message, index) => (
                                                    <Row key={index} className="mb-3 align-items-center justify-content-center mt-4">
                                                        <Col xs={4} className="text-left">
                                                            {message.sender === 'user' && (
                                                                <div className='border p-1 square bg-lightgray rounded-1 mb-4'>
                                                                    <div>{message.message}</div>
                                                                    <div style={{ fontSize: '0.66em' }} className='d-flex justify-content-end'>
                                                                        <div>{moment(message?.date, 'YYYY-MM-DD HH:mm:ss').format('h:mm A D MMM, YYYY')}</div>
                                                                    </div>

                                                                </div>
                                                            )}
                                                        </Col>
                                                        <Col xs={1} className="d-flex flex-column align-items-center justify-content-center">
                                                            {message.sender === 'user' ? (
                                                                <div className="chat-image mb-4">
                                                                    <Image src={custImg} roundedCircle /></div>
                                                            ) : (
                                                                <div className="chat-image mb-4">
                                                                    <Image src={publisherImg} roundedCircle /></div>
                                                            )}
                                                        </Col>
                                                        <Col xs={4} className="text-right">
                                                            {message.sender === 'publisher' && (
                                                                <div className='border p-1 square bg-lightgray rounded-1 mb-4'>
                                                                    <div>{message.message}</div>
                                                                    <div style={{ fontSize: '0.66em' }} className='d-flex justify-content-end align-items-center gap-1'>
                                                                        <div>{moment(message?.date, 'YYYY-MM-DD HH:mm:ss').format('h:mm A D MMM, YYYY')}</div>
                                                                        <div >{message.seenStatus == 0 ? <IoCheckmark fontSize={14} /> : <IoCheckmarkDoneOutline fontSize={14} color='green' />}</div>
                                                                    </div>

                                                                </div>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                ))}
                                            </Col>) : (
                                            <Col xs={12} md={8}>
                                                {translate(languageData, "noMsgAvailable.")}
                                            </Col>
                                        )}
                                    </Row>

                                </div>
                            </Card.Body>
                            <Card.Footer className='d-flex gap-2'>
                                {portalArticleDetail[0]?.status === "Accept" && (<>
                                    <Link to={`/requestarticledetails/requestarticle/${id}`}><Button>{translate(languageData, "iHavePublishedTheArticle")}</Button></Link>
                                    <Button className='btn-danger' onClick={handleRejectClick}>{translate(languageData, "IhaveRejected")}</Button></>)}
                                <Button className='btn-info' onClick={handleSendMsgClick}>{translate(languageData, "sendMessage")}</Button>
                            </Card.Footer>
                        </Card>
                    </Col>

                </Row>
            }
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === "reject"
                            ? translate(languageData, "CommentsAndRecommendations")
                            : translate(languageData, "sendMessage")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className='align-items-center mt-2'>
                        <Col xs={12} md={4}>
                            <span>
                                {modalType === "reject"
                                    ? translate(languageData, "CommentsAndRecommendations")
                                    : translate(languageData, "sendMessage")}
                                *
                            </span>
                        </Col>
                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                {modalType === "reject" ? (
                                    <textarea className="input100" type="text" name="comment" cols={3} rows={3} style={{ paddingLeft: "5px" }} onChange={(e) => setComment(e.target.value)} />
                                ) : (
                                    <textarea className="input100" type="text" name="message" cols={3} rows={3} style={{ paddingLeft: "5px" }} onChange={(e) => setMessage(e.target.value)} />
                                )}
                            </div>
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
