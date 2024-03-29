import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Col, Row, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import globalLoader from '../../../../assets/images/loader.svg'
import { translate } from '../../../../utility/helper';
import { useLanguage } from '../../../Context/languageContext';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from 'material-ui-core';
import { MenuProps } from '../../../../utility/data';
import { updatePublisherOffer, categoryofferList, viewUpdateoffer } from '../../../../services/PublisherServices/MyOfferServices/MyofferServices';

const Updateoffer = () => {

    const lang = localStorage.getItem("lang");
    const initialValues = {
        enterDomain: "",
        price: "",
        language: "pl",
        category: [],
        maxLinks: "",
        typeofAnchors: "ema",
        Nofollow: "0",
        contactMail: "",
        contactPhone: "",

        //2nd tab fields
        articleMaxLength: "",
        articleMinLength: "",
        leadLength: "",
        ArticleGoesToHomepage: "0",
        numberOfDays: "1",

        //3rd tab fields
        acceptsCasino: "0",
        acceptsGambling: "0",
        acceptsErotic: "0",
        acceptsLoan: "0",
        acceptsDating: "0",
        acceptsCBD: "0",
        acceptsCrypto: "0",
        acceptsMedic: "0",
    };
    const { domainId } = useParams();

    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})
    const [orderLoading, setOrderLoading] = useState(false)
    const [categoryList, setCategoryList] = useState([]);
    const [offerList, setOfferList] = useState([])
    const [activeStep, setActiveStep] = useState(1);
    const [loading, setLoading] = useState(false)
    const [touched, setTouched] = useState(false);
    const [dataFound, setDataFound] = useState('');
    const [cardLang, setCardLang] = useState(lang)
    const navigate = useNavigate()

    useEffect(() => {
        if (lang)
            setCardLang(lang)
    }, [lang])

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handlePrevious = () => {
        setActiveStep(activeStep - 1);
    };

    const publisherData = JSON.parse(localStorage.getItem("publisherData"))
    const accessToken = localStorage.getItem('publisherAccessToken');
    const { languageData } = useLanguage()

    useEffect(() => {
        categoryofferListServices()
    }, [])

    useEffect(() => {
        if (offerList) {
            viewOfferListServices()
        }
    }, [domainId])

    const handleChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = parseInt(value);
        if ((name === 'price' || name === "maxLinks") && (parsedValue < 1)) {
            setFormValues({ ...formValues, [name]: 1 });
        } else {
            setFormValues({ ...formValues, [name]: parsedValue });
        }
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = parseInt(value);
        if ((name === 'price' || name === "maxLinks") && (parsedValue < 1)) {
            setFormValues({ ...formValues, [name]: 1 });
        } else {
            setFormValues({ ...formValues, [name]: value });
        }
    };

    const handleCategoryChange = (event) => {
        const {
            target: { value },
        } = event;
        setFormValues({ ...formValues, category: value });
    };


    const handleNumberOfDaysChange = (e) => {
        const { name, value } = e.target;
        if (name === 'numberOfDays' && parseInt(value) < 1) {
            setFormValues({ ...formValues, [name]: 1 });
        } else if (name === 'numberOfDays' && parseInt(value) > 29) {
            setFormValues({ ...formValues, [name]: 29 });
        } else {
            setFormValues({ ...formValues, [name]: parseInt(value) });
        }
    };

    const categoryofferListServices = async () => {
        setLoading(true)
        const res = await categoryofferList(accessToken)
        if (res.success === true) {
            setCategoryList(res?.data)
            setLoading(false)
        } else {
            setLoading(false);
        }
    }

    const viewOfferListServices = async () => {
        setLoading(true)
        const res = await viewUpdateoffer(domainId, accessToken)
        console.log(res, "140");
        setDataFound(res ? res : "")
        if (res.success === true) {
            const categoryArray = res?.data[0]?.category.split(",").map(item => parseInt(item)) || [];
            setFormValues({
                ...formValues,
                id: res?.data[0]?.id,
                typeofAnchors: res?.data[0]?.type_of_anchor,
                maxLinks: res?.data[0]?.max_links,
                enterDomain: res?.data[0]?.url,
                language: res?.data[0]?.language,
                price: res?.data[0]?.our_price,
                contactMail: res?.data[0]?.contact_email,
                contactPhone: res?.data[0]?.contact_phone,
                articleMinLength: res?.data[0]?.article_min_length,
                articleMaxLength: res?.data[0]?.article_max_length,
                leadLength: res?.data[0]?.lead_length,
                category: categoryArray,
                acceptsLoan: res?.data[0]?.loan,
                acceptsMedic: res?.data[0]?.medic,
                acceptsGambling: res?.data[0]?.gambling,
                acceptsCrypto: res?.data[0]?.crypto,
                acceptsCasino: res?.data[0]?.casino_fee,
                acceptsCBD: res?.data[0]?.cbd,
                acceptsDaring: res?.data[0]?.dating,
                acceptsErotic: res?.data[0]?.erotic,

            });
            setLoading(false)
        } else {
            setLoading(false);
        }
    }

    const updatePublisherOfferServices = async () => {
        setOrderLoading(true);
        if (!formValues.enterDomain) {
            toast(translate(languageData, "enterDomain"), {
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
        if (!formValues.contactPhone) {
            toast(translate(languageData, "enterContact"), {
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
        if (!formValues.contactMail) {
            toast(translate(languageData, "enterMail"), {
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
        if (!formValues.category) {
            toast(translate(languageData, "enterCategory"), {
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
        if (!formValues.maxLinks) {
            toast(translate(languageData, "enterMaxLinks"), {
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
        if (!formValues.price) {
            toast(translate(languageData, "enterPrice"), {
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
        if (!formValues.articleMaxLength) {
            toast(translate(languageData, "enterArticleMaxLength"), {
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
        if (!formValues?.articleMinLength) {
            toast(translate(languageData, "enterArticleMinLength"), {
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
        if (!formValues?.leadLength) {
            toast(translate(languageData, "enterLeadLength"), {
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
        if (parseFloat(formValues?.articleMinLength) > parseFloat(formValues?.articleMaxLength)) {
            toast(translate(languageData, "lessThanMaxLength"), {
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
        const res = await updatePublisherOffer(formValues, domainId, accessToken);
        if (res.success === true) {
            toast(translate(languageData, "offerUpdatedSuccessfully"), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            viewOfferListServices()
        } else if (res.success === false && res.message.url[0] === "The url has already been taken.") {
            toast(translate(languageData, "TheurlHasAlreadyBeenTaken"), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
        } else {
            toast(translate(languageData, "somethingwentwrong"), {
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
        let errors = {};
        let isValid = true;
        const urlRegex = /^[^ "]+\.[^ "]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(\+\d{1,3})?\d{9,12}$/;

        if (!values.enterDomain) {
            errors.enterDomain = translate(languageData, 'enterDomainUrl');
            isValid = false;
        } else if (!urlRegex.test(values.enterDomain)) {
            errors.enterDomain = translate(languageData, 'InvalidDomainFormat');
            isValid = false;
        }

        if (!values.contactMail) {
            errors.contactMail = translate(languageData, 'PleaseEnterEmail');
            isValid = false;
        } else if (!emailRegex.test(values.contactMail)) {
            errors.contactMail = translate(languageData, 'signUpEmailError2');
            isValid = false;
        }

        if (!values.contactPhone) {
            errors.contactPhone = translate(languageData, 'PleaseEnterPhoneNumber');
            isValid = false;
        } else if (!phoneRegex.test(values.contactPhone)) {
            errors.contactPhone = translate(languageData, 'InvalidPhoneFormat');
            isValid = false;
        }

        if (!values?.maxLinks) {
            errors.maxLinks = translate(languageData, 'enterMaxLinks');
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };
    const handleBlur = () => {
        setTouched(true);
        validate(formValues);
    };

    return (
        <div>
            <ToastContainer />
            <Card className='mt-4'>
                <Card.Header className='d-flex justify-content-between border-bottom pb-4'>
                    <h4 className='fw-semibold'>{translate(languageData, "updateOffer")}</h4>
                    <Button className="btn btn-outline-primary" onClick={() => navigate('/publisher/listOffer')}>{translate(languageData, "back")}</Button>
                </Card.Header>
                {dataFound?.data?.length > 0 ?
                    <Card.Body>
                        <div className='mt-6 border-bottom'>
                            {activeStep === 1 && (
                                <>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "enterDomain")} *</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0">
                                                <input className="input100" type="text" name="enterDomain" placeholder={translate(languageData, "enterDomain")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} value={formValues?.enterDomain} onBlur={handleBlur} />
                                            </div>
                                            {touched && formErrors.enterDomain && <div className="text-danger">{formErrors.enterDomain}</div>}
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "price")} *</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0">
                                                <input className="input100" type="number" name="price" placeholder={translate(languageData, "price")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} value={formValues?.price} />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "category")} *</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0">
                                                <FormControl className='input100'>
                                                    <InputLabel id="demo-multiple-name-label" className='px-3'>{translate(languageData, "category")}</InputLabel>
                                                    <Select
                                                        labelId="demo-multiple-name-label"
                                                        id="demo-multiple-name"
                                                        multiple
                                                        value={formValues?.category}
                                                        onChange={handleCategoryChange}
                                                        input={<OutlinedInput label="Name" />}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {categoryList?.map((item, index) => (
                                                            <MenuItem key={index} value={item.id}>
                                                                {cardLang == "en" ? item?.category_translation[0]?.trans_name : item?.category_translation[1]?.trans_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "Language")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                                                <Form.Check
                                                    type="radio"
                                                    id="pl"
                                                    label="Polish"
                                                    name='language'
                                                    value="pl"
                                                    checked={formValues.language === 'pl'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="en"
                                                    label="English"
                                                    value="en"
                                                    name='language'
                                                    checked={formValues.language === 'en'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "typeofAnchors")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                                                <Form.Check
                                                    type="radio"
                                                    id="ema"
                                                    label="ema"
                                                    name='typeofAnchors'
                                                    value="ema"
                                                    checked={formValues.typeofAnchors === 'ema'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="brand"
                                                    label="Brand"
                                                    value="brand"
                                                    name='typeofAnchors'
                                                    checked={formValues.typeofAnchors === 'brand'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "Nofollow")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                                                <Form.Check
                                                    type="radio"
                                                    id="0"
                                                    label="No"
                                                    name='Nofollow'
                                                    value="0"
                                                    checked={formValues.Nofollow === '0'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="1"
                                                    label="Yes"
                                                    value="1"
                                                    name='Nofollow'
                                                    checked={formValues.Nofollow === '1'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "maxLinks")} *</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0">
                                                <input className="input100" type="number" name="maxLinks" value={formValues?.maxLinks} placeholder={translate(languageData, "maxLinks")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                                            </div>
                                            {touched && formErrors.maxLinks && <div className="text-danger">{formErrors.maxLinks}</div>}
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "contactPhone")} *</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0">
                                                <input className="input100" type="text" name="contactPhone" placeholder={translate(languageData, "contactPhone")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} value={formValues?.contactPhone} onBlur={handleBlur} />
                                            </div>
                                            {touched && formErrors.contactPhone && <div className="text-danger">{formErrors.contactPhone}</div>}

                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "contactMail")} *</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0">
                                                <input className="input100" type="text" name="contactMail" placeholder={translate(languageData, "contactMail")} value={formValues?.contactMail} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} onBlur={handleBlur} />
                                            </div>
                                            {touched && formErrors.contactMail && <div className="text-danger">{formErrors.contactMail}</div>}

                                        </Col>
                                    </Row>
                                    <Row className='w-100 d-flex justify-content-end'>
                                        <Col lg={6} className='ms-2'>
                                        </Col>
                                        <Col lg={5} className='mt-5 mb-2'>
                                            <Button className='d-flex ms-auto' onClick={handleNext} disabled={!formValues.maxLinks || !formValues.price || formErrors.enterDomain || formErrors.contactMail || formErrors.contactPhone || !formValues?.category.length}>{translate(languageData, "clickNext")}</Button>
                                        </Col>
                                    </Row>
                                </>
                            )}
                            {activeStep === 2 && (
                                <>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "articleMaxLength")} *</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0">
                                                <input className="input100" type="number" value={formValues?.articleMaxLength} name="articleMaxLength" placeholder={translate(languageData, "articleMaxLength")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "articleMinLength")} *</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0">
                                                <input className="input100" type="number" value={formValues?.articleMinLength} name="articleMinLength" placeholder={translate(languageData, "articleMinLength")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                                            </div>
                                            {parseFloat(formValues?.articleMinLength) >= parseFloat(formValues?.articleMaxLength) ? <span className='text-danger'>{translate(languageData, "lessThanMaxLength")}</span> : ""}
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "leadLength")} *</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0">
                                                <input className="input100" type="number" value={formValues?.leadLength} name="leadLength" placeholder={translate(languageData, "leadLength")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "ArticleGoesToHomepage")} </span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                                                <Form.Check
                                                    type="radio"
                                                    id="0"
                                                    label="No"
                                                    name='ArticleGoesToHomepage'
                                                    value="0"
                                                    checked={formValues.ArticleGoesToHomepage === '0'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="1"
                                                    label="Yes"
                                                    value="1"
                                                    name='ArticleGoesToHomepage'
                                                    checked={formValues.ArticleGoesToHomepage === '1'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    {formValues?.ArticleGoesToHomepage == "1" ?
                                        <Row className='align-items-center mt-5'>
                                            <Col xs={12} md={4}>
                                                <span>{translate(languageData, "numberOfDays")} *</span>
                                            </Col>
                                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                <div className="wrap-input100 validate-input mb-0">
                                                    <input className="input100" type="number" value={formValues?.numberOfDays} name="numberOfDays" placeholder={translate(languageData, "numberOfDays")} style={{ paddingLeft: "15px" }} onChange={(e) => handleNumberOfDaysChange(e)} onKeyDown={() => validate(formValues)} />
                                                </div>
                                                {!formValues?.numberOfDays ? <span className='text-danger'>{(translate(languageData, "enterNumberOfDays"))}</span> : ""}
                                            </Col>
                                        </Row>
                                        : ""}
                                    <Row className='w-100 d-flex justify-content-end'>
                                        <Col lg={6} className='ms-2'>
                                        </Col>
                                        <Col lg={5} className='mt-5 mb-2 d-flex'>
                                            <Button className='d-flex ms-auto' onClick={handlePrevious}>{translate(languageData, "clickPrevious")}</Button>
                                            <Button className='d-flex ms-2' onClick={handleNext} disabled={formValues?.ArticleGoesToHomepage == "1" ? !formValues?.numberOfDays : "" || parseFloat(formValues.articleMinLength) > parseFloat(formValues.articleMaxLength) || !formValues.articleMinLength || !formValues.articleMaxLength || !formValues.leadLength}>{translate(languageData, "clickNext")}</Button>
                                        </Col>
                                    </Row>
                                </>
                            )}
                            {activeStep === 3 && (
                                <>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "acceptsCasino")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                                                <Form.Check
                                                    type="radio"
                                                    id="0"
                                                    label="No"
                                                    name='acceptsCasino'
                                                    value="0"
                                                    checked={formValues.acceptsCasino === '0'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="1"
                                                    label="Yes"
                                                    value="1"
                                                    name='acceptsCasino'
                                                    checked={formValues.acceptsCasino === '1'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "acceptsGambling")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                                                <Form.Check
                                                    type="radio"
                                                    id="0"
                                                    label="No"
                                                    name='acceptsGambling'
                                                    value="0"
                                                    checked={formValues.acceptsGambling === '0'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="1"
                                                    label="Yes"
                                                    value="1"
                                                    name='acceptsGambling'
                                                    checked={formValues.acceptsGambling === '1'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "acceptsErotic")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                                                <Form.Check
                                                    type="radio"
                                                    id="0"
                                                    label="No"
                                                    name='acceptsErotic'
                                                    value="0"
                                                    checked={formValues.acceptsErotic === '0'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="1"
                                                    label="Yes"
                                                    value="1"
                                                    name='acceptsErotic'
                                                    checked={formValues.acceptsErotic === '1'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "acceptsLoan")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                                                <Form.Check
                                                    type="radio"
                                                    id="0"
                                                    label="No"
                                                    name='acceptsLoan'
                                                    value="0"
                                                    checked={formValues.acceptsLoan === '0'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="1"
                                                    label="Yes"
                                                    value="1"
                                                    name='acceptsLoan'
                                                    checked={formValues.acceptsLoan === '1'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "acceptsDating")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                                                <Form.Check
                                                    type="radio"
                                                    id="0"
                                                    label="No"
                                                    name='acceptsDating'
                                                    value="0"
                                                    checked={formValues.acceptsDating === '0'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="1"
                                                    label="Yes"
                                                    value="1"
                                                    name='acceptsDating'
                                                    checked={formValues.acceptsDating === '1'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "acceptsCBD")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                                                <Form.Check
                                                    type="radio"
                                                    id="0"
                                                    label="No"
                                                    name='acceptsCBD'
                                                    value="0"
                                                    checked={formValues.acceptsCBD === '0'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="1"
                                                    label="Yes"
                                                    value="1"
                                                    name='acceptsCBD'
                                                    checked={formValues.acceptsCBD === '1'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "acceptsCrypto")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                                                <Form.Check
                                                    type="radio"
                                                    id="0"
                                                    label="No"
                                                    name='acceptsCrypto'
                                                    value="0"
                                                    checked={formValues.acceptsCrypto === '0'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="1"
                                                    label="Yes"
                                                    value="1"
                                                    name='acceptsCrypto'
                                                    checked={formValues.acceptsCrypto === '1'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "acceptsMedic")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                            <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                                                <Form.Check
                                                    type="radio"
                                                    id="0"
                                                    label="No"
                                                    name='acceptsMedic'
                                                    value="0"
                                                    checked={formValues.acceptsMedic === '0'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="1"
                                                    label="Yes"
                                                    value="1"
                                                    name='acceptsMedic'
                                                    checked={formValues.acceptsMedic === '1'}
                                                    onChange={(e) => handleRadioChange(e)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className='w-100 d-flex justify-content-end'>
                                        <Col lg={6} className='ms-2'>
                                        </Col>
                                        <Col lg={5} className='mt-5 mb-2 d-flex'>
                                            <Button className='d-flex ms-auto' onClick={handlePrevious}>{translate(languageData, "clickPrevious")}</Button>
                                            <Button className='d-flex ms-2' onClick={() => updatePublisherOfferServices()}> {orderLoading ? <img src={globalLoader} alt='loader' width={20} /> : translate(languageData, "updateOffer")}</Button>

                                        </Col>
                                    </Row>
                                </>
                            )}
                        </div>
                    </Card.Body> : <div className='text-center my-5'>{translate(languageData, "notFoundAnyNewRecords")}</div>}
            </Card>
        </div>
    )
}

export default Updateoffer