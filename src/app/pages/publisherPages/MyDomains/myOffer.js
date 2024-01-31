import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, Card, Col, Row, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import globalLoader from '../../../../assets/images/loader.svg'
import { translate } from '../../../../utility/helper';
import { useLanguage } from '../../../Context/languageContext';
import { addDomainUrl, listDomain } from '../../../../services/PublisherServices/MyDomainServices/MyDomainServices';
import { categoryofferList } from '../../../../services/PublisherServices/MyOfferServices/MyofferServices';

const Myoffer = () => {
  const initialValues = {
    enterDomain: "",
    price: "",
    language: "pl",
    category: "",
    maxLinks: "",
    typeofAnchors: "EMA",
    Nofollow: "No",
    contactMail: "",
    contactPhone: "",

    articleMaxLength: "",
    articleMinLength: "",
    leadLength: "",
    ArticleGoesToHomepage: "No",

    acceptsCasino: "No",
    acceptsGambling: "No",
    acceptsErotic: "No",
    acceptsLoan: "No",
    acceptsDating: "No",
    acceptsCBD: "No",
    acceptsCrypto: "No",
    acceptsMedic: "No",


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

  const orderArticleServices = async () => {
    setOrderLoading(true);
    if (!formValues.enterUrl) {
      toast(translate(languageData, "DomainFieldNotEmpty"), {
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
    const res = await addDomainUrl(formValues, publisherData?.user?.id, currLang);
    if (res.success === true) {
      toast(translate(languageData, "DomainAddedSuccessfully"), {
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
                      <Form.Select size="lg" name="enterDomain" onChange={(e) => handleChange(e)} onClick={() => validate(formValues)}>
                        <option label={translate(languageData, "enterDomain")} className='bg-primary'></option>
                        {domainList?.map((item, index) => {
                          return (
                            <option value={item.id} key={index}>{item.url}</option>
                          )
                        })}
                      </Form.Select>
                    </div>
                    <div className='text-danger text-center mt-1'>{formErrors.project}</div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "price")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0">
                      <input className="input100" type="number" name="price" placeholder={translate(languageData, "price")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "category")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="form-group">
                      <Form.Select size="lg" name="category" onChange={(e) => handleChange(e)} onClick={() => validate(formValues)}>
                        <option label={translate(languageData, "category")} className='bg-primary'></option>
                        {categoryList?.map((item, index) => {
                          return (
                            <option value={item.name} key={index}>{item.name}</option>
                          )
                        })}
                      </Form.Select>
                    </div>
                    <div className='text-danger text-center mt-1'>{formErrors.project}</div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "Language")} *</span>
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
                    <span>{translate(languageData, "typeofAnchors")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                      <Form.Check
                        type="radio"
                        id="EMA"
                        label="EMA"
                        name='typeofAnchors'
                        value="EMA"
                        checked={formValues.typeofAnchors === 'EMA'}
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="Brand"
                        label="Brand"
                        value="Brand"
                        name='typeofAnchors'
                        checked={formValues.typeofAnchors === 'Brand'}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "Nofollow")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                      <Form.Check
                        type="radio"
                        id="No"
                        label="No"
                        name='Nofollow'
                        value="No"
                        checked={formValues.Nofollow === 'No'}
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="Yes"
                        label="Yes"
                        value="Yes"
                        name='Nofollow'
                        checked={formValues.Nofollow === 'Yes'}
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
                      <input className="input100" type="number" name="maxLinks" placeholder={translate(languageData, "maxLinks")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "contactPhone")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0">
                      <input className="input100" type="number" name="contactPhone" placeholder={translate(languageData, "contactPhone")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "contactMail")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0">
                      <input className="input100" type="text" name="contactMail" placeholder={translate(languageData, "contactMail")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
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
                      <input className="input100" type="number" name="articleMaxLength" placeholder={translate(languageData, "articleMaxLength")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "articleMinLength")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0">
                      <input className="input100" type="number" name="articleMinLength" placeholder={translate(languageData, "articleMinLength")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "leadLength")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0">
                      <input className="input100" type="number" name="leadLength" placeholder={translate(languageData, "leadLength")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "ArticleGoesToHomepage")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                      <Form.Check
                        type="radio"
                        id="No"
                        label="No"
                        name='ArticleGoesToHomepage'
                        value="No"
                        checked={formValues.ArticleGoesToHomepage === 'No'}
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="Yes"
                        label="Yes"
                        value="Yes"
                        name='ArticleGoesToHomepage'
                        checked={formValues.ArticleGoesToHomepage === 'Yes'}
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
                    <span>{translate(languageData, "acceptsCasino")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                      <Form.Check
                        type="radio"
                        id="No"
                        label="No"
                        name='acceptsCasino'
                        value="No"
                        checked={formValues.acceptsCasino === 'No'}
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="Yes"
                        label="Yes"
                        value="Yes"
                        name='acceptsCasino'
                        checked={formValues.acceptsCasino === 'Yes'}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "acceptsGambling")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                      <Form.Check
                        type="radio"
                        id="No"
                        label="No"
                        name='acceptsGambling'
                        value="No"
                        checked={formValues.acceptsGambling === 'No'}
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="Yes"
                        label="Yes"
                        value="Yes"
                        name='acceptsGambling'
                        checked={formValues.acceptsGambling === 'Yes'}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "acceptsErotic")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                      <Form.Check
                        type="radio"
                        id="No"
                        label="No"
                        name='acceptsErotic'
                        value="No"
                        checked={formValues.acceptsErotic === 'No'}
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="Yes"
                        label="Yes"
                        value="Yes"
                        name='acceptsErotic'
                        checked={formValues.acceptsErotic === 'Yes'}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "acceptsLoan")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                      <Form.Check
                        type="radio"
                        id="No"
                        label="No"
                        name='acceptsLoan'
                        value="No"
                        checked={formValues.acceptsLoan === 'No'}
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="Yes"
                        label="Yes"
                        value="Yes"
                        name='acceptsLoan'
                        checked={formValues.acceptsLoan === 'Yes'}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "acceptsDating")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                      <Form.Check
                        type="radio"
                        id="No"
                        label="No"
                        name='acceptsDating'
                        value="No"
                        checked={formValues.acceptsDating === 'No'}
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="Yes"
                        label="Yes"
                        value="Yes"
                        name='acceptsDating'
                        checked={formValues.acceptsDating === 'Yes'}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "acceptsCBD")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                      <Form.Check
                        type="radio"
                        id="No"
                        label="No"
                        name='acceptsCBD'
                        value="No"
                        checked={formValues.acceptsCBD === 'No'}
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="Yes"
                        label="Yes"
                        value="Yes"
                        name='acceptsCBD'
                        checked={formValues.acceptsCBD === 'Yes'}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "acceptsCrypto")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                      <Form.Check
                        type="radio"
                        id="No"
                        label="No"
                        name='acceptsCrypto'
                        value="No"
                        checked={formValues.acceptsCrypto === 'No'}
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="Yes"
                        label="Yes"
                        value="Yes"
                        name='acceptsCrypto'
                        checked={formValues.acceptsCrypto === 'Yes'}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-center mt-5'>
                  <Col xs={12} md={4}>
                    <span>{translate(languageData, "acceptsMedic")} *</span>
                  </Col>
                  <Col xs={12} md={8} className="mt-3 mt-md-0">
                    <div className="wrap-input100 validate-input mb-0 d-flex gap-5">
                      <Form.Check
                        type="radio"
                        id="No"
                        label="No"
                        name='acceptsMedic'
                        value="No"
                        checked={formValues.acceptsMedic === 'No'}
                        onChange={(e) => handleChange(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="Yes"
                        label="Yes"
                        value="Yes"
                        name='acceptsMedic'
                        checked={formValues.acceptsMedic === 'Yes'}
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
                    <Button className='d-flex ms-2'> {orderLoading ? <img src={globalLoader} alt='loader' width={20} /> : translate(languageData, "addOffer")}</Button>

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