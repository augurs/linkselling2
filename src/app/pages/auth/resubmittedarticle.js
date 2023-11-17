import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import FileUpload from '../../Components/FileUpload/FileUpload'
import { useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa';
import { addArticle } from '../../../services/articleServices/articleServices';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import globalLoader from '../../../assets/images/loader.svg'
import ReactQuill from 'react-quill';
import { translate, formatDate } from '../../../utility/helper';
import { useLanguage } from '../../Context/languageContext';
import { resubmitarticle, updaterResubmitarticle } from '../../../services/Resubmitarticle/resubmitarticle';
import { useEffect } from 'react';
import LanguageSelect from '../../Components/Language/languageSelect';

const AddArticle = () => {

    const initialValues = {
        link: "",
        date: "",
        title: "",
        image: "",
        comment: "",
        content: "",
        date: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [editor, setEditor] = useState()
    const [title, setTitle] = useState('');
    const [lead, setLead] = useState('');
    const [fileName, setFileName] = useState('');
    const [resubmitArticles, setResubmitArticle] = useState([])
    const { languageData } = useLanguage();
    const navigate = useNavigate();
    const content = formValues.content;
    const { id } = useParams();

    useEffect(() => {
        setEditor(content)
    }, [content])

    useEffect(() => {
        setFormValues({ ...formValues, title: title })
    }, [title, fileName])

    const allowedImageExtension = ['.jpg', '.gif', '.png']



    const handleFiles = (file, name) => {
        setFormValues({ ...formValues, [name]: file });
    }


    const fieldTranslationMap = {
        content: translate(languageData, "ContentField"),
        image: translate(languageData, "ImageField"),
        title: translate(languageData, "TitleField"),

    };



    useEffect(() => {
        resubmitArticleServices()

    }, [])
    const resubmitArticleServices = async () => {
        const res = await resubmitarticle(id)
        if (res.success === true) {
            setFormValues({
                ...formValues,
                id: res.data[0].id,
                title: res.data[0].title,
                link: res.data[0].max_links,
                image: res.data[0].image,
                comment: res.data[0].comment,
                content: res.data[0].content,
                date: formatDate(res.data[0].created_at)

            });
        }
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

    const updateResubmitArticleServices = async () => {
        setLoading(true)
        const res = await updaterResubmitarticle(formValues, 1)
        if (res.success === true) {
            toast(translate(languageData, "articleAddedSuccessfully"), {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            setLoading(false)
        } else {
            toast(translate(languageData, "loginFailureMessage2"), {
                position: "top-center",
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

        console.log(res, "116");
    }

    return (
        <div className=''>
            <ToastContainer />
            <div>
                <Card className='mt-2'>
                    <Card.Header>
                        <h3>  {translate(languageData, "resubmitArticle")}</h3>
                    </Card.Header>
                    <Card.Body className='border-bottom pb-5'>

                        <div className='my-5'><h5 className='fw-bold'>{translate(languageData, "AddArtiContents")}</h5></div>
                        <Row className='align-items-center'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "artilstTitle")}*</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    <input className="input100" type="text" name="title" placeholder={translate(languageData, "artilstTitle")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} value={formValues.title} />
                                </div>
                                <div className='text-danger text-center mt-1'>{formErrors.title}</div>
                            </Col>
                        </Row>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "CommentsAndRecommendations")} *</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    <textarea className="input100" type="text" name="comment" style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} value={formValues.comment} />
                                </div>
                                <div className='text-danger text-center mt-1'>{formErrors.comment}</div>
                            </Col>
                        </Row>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "PublicationDate")}</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="date is required">
                                    <input className="input100" type="date" name="date" placeholder='date' style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} value={formValues?.date} />
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
                                <span>{translate(languageData, "image")}</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div><FileUpload allowedFileExtensions={allowedImageExtension} getData={handleFiles} name="image" value={formValues?.image} /></div>
                            </Col>
                        </Row>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "link")} *</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    <input className="input100" type="url" name="link" placeholder={translate(languageData, "link")} style={{ paddingLeft: "15px" }} value={formValues?.link} onChange={(e) => handleChange(e)} />
                                </div>

                            </Col>
                        </Row>
                    </Card.Body>

                    <div className='d-flex mb-5 mt-5'>
                        <Button className='btn btn-primary btn-w-md mx-auto' onClick={() => validate(formValues) ? updateResubmitArticleServices() : ""}>{loading ? <img src={globalLoader} width={20} /> : translate(languageData, "submit")} </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default AddArticle