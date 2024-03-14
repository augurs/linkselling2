import React from 'react'
import { useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'

import { FaInfoCircle, FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { orderArticles } from '../../../services/articleServices/articleServices';
import { projectList } from '../../../services/ProjectServices/projectServices';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import globalLoader from '../../../assets/images/loader.svg'
import { translate } from '../../../utility/helper';
import { useLanguage } from '../../Context/languageContext';
import green from '../../../assets/images/cards/Green.png';
import grey from '../../../assets/images/cards/Grey.png';
import { articleTypeList } from "../../../services/buyArticleServices/buyArticlesServices";
import { buyNow } from '../../../services/invoicesServices/invoicesServices';

const OrderArticle = () => {
    const userData = JSON.parse(localStorage.getItem("userData"))
    const accessToken = localStorage.getItem('accessToken')
    const lang = localStorage.getItem("lang");

    const initialValues = {
        articleType: "",
        project: "",
        writeSubject: "",
        suggestion: "",
    };

    const { languageData } = useLanguage();
    const [articleType, setArticleType] = useState('paid');
    const [orderType, setOrderType] = useState('Basic article');
    const [articlesData2, setArticlesData2] = useState([]);
    const [formValues, setFormValues] = useState(initialValues)
    const [orderPrice, setOrderPrice] = useState('50,00 zł');
    const [formErrors, setFormErrors] = useState({})
    const [orderLoading, setOrderLoading] = useState(false)
    const [articlePackages, setArticlePackages] = useState([])
    const [redirectUrl, setRedirectUrl] = useState('')

    const [orderId, setOrderId] = useState(1);
    const [weProvideSubject, setWeProvideSubject] = useState(true);
    const [provideSubject, setProvideSubject] = useState(false);
    const [cardLang, setCardLang] = useState(lang)
    const [linkAnchorPairs, setLinkAnchorPairs] = useState([{ link: '', requestAnchor: '' }]);
    const [lastAddedLinkIndex, setLastAddedLinkIndex] = useState(0);
    const MAX_LINK_ANCHOR_PAIRS = 10;
    const navigate = useNavigate()

    useEffect(() => {
        if (lang)
            setCardLang(lang)
    }, [lang])


    const addLinkAnchorPair = () => {
        if (linkAnchorPairs.length < MAX_LINK_ANCHOR_PAIRS) {
            setLinkAnchorPairs([...linkAnchorPairs, { link: '', requestAnchor: '' }]);
            setLastAddedLinkIndex(linkAnchorPairs.length);
        }
    };

    const handleChangeLinkAnchor = (index, type, value) => {
        const updatedLinkAnchorPairs = [...linkAnchorPairs];
        updatedLinkAnchorPairs[index][type] = value;
        setLinkAnchorPairs(updatedLinkAnchorPairs);
    };

    console.log(linkAnchorPairs.map((item=>item.link)),"67")
    console.log(linkAnchorPairs.map((item=>item.requestAnchor)), "68")

  



    useEffect(() => {
        articleTypeListService()
    }, [])

    const articleTypeListService = async () => {
        const res = await articleTypeList(accessToken)
        setArticlePackages(res?.data?.reverse())
    }

    useEffect(() => {
        articleListServices2()
    }, [])


    const articleOrderType = (type) => {
        setArticleType(type)
    }

    const handleOrderPriceCard = (type, price, id) => {
        setOrderType(type)
        setOrderPrice(price)
        setOrderId(id)
    }


    const fieldTranslationMap = {
        project: translate(languageData, "ProjectField"),
        country: translate(languageData, "CountryField"),
        email: translate(languageData, "EmailField"),
        phone: translate(languageData, "PhoneField"),
        placing_link: translate(languageData, "PlacingLinkField"),
        quantity: translate(languageData, "QuantityField"),
        Comments: translate(languageData, "Comments"),
        Action_on_the_main_image: translate(languageData, "Actiononthemainimage "),
        image: translate(languageData, "ImageField"),
        article_type: translate(languageData, "Articletype "),
        title_of_article: translate(languageData, "TitleofArticleField"),

    };

    const orderArticleServices = async () => {
        setOrderLoading(true);
        if (provideSubject && !formValues.writeSubject) {
            toast(translate(languageData, "SubjectFieldNotEmpty"), {
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
        const res = await orderArticles(formValues, orderPrice.split(",")[0], articleType, linkAnchorPairs, accessToken);
        if (res.success === true) {
            toast(translate(languageData, "OrderAddedSuccessfully"), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            
            buyNowServices('', "2", '', accessToken)
           
            // window.location.href = res?.redirect_url_all;
        } else if (res.success === false && res.response) {
            for (const field in res.response) {
                if (res.response.hasOwnProperty(field)) {
                    const errorMessages = res.response[field].map(message => {
                        const translationKey = fieldTranslationMap[field] || field;
                        return `${translate(languageData, translationKey)}`;
                    });
                    const errorMessage = errorMessages.join('. ');
                    toast(errorMessage, {
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
            }
        } else {
            toast("Something went wrong", {
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
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

        if (!values.project) {
            error.project = translate(languageData, "PleaseSelectYourProject");
            isValid = false;
        }

        if (!values.country) {
            error.country = translate(languageData, "PleaseSelectYourCountry");
            isValid = false;
        }

        if (!values.quantity) {
            error.quantity = translate(languageData, "PleaseEnterArticleQuantity");
            isValid = false;
        }

        if (!values.title) {
            error.title = translate(languageData, "PleaseEnterArticleTitle");
            isValid = false;
        }

        if (!values.imageAction) {
            error.imageAction = translate(languageData, "PleaseSelectYourImage");
            isValid = false;
        }

        if (!values.placingLink) {
            error.placingLink = translate(languageData, "PleaseEnterPlacingLink");
            isValid = false;
        } else if (!urlRegex.test(values.placingLink)) {
            error.placingLink = translate(languageData, "InvalidURLFormat");
            isValid = false;
        }

        if (!values.phone) {
            error.phone = translate(languageData, "PleaseEnterPhoneNumber");
            isValid = false;
        }

        if (!values.attachment) {
            error.attachment = translate(languageData, "PleaseAttachmentRequired");
            isValid = false;
        }

        if (!values.comment) {
            error.comment = translate(languageData, "PleaseAddYourComment");
            isValid = false;
        }

        if (!values.email) {
            error.email = translate(languageData, "PleaseEnterEmail");
            isValid = false;
        } else if (!emailRegex.test(values.email)) {
            error.email = translate(languageData, "InvalidEmailFormat");
            isValid = false;
        }

        setFormErrors(error);
        return isValid;
    }

    const articleListServices2 = async () => {
        const res = await projectList(accessToken)
        setArticlesData2(res?.data.reverse())
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const removeLinkAnchorPair = (index) => {
        const updatedPairs = linkAnchorPairs.filter((pair, i) => i !== index);
        setLinkAnchorPairs(updatedPairs);
        
        if (index <= lastAddedLinkIndex) {
            setLastAddedLinkIndex(lastAddedLinkIndex - 1);
        }
    };

    const buyNowServices = async (domainId, serviceType, articleType, accessToken) => {
        setOrderLoading(true)
        const res = await buyNow(domainId, serviceType, articleType, accessToken)
        if (res.success === true) {
            window.location.href= res.redirect_url_all;
            setOrderLoading(false )
        } else {
            setOrderLoading(false )

        }
    }
    

    return (
        <div>

            <ToastContainer />
            <Card className='mt-4'>
                <Card.Header className='d-flex justify-content-between border-bottom pb-4'><h4 className='fw-semibold'>{translate(languageData, "OrderOneMoreArticles")}</h4><Button className="btn btn-outline-primary" onClick={() => navigate('/articleList')}>{translate(languageData, "back")}</Button></Card.Header>
                <Card.Body>
                    <div className='border-bottom'>
                        <Col lg={10} className='mt-6 pb-6' >
                            <Row className='align-items-center '>
                                <Col xs={12} md={4}>
                                    <span>{translate(languageData, "ArticleType")} </span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0 d-flex justify-content-center">
                                    <Button className={`btn ${articleType === 'paid' ? 'btn-primary' : 'btn-outline-primary'}  rounded-0 `} onClick={() => articleOrderType("paid")}>{translate(languageData, "RequestArticleWriting")}</Button>
                                </Col>
                            </Row>
                        </Col>
                    </div>
                    <div>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "artilstProject")} *</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="form-group">
                                    <select name="project" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country" onChange={(e) => handleChange(e)} onClick={() => validate(formValues)}>
                                        <option label={translate(languageData, "artilstProject")}></option>
                                        {articlesData2.map((item, index) => {
                                            return (
                                                <option value={item.name} key={index}>{item.name}</option>
                                            )
                                        })}

                                    </select>
                                </div>
                                <div className='text-danger text-center mt-1'>{formErrors.project}</div>
                            </Col>
                        </Row>
                    </div>
                    <div className='mt-5 mb-4'><h4>{translate(languageData, "ArticleQuality")}</h4></div>
                    <div className='mt-6 border-bottom pb-7'>
                        <Row className='justify-content-center'>
                            {articlePackages?.map((item, index) => {
                                return (
                                    <Col xs={12} lg={4} onClick={() => handleOrderPriceCard(item.name, item.price, item.id)} key={index} className='mt-2 rounded-pill'>
                                        <Card className={`shadow-md ${orderType === item?.name && "border border-primary border-2 shadow-lg"}`} style={{ cursor: "pointer" }}>
                                            <Card.Body className='text-center'>
                                                <h3 className={`mt-4 ${orderType === item.name ? "text-primary" : "text-outline-primary"}`}>{item.price}</h3>
                                                <div className='mt-4 mb-3'><FaInfoCircle style={{ color: 'blue' }} size={25} /></div>
                                                <h5 className='text-bold'>{cardLang == "en" ? item.name : item.polish_name} </h5>
                                                <Link className='text-dark'>{cardLang == "en" ? item?.description : item?.polish_description}</Link>
                                                <div className='mt-4'>
                                                    <Button className={`btn  ${orderType === item.name ? "btn-primary" : "btn-outline-primary"}`}>{translate(languageData, "Select")}</Button>
                                                </div>
                                                <div></div>
                                            </Card.Body>
                                            <div className={`d-flex justify-content-center align-items-center ${orderType === item.name ? "green" : "grey"}`} style={{ marginTop: '-59px' }}>
                                                <img src={orderType === item.name ? green : grey} />
                                            </div>
                                        </Card>
                                    </Col>

                                )
                            })}

                        </Row>
                    </div>
                    <div className='mt-6 border-bottom pb-7'>
                        <div className='fw-semibold'><h4>{translate(languageData, "OrderDetails")}</h4></div>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "articleSubject")} </span>
                            </Col>
                            <Col xs={12} md={4} className="mt-3 mt-md-0">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="weProvideSubjectCheckbox"
                                        checked={weProvideSubject}
                                        onChange={() => {
                                            setWeProvideSubject(!weProvideSubject);
                                            setProvideSubject(false);
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="weProvideSubjectCheckbox">
                                        {translate(languageData, "weProvideArticleSubject")}
                                    </label>
                                </div>
                            </Col>
                            <Col xs={12} md={4} className="mt-3 mt-md-0">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="provideSubjectCheckbox"
                                        checked={provideSubject}
                                        onChange={() => {
                                            setProvideSubject(!provideSubject);
                                            setWeProvideSubject(false);
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="provideSubjectCheckbox">
                                        {translate(languageData, "provideArticleSubject")}
                                    </label>
                                </div>
                            </Col>
                        </Row>
                        {provideSubject && (
                            <Row className='align-items-center mt-5'>
                                <Col xs={12} md={4}>
                                    <span>{translate(languageData, "writeSubject")} *</span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0">
                                    <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                        <input className="input100" type="text" name="writeSubject" placeholder={translate(languageData, "writeSubject")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                                    </div>
                                </Col>
                            </Row>
                        )}
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "writeSuggestion")} </span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Suggestion is required">
                                    <textarea
                                        className="input100 px-4"
                                        name="suggestion"
                                        placeholder={translate(languageData, "writeSuggestion")}
                                        onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)}
                                        maxLength={300}
                                        rows={8}
                                        cols={6}
                                    />
                                </div>

                            </Col>
                        </Row>

                        {linkAnchorPairs.map((pair, index) => (
                            <div key={index}>
                                <Row className='align-items-center mt-5'>
                                    <Col xs={12} md={4}>
                                        <span>{translate(languageData, "link")} </span>
                                    </Col>
                                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                                        <div className="wrap-input100 validate-input mb-0 d-flex" data-bs-validate="Password is required">
                                            <input className="input100" type="text" name="link" placeholder={translate(languageData, "link")} style={{ paddingLeft: "15px" }} value={pair.link} onChange={(e) => handleChangeLinkAnchor(index, 'link', e.target.value)} />
                                            {(index === lastAddedLinkIndex || (index === linkAnchorPairs.length - 1 && lastAddedLinkIndex === linkAnchorPairs.length - 1)) && (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id="tooltip">{translate(languageData, "addMoreLink&Anchor")}</Tooltip>}
                                                ><button className='bg-transparent' onClick={addLinkAnchorPair}><FaPlusCircle /></button>
                                                </OverlayTrigger>
                                            )}
                                            {index > 0 && (
                                                <button className='bg-transparent' onClick={() => removeLinkAnchorPair(index)}><FaMinusCircle /></button>
                                            )}
                                        </div>

                                    </Col>
                                </Row>
                                <Row className='align-items-center mt-5'>
                                    <Col xs={12} md={4}>
                                        <span>{translate(languageData, "requestanchor")} </span>
                                    </Col>
                                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                                        <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                            <input className="input100" type="text" name="requestAnchor" placeholder={translate(languageData, "requestanchor")} style={{ paddingLeft: "15px" }} value={pair.requestAnchor} onChange={(e) => handleChangeLinkAnchor(index, 'requestAnchor', e.target.value)} />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </div>


                </Card.Body>
            </Card>
            {/* <Col lg={1}>
                            <Button className='btn btn-primary'>Details <i className="angle fa fa-angle-down ms-2"></i></Button>
                        </Col> */}
            <Card className='container fixed-bottom'>
                <Card.Body>
                    <Row className='w-100 d-flex justify-content-between'>

                        <Col lg={6} className='ms-2'>
                            <span className='d-flex align-items-center ms-2'> {translate(languageData, "TotalAmount")} <span className='fw-semibold ms-2' style={{ fontSize: "20px" }}>{orderPrice}</span> </span>
                        </Col>
                        <Col lg={5} className=''>
                            <Button className='d-flex ms-auto' onClick={() => orderArticleServices()}> {orderLoading ? <img src={globalLoader} alt='loader' width={20} /> : translate(languageData, "PurchaseAndPay")}</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    )
}

export default OrderArticle