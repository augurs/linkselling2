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

const AddArticle = () => {

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
    const [articleType, setArticleType] = useState('chooselater')
    const [editor, setEditor] = useState()


    const navigate = useNavigate()


    const allowedDocExtensions = ['.docx', '.doc', '.odt', '.html'];
    const allowedImageExtension = ['.jpg', '.gif', '.png']



    const handleFiles = (file, name) => {
        setFormValues({ ...formValues, [name]: file });
    }




    const handleArticleType = (type) => {
        setArticleType(type)
    }

    const handleAddArticleServices = async (type) => {

        if (type === "saveandexit") {
            setLoading2(true)
        } else {
            setLoading(true)
        }
        const res = await addArticle(formValues, editor)
        if (res.response === true && res.success === true) {
            setLoading(false)
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
            if (type === "saveandexit") {
                setLoading2(false)
                navigate('/articleList')
            } else {
                setLoading(false)
            }

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
            if (type === "saveandexit") {
                setLoading2(false)
            } else {
                setLoading(false)
            }
        }
    }

    const { languageData } = useLanguage();


    const projects = [
        "project1",
        "project2",
        "project3",
        "project4"
    ]


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
                                <span>{translate(languageData, "AddArtiImportDoc")}</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div><FileUpload allowedFileExtensions={allowedDocExtensions} getData={handleFiles} name="document" /></div>
                                <div className='text-danger text-center mt-1'>{formErrors.document}</div>
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
                                        {projects.map((item, index) => {
                                            return (
                                                <option value={item} key={index}>{item}</option>
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
                                    <input className="input100" type="text" name="title" placeholder={translate(languageData, "artilstTitle")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} />


                                </div>
                                <div className='text-danger text-center mt-1'>{formErrors.title}</div>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col xs={12} md={4} className='mt-2'>
                                <span>{translate(languageData, "AddArtiLead")}</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    <textarea className="input100 py-2" type="text" name="lead" cols={8} rows={10} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues)} style={{ paddingLeft: "15px" }} />
                                </div>
                                <div className='text-danger text-center mt-1'>{formErrors.lead}</div>
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
                        <Row className='align-items-center mt-4'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "AddArtiMainImage")}</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div><FileUpload allowedFileExtensions={allowedImageExtension} getData={handleFiles} name="image" /></div>
                                <div className='text-danger text-center mt-1'>{formErrors.image}</div>
                            </Col>
                        </Row>
                        {/* <Row className='align-items-center mt-4'>
                            <Col xs={12} md={4}>
                                <span>Attachments (JPG/JPEG/PNG/PDF)</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div><FileUpload allowedFileExtensions={allowedAttachmentExtension} /></div>
                            </Col>
                        </Row> */}
                    </Card.Body>
                    {/* <div className='p-4 px-5 mt-4'><h4>Type of article</h4></div> */}
                    {/* <div className='d-flex flex-wrap px-5 justify-content-center border-bottom pb-6'>
                        <Button className={`btn ${articleType === "chooselater" ? "btn-primary" : "btn-outline-primary"}   btn-w-md me-2 mt-2`} onClick={() => handleArticleType("chooselater")}>I want to choose later</Button>
                        <Button className={`btn  ${articleType === "paid" ? "btn-primary" : "btn-outline-primary"} btn-w-md me-2 mt-2`} onClick={() => handleArticleType("paid")}>Paid Article</Button>
                    </div> */}
                    {articleType === "paid" &&
                        <div className='px-5 mt-7'>
                            <div><h5 className='fw-bold'>Requirements for a publisher who publishes an article</h5></div>
                            <Row className='mt-5'>
                                <Col xs={12} md={3}>
                                    <span>Links in the article *</span>
                                </Col>
                                <Col xs={12} md={5} className="mt-3 mt-md-0">
                                    <div className="form-group">
                                        <select name="project" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country" >
                                            <option label="Project"></option>
                                            <option value="br">Brazil</option>
                                            <option value="cz">Czech Republic</option>
                                            <option value="de">Germany</option>
                                            <option value="pl">Poland</option>
                                        </select>
                                    </div>
                                </Col>
                                <Col xs={12} md={4} className="mt-3 mt-md-0 ">
                                    <div className="bg-light p-2">
                                        <div>Links to the project found in the content:</div>
                                        <div>- dofollow: 0</div>
                                        <div> - nofollow: 0</div>
                                        <div> Replace project's links with:</div>
                                        <div className='d-flex mt-2'><Button className='btn btn-outline-primary me-2'>dofollow</Button>
                                            <Button className='btn btn-outline-primary'>nofollow</Button>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={12} md={3}>
                                    <span>Press release</span>
                                </Col>
                                <Col xs={12} md={4} className="mt-3 mt-md-0">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input p-2 px-4" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-5'>
                                <Col xs={12} md={4}>
                                    <span>Special remarks to the Publisher</span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0">
                                    <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                        <textarea className="input100" type="password" name="search" cols={8} rows={10} />
                                    </div>
                                </Col>

                            </Row>
                            <Row className='mt-5'>
                                <Col xs={12} md={4}>
                                    <span>Photo source</span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0">
                                    <div className="form-group">
                                        <select name="project" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country" >
                                            <option label="Project"></option>
                                            <option value="br">Brazil</option>
                                            <option value="cz">Czech Republic</option>
                                            <option value="de">Germany</option>
                                            <option value="pl">Poland</option>
                                        </select>
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={12} md={4}>
                                    <span>Photo source</span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0">
                                    <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                        <input className="input100" type="password" name="search" style={{ paddingLeft: "15px" }} />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={12} md={4}>
                                    <span>I want to track traffic</span>
                                </Col>
                                <Col xs={12} md={8} className="mt-3 mt-md-0">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input p-2 px-4" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-5'>
                                <Col lg={8} className='border border-primary p-2 ms-auto py-4'>
                                    <div className='d-flex align-items-center'>
                                        <Col lg={1}>
                                            <div className='' style={{ width: "100px!important" }}><FaInfoCircle style={{ color: 'blue' }} size={25} /></div>
                                        </Col>
                                        <Col lg={11}>
                                            <div>If you enable this option and publish the article among Linkselling® publishers, you will get online access to information about the popularity and commitment of the article's readers in the panel.
                                                Tracking the popularity of the article is carried out using a safe, proprietary analytical code developed by Linkselling®.
                                                If the primary purpose of publishing an article is to purchase a link, we recommend that you disable this option. Not all Linkselling® portals support tracking code.</div>
                                        </Col>
                                    </div>

                                </Col>
                            </Row>

                        </div>}

                    <div className='mt-5 ms-auto px-3'>
                        <Button className='btn btn-primary' onClick={() => validate(formValues) ? handleAddArticleServices("save") : ""}> {loading ? <img src={globalLoader} width={20} height={20} /> : translate(languageData, "Save")}  </Button>
                        <Button className='btn btn-primary ms-2' onClick={() => validate(formValues) ? handleAddArticleServices("saveandexit") : ""}>{loading2 ? <img src={globalLoader} width={20} height={20} /> : translate(languageData, "SaveAndExit")}  </Button>
                        {articleType === "paid" && <Button className='btn btn-primary ms-2'>Send for Verification</Button>}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default AddArticle