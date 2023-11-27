import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import Select from 'react-select'
import { useState } from 'react'
import { addProjects, editProject, getProject } from '../../../services/ProjectServices/projectServices'
import globalLoader from '../../../assets/images/loader.svg'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { translate } from '../../../utility/helper'
import { useLanguage } from '../../Context/languageContext'

const EditProjects = () => {

    const { id } = useParams();

    let initialValues = {
        projectName: "",
        webAddress: "",
        publicationLang: "",
    }

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [updateLoader, setUpdateLoader] = useState(false)

    const { languageData } = useLanguage()

    const navigate = useNavigate()



    useEffect(() => {
        getProjectServices()
    }, [])


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value })
    }

    const handleSelectChange = (selectedOption) => {
        setFormValues({ ...formValues, publicationLang: selectedOption?.value })
        validate(formValues)
    }

  

    const editProjectServices = async () => {
        setUpdateLoader(true)
        const res = await editProject(formValues, id)
        if (res.success === true && res.response === 1) {
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
            setUpdateLoader(false)
        } else {
            toast("Something went wrong", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
            setUpdateLoader(false)
        }

        console.log(res, "116");
    }


    const getProjectServices = async () => {
        const res = await getProject(id)
        setFormValues({
            ...formValues,
            projectName: res.data[0].name,
            webAddress: res.data[0].domain,
            publicationLang: res.data[0].language,
        });
    }




    const validate = (values) => {
        let errors = {};
        let isValid = true;

        if (!values.projectName) {
            errors.projectName = translate(languageData , "ProjectNameRequired");
            isValid = false
        }

        if (!values.webAddress) {
            errors.webAddress = translate(languageData , "WebAddressRequired");
            isValid = false;
        }

        if (!values.publicationLang) {
            errors.publicationLang = translate(languageData , "PublicationLanguageRequired")
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    }




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
                <Card.Header><h2 className=''>{`${translate(languageData , "Edit")}  ${translate(languageData ,"artilstProject")}`}</h2></Card.Header>
                <Card.Body>
                    <Row className='align-items-center'>
                        <Col lg={3} xs={12}>
                        {translate(languageData , "NameOfTheProject")} *
                        </Col>
                        <Col lg={8} xs={12}>
                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                <input className="input100" type="text" name="projectName" placeholder='Project Name' style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} value={formValues.projectName} />
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
                                <input className="input100" type="text" name="webAddress" placeholder='Web Address' style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} value={formValues.webAddress} />
                            </div>
                            <div className='text-danger text-center mt-1'>{formErrors.webAddress}</div>
                        </Col>
                    </Row>
                    <Row className='align-items-center mt-3'>
                        <Col lg={3} xs={12}>
                        {translate(languageData , "LanguagePublication")} *
                        </Col>
                        <Col lg={8} xs={12}>
                            <Select options={languagesOpts} name='publicationLang' styles={{ control: (provided) => ({ ...provided, borderColor: '#ecf0fa', height: '45px', }) }} onChange={handleSelectChange} value={languagesOpts.find((option) => option.value === formValues.publicationLang)} />
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
                    <Button className='btn btn-primary btn-w-md mx-auto' onClick={() => validate(formValues) ? editProjectServices() : ""}>{updateLoader ? <img src={globalLoader} width={20} /> : translate(languageData , "Save")} </Button>
                </div>
            </Card>

        </div>
    )
}

export default EditProjects