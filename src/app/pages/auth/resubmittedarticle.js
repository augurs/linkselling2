import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import FileUpload from '../../Components/FileUpload/FileUpload'
import { useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa';
import { addArticle } from '../../../services/articleServices/articleServices';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import globalLoader from '../../../assets/images/loader.svg'
import ReactQuill from 'react-quill';
import { translate } from '../../../utility/helper';
import { useLanguage } from '../../Context/languageContext';
import { projectList } from '../../../services/ProjectServices/projectServices';
import { useEffect } from 'react';
import LanguageSelect from '../../Components/Language/languageSelect';
const AddArticle = () => {

    const initialValues = {
        link: "",
        date: "",
        title: "",
        image: ""
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [articleType, setArticleType] = useState('chooselater')
    const [editor, setEditor] = useState()
    const [articlesData2, setArticlesData2] = useState([]);
    const [title, setTitle] = useState('');
    const [lead, setLead] = useState('');
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState('');

    const userData2 = JSON.parse(localStorage.getItem("userData"))
    const { languageData } = useLanguage();
    const navigate = useNavigate()
    useEffect(() => {
        setEditor(content)
    }, [fileName, content])

    useEffect(() => {
        setFormValues({ ...formValues, title: title, lead: lead })
    }, [title, fileName, lead])





    const allowedDocExtensions = ['.docx', '.doc', '.odt', '.html'];
    const allowedImageExtension = ['.jpg', '.gif', '.png']



    const handleFiles = (file, name) => {
        setFormValues({ ...formValues, [name]: file });
    }




    const handleArticleType = (type) => {
        setArticleType(type)
    }

    const fieldTranslationMap = {
        content: translate(languageData, "ContentField"),
        document: translate(languageData, "DocumentField"),
        image: translate(languageData, "ImageField"),
        lead: translate(languageData, "LeadField"),
        project: translate(languageData, "ProjectNameField"),
        title: translate(languageData, "TitleField"),

    };
    const handleAddArticleServices = async (type) => {

        if (type === "saveandexit") {
            setLoading2(true)
        } else if (type === "save") {
            setLoading(true)
        }
        const res = await addArticle(formValues, editor, userData2.id)
        if (res.response === true && res.success === true) {
            toast(res.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,

                type: 'success'
            });
            if (type === "submit") {
                setLoading2(false)
                navigate('/')
            } else {
                setLoading(false)
            }

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
        }
        else {
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
        }
        if (type === "saveandexit") {
            setLoading2(false)
        } else if (type === "save") {
            setLoading(false)
        }
    };




    useEffect(() => {
        articleListServices2()

    }, [])
    const articleListServices2 = async () => {
        const res = await projectList(userData2?.id)
        setArticlesData2(res?.data.reverse())
    }




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };


    const handleEditorChange = (html) => {
        setEditor(html)
    }


    const validate = (values) => {
        let error = {};
        let isValid = true;
        if (!values.document) {
            error.document = "Document is required!"
            isValid = false;
        } else {
            const fileExtension = values?.document?.name?.slice(values?.document?.name?.lastIndexOf('.'));
            if (!allowedDocExtensions.includes(fileExtension)) {
                error.document = "Invalid file type. Allowed: .docx, .doc, .odt, .html";
                isValid = false;
            }
        }

        if (!values.image) {
            error.image = "Image is required!"
            return isValid = false;
        } else {
            const fileExtension = values?.image?.name?.slice(values?.image?.name?.lastIndexOf('.'));
            if (!allowedImageExtension.includes(fileExtension)) {
                error.image = "Invalid file type. Allowed: .JPG, .GIF, .PNG";
                isValid = false;
            }
        }


        if (!values.project) {
            error.project = "Please select your project"
            isValid = false;
        }

        if (!values.lead) {
            error.lead = "Lead is required"
            isValid = false;
        }

        if (!values.title) {
            error.title = "Title is required!"
            isValid = false;
        }
        setFormErrors(error);
        return isValid;
    }

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image'
    ];



    return (
        <div className='login-img'>
            <ToastContainer />
            <div className='d-flex justify-content-end mt-2 me-2' >
                <LanguageSelect />
            </div>
            <div>
                <Card className='mt-2'>
                    <Card.Header>
                        <h3>  {translate(languageData, "Resubmit Article")}</h3>
                    </Card.Header>
                    <Card.Body className='border-bottom pb-5'>

                        <div className='my-5'><h5 className='fw-bold'>{translate(languageData, "AddArtiContents")}</h5></div>
                        <Row className='align-items-center'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "artilstTitle")}*</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    <input className="input100" type="text" name="title" placeholder={translate(languageData, "artilstTitle")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} value={formValues.title} />
                                </div>
                                <div className='text-danger text-center mt-1'>{formErrors.title}</div>
                            </Col>
                        </Row>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>Publication date *</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    <input className="input100" type="date" name="date" placeholder='date' style={{ paddingLeft: "15px" }} />
                                </div>

                            </Col>
                        </Row>
                        <Row className='mt-4 pb-8'>
                            <Col xs={12} md={4} className='mt-2'>
                                <span>{translate(languageData, "sidebarContent")}</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <ReactQuill
                                    theme="snow"
                                    onChange={handleEditorChange}
                                    value={editor}
                                    modules={modules}
                                    formats={formats}
                                    bounds={'.app'}
                                    placeholder="Write content"
                                    style={{ height: "300px" }}
                                />

                            </Col>
                        </Row>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>Image *</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div><FileUpload allowedFileExtensions={allowedImageExtension} getData={handleFiles} name="image" /></div>
                            </Col>
                        </Row>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>Link *</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    <input className="input100" type="url" name="link" placeholder='link' style={{ paddingLeft: "15px" }} />
                                </div>

                            </Col>
                        </Row>


                    </Card.Body>

                    <div className='mt-5 ms-auto px-3 pb-3'>
                        <Button className='btn btn-primary' > {loading ? <img src={globalLoader} width={20} height={20} /> : translate(languageData, "Submit")}  </Button>
                        {articleType === "paid" && <Button className='btn btn-primary ms-2'>Send for Verification</Button>}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default AddArticle