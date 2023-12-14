import React from 'react'
import { useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { FaInfoCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import FileUpload from '../../Components/FileUpload/FileUpload';
import { orderArticles } from '../../../services/articleServices/articleServices';
import { projectList } from '../../../services/ProjectServices/projectServices';
import { useEffect } from 'react';
import { countries } from '../../../utility/data';
import { ToastContainer, toast } from 'react-toastify';
import globalLoader from '../../../assets/images/loader.svg'
import { translate } from '../../../utility/helper';
import { useLanguage } from '../../Context/languageContext';
import green from '../../../assets/images/cards/Green.png';
import grey from '../../../assets/images/cards/Grey.png';
import { articleTypeList } from "../../../services/buyArticleServices/buyArticlesServices";

const OrderArticle = () => {



    const initialValues = {
        articleType: "",
        country: "",
        project: "",
        countryOfPublication: "",
        quantity: "",
        title: "",
        imageAction: "",
        placingLink: "",
        lead: "",
        attachment: "",
        contactForm: "",
        phone: "",
        email: "",
        comment: "",
    };


    const [articleType, setArticleType] = useState('paid');
    const [orderType, setOrderType] = useState('Basic article');
    // const [articlesData, setArticlesData] = useState([]);
    const [articlesData2, setArticlesData2] = useState([]);
    const [formValues, setFormValues] = useState(initialValues)
    const [orderPrice, setOrderPrice] = useState('50,00 zł');
    const [formErrors, setFormErrors] = useState({})
    const [orderLoading, setOrderLoading] = useState(false)
    const [articlePackages, setArticlePackages] = useState([])
    const [orderId, setOrderId] = useState(1);
    const navigate = useNavigate()



    const { languageData } = useLanguage()

    const handleFiles = (file, name) => {
        setFormValues({ ...formValues, [name]: file });
    }
    useEffect(() => {
        articleTypeListService()
    }, [])

    const articleTypeListService = async () => {
        const res = await articleTypeList()
        setArticlePackages(res?.data?.reverse())
    }


    const allowedAttachmentExtension = ['.JPG', '.JPEG', '.PNG', '.PDF', '.docx', '.doc', '.odt', '.html']


    const imageActions = [
        "I will complete myself after writing text",
        "I want to add now",
        "I order to buy with linkselling"
    ]

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
        const res = await orderArticles(formValues, orderPrice, articleType);

        if (res.success === true) {
            toast(translate(languageData, "OrderAddedSuccessfully"), {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
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
                        autoClose: 5000,
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
                autoClose: 5000,
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
    

    const TooltipLink = ({ id, children, title }) => (
        <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
            {children}
        </OverlayTrigger>
    );

    const userData2 = JSON.parse(localStorage.getItem("userData"))



    const articleListServices2 = async () => {
        const res = await projectList(userData2?.id)
        setArticlesData2(res?.data.reverse())
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };







    return (
        <div>

            <ToastContainer />
            <Card className='mt-4'>
                <Card.Header className='d-flex justify-content-between border-bottom pb-4'><h4 className='fw-semibold'>{translate(languageData, "OrderOneMoreArticles")}</h4><Button className="btn btn-outline-primary" onClick={() => navigate('/articleList')}>{translate(languageData, "back")}</Button></Card.Header>
                <Card.Body>
                    {/* <Row className='mt-5 border-bottom pb-6'>
                        <Col lg={12} className='border border-primary p-2 ms-auto py-4'>
                            <div className='d-flex align-items-center'>
                                <Col lg={1}>
                                    <div className='' style={{ width: "100px!important" }}><FaInfoCircle style={{ color: 'blue' }} size={25} /></div>
                                </Col>
                                <Col lg={11}>
                                    <div>Order articles written by trusted WhitePress® journalists and copywriters. You will have the right to make comments for the author, and then you will evaluate his work.</div>
                                </Col>
                            </div>

                        </Col>
                    </Row> */}
                    <div className='border-bottom'>
                        <Col lg={10} className='mt-6 pb-6' >
                            <Row className='align-items-center '>
                                <Col xs={12} md={4}>
                                    <span>{translate(languageData, "ArticleType")} *</span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0 d-flex justify-content-center">
                                    <Button className={`btn ${articleType === 'paid' ? 'btn-primary' : 'btn-outline-primary'}  rounded-0 `} onClick={() => articleOrderType("paid")}>{translate(languageData, "artilistPaidArticle")}</Button>
                                    {/* <Button className={`btn ${articleType === 'guest' ? 'btn-primary' : 'btn-outline-primary'}  rounded-0 `} onClick={() => articleOrderType("guest")}>{translate(languageData, "artilistGuestArticle")}</Button>
                                    <Button className={`btn ${articleType === 'personal' ? 'btn-primary' : 'btn-outline-primary'}  rounded-0 `} onClick={() => articleOrderType("personal")}>{translate(languageData, "artilistArticlePersonalUse")}</Button> */}
                                </Col>
                            </Row>
                        </Col>
                    </div>
                    <div className='border-bottom'>
                        <Col lg={10} className='mt-6' >
                            <Row className='align-items-center '>
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
                        </Col>
                        <Col lg={10} className='mt-1 pb-6 ' >
                            <Row className='align-items-center '>
                                <Col xs={12} md={4}>
                                    <span>{translate(languageData, "CountryOfPublication")}</span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0">
                                    <div className="form-group">
                                        <select name="country" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country" onChange={(e) => handleChange(e)} onClick={() => validate(formValues)}>
                                            <option label="Country"></option>
                                            {countries.map((item, index) => {
                                                return (
                                                    <option value={item.name} key={index}>{item.name}</option>
                                                )
                                            })}


                                        </select>
                                    </div>
                                    <div className='text-danger text-center mt-1'>{formErrors.country}</div>
                                </Col>
                            </Row>
                        </Col>
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
                                                <h3 className='mb-3'>{item.name} </h3>
                                                <Link >{item?.description}</Link>
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
                        <Col lg={7} className='mt-6' >
                            <Row className='align-items-center '>
                                <Col xs={12} md={4}>
                                    <span>{translate(languageData, "NumberOfArticle")} *</span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0">
                                    <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                        <input className="input100" type="number" name="quantity" placeholder={translate(languageData, "NumberOfArticle")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} onBlur={() => validate(formValues)}/>
                                    </div>
                                    <div className='text-danger text-center mt-1'>{formErrors.quantity}</div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={7} className='mt-6 ' >
                            <Row className='align-items-center '>
                                <Col xs={12} md={4}>
                                    <span>{translate(languageData, "TitleOfArticle")} *</span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0">
                                    <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                        <input className="input100" type="text" name="title" placeholder={translate(languageData, "TitleOfArticle")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} onBlur={() => validate(formValues)}/>
                                    </div>
                                    <div className='text-danger text-center mt-1'>{formErrors.title}</div>
                                </Col>
                            </Row>
                        </Col>

                        <Col lg={7} className='mt-6' >
                            <Row className='align-items-center '>
                                <Col xs={12} md={4}>
                                    <span>{translate(languageData, "ActionMainImage")} *</span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0">
                                    <div className="form-group">
                                        <select name="imageAction" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country" onChange={(e) => handleChange(e)} onClick={() => validate(formValues)}>
                                            <option label={translate(languageData, "Action")}></option>
                                            {imageActions.map((item, index) => {
                                                return (
                                                    <option key={index}>{item}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className='text-danger text-center mt-1'>{formErrors.imageAction}</div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={7} className='mt-6' >
                            <Row className='align-items-center '>
                                <Col xs={12} md={4}>
                                    <span>{translate(languageData, "CommentsAndRecommendations")} *</span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0">
                                    <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                        <textarea className="input100" type="text" name="comment" cols={8} rows={10} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                                    </div>
                                    <div className='text-danger text-center mt-1'>{formErrors.comment}</div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={7} className='mt-6' >
                            <Row className='align-items-center '>
                                <Col xs={12} md={4}>
                                    <span>{translate(languageData, "PlacingLink")}*</span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0">
                                    <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                        <textarea className="input100" type="url" name="placingLink" cols={8} rows={10} onChange={(e) => handleChange(e)} style={{ paddingLeft: "15px" }} onBlur={() => validate(formValues)} onKeyDown={() => validate(formValues)}/>
                                    </div>
                                    <div className='text-danger text-center mt-1'>{formErrors.placingLink}</div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={7} className='mt-6' >
                            <Row className='align-items-center '>
                                <Col xs={12} md={4}>
                                    <span>{translate(languageData, "AttachmentsNeededForWork")}</span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0">
                                    <div className='w-100'><FileUpload allowedFileExtensions={allowedAttachmentExtension} getData={handleFiles} name="attachment" /></div>
                                    <div className='text-danger text-center mt-1'>{formErrors.orderImage}</div>
                                </Col>
                            </Row>
                        </Col>
                    </div>
                    <div>
                        <h5 className='fw-semibold mt-6'>{translate(languageData, "PreferredFormContactWith")}</h5>
                        <div>
                            {/* <Col lg={7} className='mt-6' >
                                <Row className='align-items-center '>
                                    <Col xs={12} md={4}>
                                        <span>Form of contact *</span>
                                    </Col>
                                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                                        <div className="form-group">
                                            <select name="contactForm" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country" onChange={(e) => handleChange(e)} onClick={() => validate(formValues)}>
                                                <option label={translate(languageData, "LinksellingChatAnytime")}></option>
                                                {formOfContactOpts.map((item, index) => {
                                                    return (
                                                        <option value={item.value}>{item.value}</option>
                                                    )
                                                })}
                                                <option></option>
                                            </select>
                                        </div>
                                        <div className='text-danger text-center mt-1'>{formErrors.contactForm}</div>
                                    </Col>
                                </Row>
                            </Col> */}
                            <Col lg={7} className='mt-6' >
                                <Row className='align-items-center '>
                                    <Col xs={12} md={4}>
                                        <span>{translate(languageData, "BuyArticlePhone")} *</span>
                                    </Col>
                                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                                        <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                            <input className="input100" type="number" name="phone" placeholder={translate(languageData, "BuyArticlePhone")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                                        </div>
                                        <div className='text-danger text-center mt-1'>{formErrors.phone}</div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={7} className='mt-5' >
                                <Row className='align-items-center '>
                                    <Col xs={12} md={4}>
                                        <span>{translate(languageData, "BuyArticleEmail")} *</span>
                                    </Col>
                                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                                        <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                            <input className="input100" type="email" name="email" placeholder={translate(languageData, "BuyArticleEmail")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} onBlur={() => validate(formValues)}/>
                                        </div>
                                        <div className='text-danger text-center mt-1'>{formErrors.email}</div>
                                    </Col>
                                </Row>
                            </Col>

                        </div>
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