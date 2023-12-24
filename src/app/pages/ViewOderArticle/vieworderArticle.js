import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import globalLoader from '../../../assets/images/loader.svg';
import { useLanguage } from '../../Context/languageContext';
import { translate } from '../../../utility/helper';
import { ordersListArticle, ordersListArticle1 } from '../../../services/OrdersServices/ordersServices';

function VieworderArticle() {
  const userData = localStorage.getItem('userData');
  const [loading, setLoading] = useState(false);
  const [portalArticleDetail, setPortalArticleDetail] = useState([]);
  const { languageData } = useLanguage();
  const { id, articleid } = useParams();

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
    return <span className={`${buttonClass} d-flex justify-content-center align-items-center w-25`}>
      {buttonText}
    </span>
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
                <div className="">
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
                      <span>{translate(languageData, 'sidebarContent')}</span>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input d-flex">
                        <div dangerouslySetInnerHTML={{ __html: portalArticleDetail[0]?.content ?? '' }} />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col xs={12} md={4}>
                      <span>{translate(languageData, 'image')}</span>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input mb-0">
                        <a href={`https://linkselling.augurslive.com/LinkSellingSystem/public/articles/${portalArticleDetail[0]?.image ?? ''}`} download>
                          <img src={`https://linkselling.augurslive.com/LinkSellingSystem/public/articles/${portalArticleDetail[0]?.image ?? ''}`} alt="Article Image" className="w-25" />
                        </a>
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
                      <span>Status</span>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input mb-0">
                        {getStatusMessage(portalArticleDetail[0]?.status) ?? ''}
                      </div>
                    </Col>
                  </Row>
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
