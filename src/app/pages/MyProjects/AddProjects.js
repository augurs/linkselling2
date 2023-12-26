import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import Select from 'react-select'
import { languages } from '../../../utility/data'
import { useState } from 'react'
import { addProjects } from '../../../services/ProjectServices/projectServices'
import globalLoader from '../../../assets/images/loader.svg'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { translate } from '../../../utility/helper'
import { useLanguage } from '../../Context/languageContext'
import { isValidUrl } from '../../../utility/data'

const AddProjects = () => {

    const { languageData } = useLanguage()

    let initialValues = {
        projectName: "",
        webAddress: "",
        publicationLang: "",
    }
    

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(false)


    const navigate = useNavigate()


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value })
    }

    const handleSelectChange = (selectedOption) => {
        setFormValues({ ...formValues, publicationLang: selectedOption?.value })
        validate(formValues)
    }

    const fieldTranslationMap = {
        name: translate(languageData, "ProjectNameField"),
        language: translate(languageData, "publicationLanguageField"),
        domain: translate(languageData, "WebAddressField"),

    };
    const addProjectService = async () => {

        setLoading(true)
        const res = await addProjects(formValues);

        if (res.response === true && res.success === true) {
            toast(translate(languageData, "Projectaddedsucessfully"), {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,

                type: 'success'
            });
            setTimeout(() => {
                navigate('/projectList')
            }, 1000);

            setLoading(false)
        }else if (res.success === false && res.response) {
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
            toast(translate(languageData, "loginFailureMessage2"), {
                position: "top-right",
                autoClose: 5000,
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


    const validate = (values) => {
        let errors = {};
        let isValid = true;

        if (!values.projectName) {
            errors.projectName = translate(languageData , "ProjectNameRequired");
            isValid = false
        }

        else if (!isValidUrl(values.webAddress)) {
            errors.webAddress = translate(languageData, 'InvalidWebAddress');
            isValid = false;
          }

        if (!values.publicationLang) {
            errors.publicationLang = translate(languageData , "PublicationLanguageRequired")
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    }


    const languageOption = languages.map((item) => {
        return {
            value: item.name,
            label: item.name
        }
    })

    const languagesOpts = [
        {
            value: "English",
            label: "English"
        },
        {
            value: "Polish",
            label: "Polish"
        }
    ]






    return (
        <div className='p-4'>
            <ToastContainer />
            <Card>
                <Card.Header><h2 className=''>{translate(languageData, "AddProject")}</h2></Card.Header>
                <Card.Body>
                    <Row className='align-items-center'>
                        <Col lg={3} xs={12}>
                           {translate(languageData , "NameOfTheProject")} *
                        </Col>
                        <Col lg={8} xs={12}>
                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                <input className="input100" type="text" name="projectName" placeholder={translate(languageData, "ProjectName")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                            </div>
                            <div className='text-danger text-center mt-1'>{formErrors.projectName}</div>
                        </Col>
                    </Row>
                    <Row className='align-items-center mt-3'>
                        <Col lg={3} xs={12}>
                        {translate(languageData , "WebAddress")} *
                        </Col>
                        <Col lg={8} xs={12}>
                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                <input className="input100" type="text" name="webAddress" placeholder={translate(languageData, "WebAddress")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />
                            </div>
                            <div className='text-danger text-center mt-1'>{formErrors.webAddress}</div>
                        </Col>
                    </Row>
                    <Row className='align-items-center mt-3'>
                        <Col lg={3} xs={12}>
                        {translate(languageData , "publicationLanguage")} *
                        </Col>
                        <Col lg={8} xs={12}>
                            <Select options={languagesOpts} name='publicationLang' styles={{ control: (provided) => ({ ...provided, borderColor: '#ecf0fa', height: '45px', }) }} onChange={handleSelectChange} />
                            <div className='text-danger text-center mt-1'>{formErrors.publicationLang}</div>
                        </Col>

                    </Row>
                    {/* <Row className='align-items-center mt-3'>
                        <Col lg={3} xs={12}>
                            Country of publication
                        </Col>
                        <Col lg={8} xs={12}>
                            <div className="form-group">
                                <select name="publicationCountry" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country" onChange={(e) => handleChange(e)} onClick={() => validate(formValues)} >
                                    <option label="country"></option>
                                    <option value="All">
                                        All</option>
                                    <option value="Polska">Polska</option>

                                </select>
                            </div>
                            <div className='text-danger text-center mt-1'>{formErrors.publicationCountry}</div>
                        </Col>
                    </Row> */}
                </Card.Body>
                <div className='d-flex mb-5'>
                    <Button className='btn btn-primary btn-w-md mx-auto' onClick={() => addProjectService()}>{loading ? <img src={globalLoader} width={20} /> : translate(languageData , "Save")} </Button>
                </div>
            </Card>

        </div>
    )
}

export default AddProjects