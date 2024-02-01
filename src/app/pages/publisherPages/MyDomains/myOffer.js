import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, Card, Col, Row, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import globalLoader from '../../../../assets/images/loader.svg'
import { translate } from '../../../../utility/helper';
import { useLanguage } from '../../../Context/languageContext';
import { listDomain } from '../../../../services/PublisherServices/MyDomainServices/MyDomainServices';
import { addPublisherOffer, categoryofferList } from '../../../../services/PublisherServices/MyOfferServices/MyofferServices';

const Myoffer = () => {
  const initialValues = {
    enterDomain: "",
    price: "",
    language: "pl",
    category: "",
    maxLinks: "",
    typeofAnchors: "ema",
    Nofollow: "0",
    contactMail: "",
    contactPhone: "",

    articleMaxLength: "",
    articleMinLength: "",
    leadLength: "",
    ArticleGoesToHomepage: "0",

    acceptsCasino: "0",
    acceptsGambling: "0",
    acceptsErotic: "0",
    acceptsLoan: "0",
    acceptsDating: "0",
    acceptsCBD: "0",
    acceptsCrypto: "0",
    acceptsMedic: "0",


  };

  const [formValues, setFormValues] = useState(initialValues)
  const [formErrors, setFormErrors] = useState({})
  const [orderLoading, setOrderLoading] = useState(false)
  const [categoryList, setCategoryList] = useState([]);
  const [domainList, setDomainList] = useState([])
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };


  console.log(formValues.contactMail, "55");

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  const publisherData = JSON.parse(localStorage.getItem("publisherData"))
  const currLang = localStorage.getItem('lang');
  const { languageData } = useLanguage()

  useEffect(() => {
    categoryofferListServices()
    domainListServices()
  }, [])

  const categoryofferListServices = async () => {
    setLoading(true)
    const res = await categoryofferList()
    if (res.success === true) {
      setCategoryList(res?.data)
      setLoading(false)
    } else {
      setLoading(false);
    }
  }

  const domainListServices = async () => {
    setLoading(true)
    const res = await listDomain(publisherData?.user?.id)
    if (res.success === true) {
      setDomainList(res?.data)
      setLoading(false)
    } else {
      setLoading(false);
    }
  }

  const addPublisherOfferServices = async () => {
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
    if (!formValues.articleMinLength) {
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
    if (!formValues.leadLength) {
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
    const res = await addPublisherOffer(formValues, publisherData?.user?.id);
    if (res.success === true) {
      toast(translate(languageData, "offerAddedSuccessfully"), {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: 'success'
      });
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
    let error = {};
    let isValid = true;
    if (!values.enterUrl) {
      error.enterUrl = translate(languageData, "PleaseEnterArticleTitle");
      isValid = false;
    }

    setFormErrors(error);
    return isValid;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div>

      <ToastContainer />
      <Card className='mt-4'>
        <Card.Header className='d-flex justify-content-between border-bottom pb-4'>
          <h4 className='fw-semibold'>{translate(languageData, "myOffer")}</h4>
          <Button className="btn btn-outline-primary" onClick={() => navigate('/publisher/listOffer')}>{translate(languageData, "back")}</Button>
        </Card.Header>
        <Card.Body>
          <div className='mt-6 border-bottom'>
            {activeStep === 1 && (
              <>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "enterDomain")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="form-group">
                      <Form.Select size="lg" name="enterDomain" value={formValues?.enterDomain} onChange={(e) => handleChange(e)} onClick={() => validate(formValues)}>
                        <option label={translate(languageData, "enterDomain")} className='bg-primary'></option>
                        {domainList?.map((item, index) => {
                          return (
                            <option value={item.id} key={index}>{item.url}</option>
                          )
                        })}
                      </Form.Select>
                    </div>
                    <div className='text-danger text-center mt-1'>{formErrors?.enterDomain}</div>
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
                    <div className="form-group">
                      <Form.Select size="lg" name="category" value={formValues?.category} onChange={(e) => handleChange(e)} onClick={() => validate(formValues)}>
                        <option label={translate(languageData, "category")} className='bg-primary'></option>
                        {categoryList?.map((item, index) => {
                          return (
                            <option value={item.id} key={index}>{item.name}</option>
                          )
                        })}
                      </Form.Select>
                    </div>
                    <div className='text-danger text-center mt-1'>{formErrors.project}</div>
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
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="en"
                        label="English"
                        value="en"
                        name='language'
                        checked={formValues.language === 'en'}
                        onChange={(e) => handleChange(e)}
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
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="brand"
                        label="Brand"
                        value="brand"
                        name='typeofAnchors'
                        checked={formValues.typeofAnchors === 'brand'}
                        onChange={(e) => handleChange(e)}
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
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="1"
                        label="Yes"
                        value="1"
                        name='Nofollow'
                        checked={formValues.Nofollow === '1'}
                        onChange={(e) => handleChange(e)}
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
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "contactPhone")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0">
                      <input className="input100" type="number" name="contactPhone" placeholder={translate(languageData, "contactPhone")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} value={formValues?.contactPhone} />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "contactMail")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0">
                      <input className="input100" type="text" name="contactMail" placeholder={translate(languageData, "contactMail")} value={formValues?.contactMail} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                    </div>
                  </Col>
                </Row>
                <Row className='w-100 d-flex justify-content-end'>
                  <Col lg={6} className='ms-2'>
                  </Col>
                  <Col lg={5} className='mt-5 mb-2'>
                    <Button className='d-flex ms-auto' onClick={handleNext}>{translate(languageData, "clickNext")}</Button>
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
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="1"
                        label="Yes"
                        value="1"
                        name='ArticleGoesToHomepage'
                        checked={formValues.ArticleGoesToHomepage === '1'}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className='w-100 d-flex justify-content-end'>
                  <Col lg={6} className='ms-2'>
                  </Col>
                  <Col lg={5} className='mt-5 mb-2 d-flex'>
                    <Button className='d-flex ms-auto' onClick={handlePrevious}>{translate(languageData, "clickPrevious")}</Button>
                    <Button className='d-flex ms-2' onClick={handleNext}>{translate(languageData, "clickNext")}</Button>
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
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="1"
                        label="Yes"
                        value="1"
                        name='acceptsCasino'
                        checked={formValues.acceptsCasino === '1'}
                        onChange={(e) => handleChange(e)}
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
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="1"
                        label="Yes"
                        value="1"
                        name='acceptsGambling'
                        checked={formValues.acceptsGambling === '1'}
                        onChange={(e) => handleChange(e)}
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
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="1"
                        label="Yes"
                        value="1"
                        name='acceptsErotic'
                        checked={formValues.acceptsErotic === '1'}
                        onChange={(e) => handleChange(e)}
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
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="1"
                        label="Yes"
                        value="1"
                        name='acceptsLoan'
                        checked={formValues.acceptsLoan === '1'}
                        onChange={(e) => handleChange(e)}
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
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="1"
                        label="Yes"
                        value="1"
                        name='acceptsDating'
                        checked={formValues.acceptsDating === '1'}
                        onChange={(e) => handleChange(e)}
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
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="1"
                        label="Yes"
                        value="1"
                        name='acceptsCBD'
                        checked={formValues.acceptsCBD === '1'}
                        onChange={(e) => handleChange(e)}
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
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="1"
                        label="Yes"
                        value="1"
                        name='acceptsCrypto'
                        checked={formValues.acceptsCrypto === '1'}
                        onChange={(e) => handleChange(e)}
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
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="1"
                        label="Yes"
                        value="1"
                        name='acceptsMedic'
                        checked={formValues.acceptsMedic === '1'}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className='w-100 d-flex justify-content-end'>
                  <Col lg={6} className='ms-2'>
                  </Col>
                  <Col lg={5} className='mt-5 mb-2 d-flex'>
                    <Button className='d-flex ms-auto' onClick={handlePrevious}>{translate(languageData, "clickPrevious")}</Button>
                    <Button className='d-flex ms-2' onClick={() => addPublisherOfferServices()}> {orderLoading ? <img src={globalLoader} alt='loader' width={20} /> : translate(languageData, "addOffer")}</Button>

                  </Col>
                </Row>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Myoffer