import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import globalLoader from '../../../assets/images/loader.svg';
import { useLanguage } from '../../Context/languageContext';
import "./viewOrder.css";
import { translate } from '../../../utility/helper';
import custImg from "../../../assets/images/users/user.png"
import publisherImg from "../../../assets/images/users/publisher1.png"
import { chatSectionService, ordersListArticle, ordersListArticle1, sentToPublisherMessage, sentUserRejectMessage } from '../../../services/OrdersServices/ordersServices';
import { ToastContainer, toast } from 'react-toastify';
import { IoCheckmark, IoCheckmarkDoneOutline } from "react-icons/io5";
import moment from "moment";
function VieworderArticle() {
  const userData = localStorage.getItem('userData');
  const [loading, setLoading] = useState(false);
  const [portalArticleDetail, setPortalArticleDetail] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [sendMsg, setSendMsg] = useState();
  const { languageData } = useLanguage();
  const { id, articleid } = useParams();
  const [modalType, setModalType] = useState("");

  const handleChatModalClose = () => setShowChatModal(false);
  const handleChatModalShow = () => setShowChatModal(true);

  useEffect(() => {
    if (articleid === 'addnewarticle') {
      ordersListServices();
    } else if (articleid === 'requestarticle') {
      ordersListServices1();
    } else {
      console.error('Invalid articleid:', articleid);
    }
  }, [articleid]);


  const ordersListServices = async () => {
    setLoading(true);
    const res = await ordersListArticle(id);

    if (res.success === true) {
      setPortalArticleDetail(res.data);
    } else {
      console.error('API request failed:', res.msg);

      if (res.success === false && res.data.length === 0) {
        setPortalArticleDetail([]);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    chatSectionShow()
  }, [])

  const ordersListServices1 = async () => {
    setLoading(true);
    const res = await ordersListArticle1(id);

    if (res.success === true) {
      setPortalArticleDetail(res.data);
    } else {
      console.error('API request failed:', res.msg);

      if (res.success === false && res.data.length === 0) {
        setPortalArticleDetail([]);
      }
    }

    setLoading(false);
  };


  const getStatusMessage = (status) => {
    let buttonClass = "btn btn-outline-primary btn-pill";
    let buttonText = "";
    switch (status) {
      case "Pending":
        buttonClass = "btn btn-outline-warning btn-pill";
        buttonText = <small>{translate(languageData, "pending")}</small>;
        break;
      case "AssignedToWriter":
        buttonClass = "btn btn-outline-info btn-pill";
        buttonText = <small>{translate(languageData, "AssignedToWriter")}</small>;
        break;
      case "Completed":
        buttonClass = "btn btn-outline-success btn-pill";
        buttonText = <small>{translate(languageData, "Completed")}</small>;
        break;
      case "RequestChanges":
        buttonClass = "btn btn-outline-warning btn-pill";
        buttonText = <small>{translate(languageData, "RequestChanges")}</small>;
        break;
      case "Rejected":
        buttonClass = "btn btn-outline-danger btn-pill";
        buttonText = <small>{translate(languageData, "Rejected")}</small>;
        break;
      case "Accepted":
        buttonClass = "btn btn-outline-secondary btn-pill";
        buttonText = <small>{translate(languageData, "Accepted")}</small>;
        break;
      case "CustomerReview":
        buttonClass = "btn btn-outline-warning btn-pill";
        buttonText = <small>{translate(languageData, "CustomerReview")}</small>;
        break;
      case "RejectedLink":
        buttonClass = "btn btn-outline-danger btn-pill";
        buttonText = <small>{translate(languageData, "RejectedLink")}</small>;
        break;
      case "Published":
        buttonClass = "btn btn-outline-primary btn-pill";
        buttonText = <small>{translate(languageData, "Published")}</small>;
        break;
      case "PendingForAssing":
        buttonClass = "btn btn-outline-warning btn-pill";
        buttonText = <small>{translate(languageData, "PendingForAssing")}</small>;
        break;
      case "Accept":
        buttonClass = "btn btn-outline-dark btn-pill";
        buttonText = <small>{translate(languageData, "Accept")}</small>;
        break;
      case "RejectPublication":
        buttonClass = "btn btn-outline-danger btn-pill";
        buttonText = <small>{translate(languageData, "RejectPublication")}</small>;
        break;
      case "AcceptPublication":
        buttonClass = "btn btn-outline-success btn-pill";
        buttonText = <small>{translate(languageData, "AcceptPublication")}</small>;
        break;
      case "ReadyToPublish":
        buttonClass = "btn btn-outline-primary btn-pill";
        buttonText = <small>{translate(languageData, "ReadyToPublish")}</small>;
        break;
      case "RejectedByPortal":
        buttonClass = "btn btn-outline-primary btn-pill";
        buttonText = <small>{translate(languageData, "RejectedByPortal")}</small>;
        break;
      default:

        buttonText = status;
    }
    return <span className={`${buttonClass} d-flex justify-content-center align-items-center`}>
      {buttonText}
    </span>
  };

  const chatSectionShow = async () => {
    setLoading(true);
    const res = await chatSectionService(id, articleid);

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

  const handleSendMsgClick = () => {
    setModalType("message");
    setShowChatModal(true);
  };
  const handleRejectClick = () => {
    setModalType("reject");
    setShowChatModal(true);
  };

  const handleSendMsgPublisher = async () => {
    setShowChatModal(false);
    setLoading(true);
    let res;
    try {
      if (modalType === "reject") {
        res = await sentUserRejectMessage(portalArticleDetail[0]?.id, articleid, sendMsg);
      }
      else {
        res = await sentToPublisherMessage(portalArticleDetail[0]?.id, articleid, sendMsg);
      }
      if (res.success === true) {
        const successMessage = modalType === "reject" ? translate(languageData, "CommentrejectAddedSuccessfully") : translate(languageData, "msgSentSuccessfully");
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
        chatSectionShow();
        setShowChatModal(false);
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

  return (
    <div className="ltr">
      {loading ? (
        <div className="d-flex">
          <img src={globalLoader} className="mx-auto mt-10" alt="loader1" />
        </div>
      ) : (
        <Row>
          <Col>
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between border-bottom pb-4">
                <h3 className="fw-semibold">{translate(languageData, 'ArticleDetails')}</h3>
              </Card.Header>
              <Card.Body>
                <div>
                  <Row className="mt-5">
                    <Col xs={12} md={4}>
                      <span>{translate(languageData, 'TitleOfArticle')}</span>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input mb-0">
                        {portalArticleDetail[0]?.title ?? ''}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col xs={12} md={4}>
                      <span>{translate(languageData, 'AddArtiLead')}</span>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input mb-0">
                        {portalArticleDetail[0]?.lead ? portalArticleDetail[0]?.lead : '--'}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col xs={12} md={4}>
                      <span>{translate(languageData, 'sidebarContent')}</span>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input d-flex">
                        {portalArticleDetail[0]?.content ?
                          <div dangerouslySetInnerHTML={{ __html: portalArticleDetail[0]?.content ?? '' }} />
                          : "--"}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col xs={12} md={4}>
                      <span>{translate(languageData, 'image')}</span>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input mb-0">
                        {portalArticleDetail[0]?.image ?
                          <a href={`${portalArticleDetail[0]?.image ?? ''}`} download>
                            <img src={`${portalArticleDetail[0]?.image ?? ''}`} alt="Article Image" className="w-25" />
                          </a> : translate(languageData, "noImageFound")}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col xs={12} md={4}>
                      <span>{translate(languageData, 'CommentsAndRecommendations')}</span>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input mb-0">
                        {portalArticleDetail[0]?.comment ?? '--'}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col xs={12} md={4}>
                      <span>{translate(languageData, "artilstStatus")}</span>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input mb-0 w-25">
                        {getStatusMessage(portalArticleDetail[0]?.status) ?? ''}
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
                                <div className="border-top border-primary p-1 square bg-lightgray rounded-1">
                                  <div>{message.message}</div>
                                  <div style={{ fontSize: '0.66em' }} className='d-flex justify-content-end gap-1 align-items-center'>
                                    <div>{moment(message?.date, 'YYYY-MM-DD HH:mm:ss').format('h:mm A D MMM, YYYY')}</div>
                                    <div >{message.seenStatus == 0 ? <IoCheckmark fontSize={14} />: <IoCheckmarkDoneOutline fontSize={14} color='green'/>}</div>
                                    </div>
                                </div>
                              )}
                            </Col>
                            <Col xs={1} className="d-flex flex-column align-items-center justify-content-center">
                              {message.sender === 'user' ? (
                                <>
                                  <div className="chat-image mb-4">
                                    <Image src={custImg} roundedCircle /></div>
                                </>
                              ) : (
                                <div className="chat-image mb-4">
                                  <Image src={publisherImg} roundedCircle /></div>
                              )}
                            </Col>
                            <Col xs={4} className="text-right">
                              {message.sender === 'publisher' && (
                                <div className='border p-1 square bg-lightgray rounded-1 mb-4'>
                                  <div>{message.message}</div>
                                  <div style={{ fontSize: '0.66em' }} className='d-flex justify-content-end'>{moment(message?.date, 'YYYY-MM-DD HH:mm:ss').format('h:mm A D MMM, YYYY')}</div>

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
                  <Row className='mt-5'>
                    <Col xs={12} md={4}>
                      <span>{translate(languageData, "Action")}</span>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input mb-0 d-flex gap-2" data-bs-validate="Password is required">
                        <Button className='btn-info' onClick={handleSendMsgClick}>{translate(languageData, "sentMsgPublisher")}</Button>
                        {chatData.length > 0 && chatData.some(message => message.sender === 'publisher') && (
                          <Button className='btn-danger' onClick={handleRejectClick}>
                            {translate(languageData, "IhaveRejected")}
                          </Button>
                        )}
                      </div>

                    </Col>

                  </Row>
                  <Modal show={showChatModal} onHide={handleChatModalClose} size="lg">
                    <Modal.Header closeButton>
                      <Modal.Title>
                        {modalType === "reject"
                          ? translate(languageData, "sendMessage")
                          : translate(languageData, "sentMsgPublisher")}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Row className='align-items-center mt-2'>
                        <Col xs={12} md={4}>
                          <span>
                            {translate(languageData, "sendMessage")}
                          </span>
                        </Col>
                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                          <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                            <textarea className="input100" type="text" name="comment" cols={3} rows={3} style={{ paddingLeft: "5px" }} onChange={(e) => setSendMsg(e.target.value)} />
                          </div>
                        </Col>

                      </Row>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className='btn-info' onClick={handleSendMsgPublisher}>{modalType === "reject"
                        ? translate(languageData, "sendMessage")
                        : translate(languageData, "sentMsgPublisher")}</Button>
                      <Button variant="secondary" onClick={handleChatModalClose}>
                        {translate(languageData, 'close')}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default VieworderArticle;
