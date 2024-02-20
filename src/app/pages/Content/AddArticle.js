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
import { projectList, uploadDocx } from '../../../services/ProjectServices/projectServices';
import { useEffect } from 'react';
import PixabayImageSearch from '../../Components/Pixabay/pixabay';
import { base64ToBinary } from '../../../utility/helper';
const AddArticle = () => {
    const userData2 = JSON.parse(localStorage.getItem("userData"))
    const lang = localStorage.getItem("lang");
    const initialValues = {
        document: "",
        project: "",
        title: "",
        lead: "",
        image: ""
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [articlesData2, setArticlesData2] = useState([]);
    const [title, setTitle] = useState('');
    const [lead, setLead] = useState('');
    const [content, setContent] = useState('');
    const [displayedImage, setDisplayedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const { languageData } = useLanguage();
    const navigate = useNavigate()

    useEffect(() => {
        setFormValues({ ...formValues, title: title, lead: lead })
    }, [title, lead])

    useEffect(() => {
        if (selectedFile) {
            uploadDocxServices()
        }
    }, [selectedFile])

    //pixabay Image selct start//

    const handlePixabayImageSelect = (selectedPixabayImage) => {
        fetch(selectedPixabayImage.largeImageURL)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const blob = new Blob([buffer], { type: 'image/jpeg' });
                const previewUrl = URL.createObjectURL(blob);
                setFormValues({
                    ...formValues,
                    image: blob,
                });

                setDisplayedImage(previewUrl);
            })
            .catch(error => {
                console.error('Error fetching image:', error);
            });
    };

    //pixabay Image selct end//

    const allowedDocExtensions = ['.docx'];
    const allowedImageExtension = ['.jpg', '.gif', '.png']

    const handleFiles = (file, name) => {
        setFormValues({ ...formValues, [name]: file });
        const reader = new FileReader();
        reader.onloadend = () => {
            setDisplayedImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

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
        const res = await addArticle(formValues, content, userData2.id)
        if (res.response === true && res.success === true) {
            toast(translate(languageData, "articleAddedSuccessfully"), {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,

                type: 'success'
            });
            if (type === "saveandexit") {
                setLoading2(false)
                navigate('/articleList')
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
            toast(translate(languageData, "Somthing went wrong"), {
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
        if (e.target && e.target.name) {
            const { name, value } = e.target;
            setFormValues({ ...formValues, [name]: value });
        }
    };

    const handleFileChange = (file) => {
        setSelectedFile(file);
    }


    const handleEditorChange = (html) => {
        setContent(html)
    }


    const validate = (values) => {
        let error = {};
        let isValid = true;

        if (!values.image) {
            error.image = "Image is required!"
            return isValid = false;
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
    
    const uploadDocxServices = async () => {
        setLoading(true);
        const res = await uploadDocx(selectedFile, lang);
        if (res.success === true) {
            toast(translate(languageData, "docxFileUploadSuccessfully"), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });

            if (res?.title && res?.lead && res?.content) {
                setFormValues({
                    ...formValues,
                    title: res?.title.trim().replace(/\s+/g, ' '),
                    lead: res?.lead.trim().replace(/\s+/g, ' '),
                    content: res?.content.trim().replace(/\s+/g, ' '),
                    image: base64ToBinary(res?.images[0]),

                });
            }
            setFormErrors("");
            setContent(res?.content)
            setDisplayedImage(res?.images[0])

        } else if (res.success === false && res.message.file[0] === "The file must be a file of type: docx.") {
            toast(`${translate(languageData, "pleaseUploadDocxFile")}`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
            setFormValues({
                title: "",
                lead: "",
                content: "",
                image: ""
            });
            setContent("")
            setDisplayedImage('')
            setFormErrors({ ...formErrors, document: translate(languageData, "pleaseUploadDocxFile") });
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

        setLoading(false);
    };
    return (
        <div>
            <ToastContainer />
            <div>
                <Card className='mt-5 pb-5'>
                    <Card.Header>
                        <h3>  {translate(languageData, "AddArticle")}</h3>
                    </Card.Header>
                    <Card.Body className='border-bottom pb-5'>

                        <Row className='align-items-center border-bottom pb-4'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "AddArtiImportDoc")} *</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div>
                                    <FileUpload
                                        allowedFileExtensions={allowedDocExtensions}
                                        getData={handleFileChange}
                                        name="document"
                                    />
                                </div>
                                {formErrors.document && (
                                    <div className="text-danger text-center">{formErrors.document}</div>
                                )}
                            </Col>
                        </Row>
                        <div className='my-5'><h5 className='fw-bold'>{translate(languageData, "AddArtiContents")}</h5></div>
                        <Row className='align-items-center '>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "AddArtiProjectAdvertising")} *</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="form-group">
                                    <select name="project" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country" onChange={(e) => { handleChange(e) }} onClick={() => validate(formValues)}>
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
                        <Row className='mt-4'>
                            <Col xs={12} md={4} className='mt-2'>
                                <span>{translate(languageData, "AddArtiLead")} *</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="lead is required">
                                    <textarea className="input100 py-2" type="text" name="lead" cols={8} rows={10} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} style={{ paddingLeft: "15px" }} value={formValues.lead} />
                                </div>
                                <div className='text-danger text-center mt-1'>{formErrors.lead}</div>
                            </Col>
                        </Row>
                        <Row className='mt-4 pb-8'>
                            <Col xs={12} md={4} className='mt-2'>
                                <span>{translate(languageData, "sidebarContent")} *</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    modules={modules}
                                    formats={formats}
                                    bounds={'.app'}
                                    placeholder="Write content"
                                    style={{ height: "300px" }}
                                    onChange={handleEditorChange}
                                />

                            </Col>
                        </Row>
                        <Row className='align-items-center mt-4'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "AddArtiMainImage")} *</span>
                            </Col>
                            <Col xs={12} md={1} className='mt-3 mt-md-0'>
                                <div><img src={displayedImage} alt='Displayed' /></div>
                            </Col>
                            <Col xs={12} md={3} className="mt-3 mt-md-0">
                                <div><FileUpload allowedFileExtensions={allowedImageExtension} getData={handleFiles} name="image" buttonName={translate(languageData, "uploadImage")} /></div>
                                <div className='text-danger text-center mt-1'>{formErrors.image}</div>
                            </Col>
                            <Col xs={12} md={1} className='mt-3 mt-md-0'>
                                <div>{translate(languageData, "orselectviapixabay")}</div>
                            </Col>
                            <Col xs={12} md={3} className='mt-3 mt-md-0'>
                                <PixabayImageSearch onSelectImage={handlePixabayImageSelect} />
                            </Col>
                        </Row>
                    </Card.Body>
                    <div className='mt-5 ms-auto px-3'>
                        <Button className='btn btn-primary' onClick={() => handleAddArticleServices("save")}> {translate(languageData, "Save")}  </Button>
                        <Button className='btn btn-primary ms-2' onClick={() => handleAddArticleServices("saveandexit")}>{loading2 ? <img src={globalLoader} width={20} height={20} /> : translate(languageData, "SaveAndExit")}  </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default AddArticle