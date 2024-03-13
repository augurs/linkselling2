import React, { useState, useEffect } from 'react';
import { Alert, Button, Card, Col, Dropdown, Row } from 'react-bootstrap';
import FileUpload from '../../Components/FileUpload/FileUpload';
import { ToastContainer, toast } from 'react-toastify';
import globalLoader from '../../../assets/images/loader.svg';
import ReactQuill from 'react-quill';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../Context/languageContext';
import { translate, formatDate } from '../../../utility/helper';
import { resubmitarticle, updaterResubmitarticle } from '../../../services/Resubmitarticle/resubmitarticle';
import PixabayImageSearch from '../../Components/Pixabay/pixabay';
import { modules, formats } from '../../../utility/helper';
import Select from 'react-select'
import { baseURL2 } from '../../../utility/data';
const AddArticle = () => {
    const [formValues, setFormValues] = useState({
        date: "",
        title: "",
        image: "",
        comment: "",
        content: "",
        userStatus: "",
        publisherMsgText: "",
        lead: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [editor, setEditor] = useState();
    const [dataFound, setDataFound] = useState('');

    const [rejectComment, setRejectComment] = useState();
    const [displayedImage, setDisplayedImage] = useState(null);
    const [showDropdown, setShowDropdown] = useState(true);
    const { languageData } = useLanguage();
    const { id } = useParams();
    const navigate = useNavigate()

    const accessToken = localStorage.getItem("accessToken")

    useEffect(() => {
        setEditor(formValues.content);
    }, [formValues.content]);


    const handleFiles = (file, name) => {
        setFormValues({ ...formValues, [name]: file });
        const reader = new FileReader();
        reader.onloadend = () => {
            setDisplayedImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

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


    const handleSelectChange = (selectedOption) => {
        setFormValues({ ...formValues, userStatus: selectedOption?.value })
        validate(formValues)
    }

    const languagesOpts = [
        {
            value: "AcceptPublication",
            label: translate(languageData, "AcceptPublication")
        },
        {
            value: "RejectPublication",
            label: translate(languageData, "RejectPublication")
        }
    ]

    useEffect(() => {
        resubmitArticleServices();
    }, []);

    const resubmitArticleServices = async () => {
        const res = await resubmitarticle(id, accessToken);
        console.log(res, "93");
        setDataFound(res)
        if (res.success === true) {
            const dynamicImageUrl = `${baseURL2}/LinkSellingSystem/public/articles/${res.data[0].image}`;
            setFormValues({
                ...formValues,
                id: res?.data[0]?.id,
                title: res?.data[0]?.title,
                link: res?.data[0]?.max_links,
                url: res?.data[0]?.link,
                image: dynamicImageUrl,
                comment: res?.data[0]?.comment,
                lead: res?.data[0]?.lead,
                content: res?.data[0]?.content,
                status: res?.data[0]?.status,
                date: formatDate(res?.data[0]?.created_at),
                minArticleLength: res?.data[0]?.min_article_length,
                maxArticleLength: res?.data[0]?.max_article_length,
                maxLeadLength: res?.data[0]?.lead_length_max,
                minLeadLength: res?.data[0]?.lead_length_min ? res?.data[0]?.lead_length_min : 0
            });
            setDisplayedImage(dynamicImageUrl);
            setShowDropdown(res.data[0].status === 'Published');
        } else {
            setShowDropdown(false);
        }
    };

    console.log(dataFound?.success == true && dataFound?.msg == "Data found", "124");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleEditorChange = (html) => {
        setEditor(html);
        setFormValues({ ...formValues, content: html });
    };

    const validate = (values) => {
        let error = {};
        let isValid = true;
        if (!values.image) {
            error.image = "Image is required!";
            isValid = false;
        } else {
            const fileExtension = values?.image?.name?.slice(values?.image?.name?.lastIndexOf('.'));
            if (!['.jpg', '.gif', '.png'].includes(fileExtension)) {
                error.image = "Invalid file type. Allowed: .JPG, .GIF, .PNG";
                isValid = false;
            }
        }
        if (!values.title) {
            error.title = "Title is required!";
            isValid = false;
        }
        setFormErrors(error);
        return isValid;
    };

    const countLinksInEditor = (editorContent) => {
        const parser = new DOMParser();
        const parsedContent = parser.parseFromString(editorContent, 'text/html');
        const linkCount = parsedContent.querySelectorAll('a').length;
        return linkCount;
    };

    const linkCount = countLinksInEditor(editor);

    const updateResubmitArticleServices = async () => {
        setLoading(true);

        try {
            if (!formValues.title) {
                toast(translate(languageData, "TitleofArticleField"), {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }
            if (linkCount > 0 && linkCount > formValues?.link) {
                toast(`${translate(languageData, "Toomanylinks")}: ${formValues.link}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }
            if (linkCount === 0) {
                toast(translate(languageData, "Minimum1link"), {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }
            if (editor?.replace(/<[^>]*>/g, '').length > formValues?.maxArticleLength) {
                const maxArticleLength = formValues?.maxArticleLength;
                const errorMessage = `${translate(languageData, "maxArticleLength")}: ${maxArticleLength}`;
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

                return;
            }

            if (editor?.replace(/<[^>]*>/g, '').length < formValues?.minArticleLength) {
                const minArticleLength = formValues?.minArticleLength;
                const errorMessage = `${translate(languageData, "minArticleLength")}: ${minArticleLength}`;
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

                return;
            }

            if (formValues?.lead?.length > formValues?.maxLeadLength) {
                const maxLeadLength = formValues?.maxLeadLength;
                const errorMessage = `${translate(languageData, "maxLeadLength")}: ${maxLeadLength}`;
                toast(errorMessage, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });

                return;
            }


            const res = await updaterResubmitarticle(formValues, formValues?.id, rejectComment, accessToken);
            if (res.success === true) {
                toast(translate(languageData, "articleAddedSuccessfully"), {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'success',
                });
                setTimeout(() => {
                    navigate('/orders')
                }, 1000);
            } else {
                toast(translate(languageData, "loginFailureMessage2"), {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error',
                });
            }
        } catch (error) {
            console.error('Error updating article:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=''>
            <ToastContainer />
            <div>
                <Card className='mt-2'>
                    <Card.Header>
                        <h3>{translate(languageData, "resubmitArticle")}</h3>
                    </Card.Header>
                    <Card.Body className='border-bottom pb-5'>
                        {(dataFound.success == true && dataFound?.msg == "Data found") ?
                            (
                                <div className='my-5'>
                                    <h5 className='fw-bold'>{translate(languageData, "AddArtiContents")}</h5>
                                </div>) : ""}

                        {showDropdown ? (
                            <>
                                <Row className='align-items-center mt-5'>
                                    <Col xs={12} md={4}>
                                        <span>{translate(languageData, "PublicationId")}</span>
                                    </Col>
                                    <Col xs={12} md={8} className='mt-3 mt-md-0'>
                                        <div className='wrap-input100 validate-input mb-0' data-bs-validate='Password is required'>
                                            {formValues.id}
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='align-items-center mt-5'>
                                    <Col xs={12} md={4}>
                                        <span>{translate(languageData, "link")}</span>
                                    </Col>
                                    <Col xs={12} md={8} className='mt-3 mt-md-0'>
                                        <a href={formValues?.url} className='wrap-input100 validate-input mb-0'>
                                            {formValues?.url}
                                        </a>
                                    </Col>
                                </Row>
                                <Row className='align-items-center mt-5'>
                                    <Col xs={12} md={4}>
                                        <span>{translate(languageData, "Status")}</span>
                                    </Col>
                                    <Col xs={12} md={8} className='mt-3 mt-md-0'>
                                        <Select options={languagesOpts} placeholder={translate(languageData, "Select")} styles={{ control: (provided) => ({ ...provided, borderColor: '#ecf0fa', height: '45px', }) }} onChange={handleSelectChange} />
                                        <div className='text-danger text-center mt-1'>{formErrors.userStatus}</div>
                                    </Col>

                                </Row>
                                {formValues?.userStatus == "RejectPublication" ?
                                    <Row className='align-items-center mt-5'>
                                        <Col xs={12} md={4}>
                                            <span>{translate(languageData, "Status")}</span>
                                        </Col>
                                        <Col xs={12} md={8} className='mt-3 mt-md-0'>
                                            <textarea className="input100" type="text" name="RejectComment" cols={3} rows={3} style={{ paddingLeft: "5px" }} onChange={(e) => setRejectComment(e.target.value)} />
                                        </Col>

                                    </Row> : ""}
                            </>
                        ) : (
                            (dataFound.success == true && dataFound?.msg == "Data found") ?
                                (
                                    <>
                                        <Row className='align-items-center'>
                                            <Col xs={12} md={4}>
                                                <span>{translate(languageData, "artilstTitle")}*</span>
                                            </Col>
                                            <Col xs={12} md={8} className='mt-3 mt-md-0'>
                                                <div className='wrap-input100 validate-input mb-0' data-bs-validate='Password is required'>
                                                    <input
                                                        className='input100'
                                                        type='text'
                                                        name='title'
                                                        placeholder={translate(languageData, "artilstTitle")}
                                                        style={{ paddingLeft: "15px" }}
                                                        onChange={(e) => handleChange(e)}
                                                        value={formValues.title}
                                                    />
                                                </div>
                                                <div className='text-danger text-center mt-1'>{formErrors.title}</div>
                                            </Col>
                                        </Row>
                                        <Row className='align-items-center mt-5'>
                                            <Col xs={12} md={4}>
                                                <span>{translate(languageData, "CommentsAndRecommendations")}</span>
                                            </Col>
                                            <Col xs={12} md={8} className='mt-3 mt-md-0'>
                                                <div className='wrap-input100 validate-input mb-0' data-bs-validate='Password is required'>
                                                    <textarea
                                                        className='input100'
                                                        type='text'
                                                        name='comment'
                                                        style={{ paddingLeft: "15px" }}
                                                        onChange={(e) => handleChange(e)}
                                                        onKeyDown={() => validate(formValues)}
                                                        value={formValues?.comment}
                                                    />
                                                </div>
                                                <div className='text-danger text-center mt-1'>{formErrors?.comment}</div>
                                            </Col>
                                        </Row>
                                        <Row className='align-items-center mt-5'>
                                            <Col xs={12} md={4}>
                                                <span>{translate(languageData, "PublicationDate")}</span>
                                            </Col>
                                            <Col xs={12} md={8} className='mt-3 mt-md-0'>
                                                <div className='wrap-input100 validate-input mb-0' data-bs-validate='date is required'>
                                                    <input
                                                        className='input100'
                                                        type='date'
                                                        name='date'
                                                        placeholder='date'
                                                        style={{ paddingLeft: "15px" }}
                                                        onChange={(e) => handleChange(e)}
                                                        value={formValues?.date}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className='align-items-center mt-5'>
                                            <Col xs={12} md={4}>
                                                <span>{translate(languageData, "AddArtiLead")}</span>
                                            </Col>
                                            <Col xs={12} md={8} className='mt-3 mt-md-0'>
                                                <div className='wrap-input100 validate-input mb-0'>
                                                    <textarea
                                                        className='input100'
                                                        type='text'
                                                        name='lead'
                                                        style={{ paddingLeft: "15px" }}
                                                        onChange={(e) => handleChange(e)}
                                                        onKeyDown={() => validate(formValues)}
                                                        value={formValues?.lead}
                                                        rows={8}
                                                        cols={6}
                                                    />
                                                </div>
                                                <p className="text-end">{formValues?.lead?.length || 0}/{formValues?.minLeadLength}-{formValues?.maxLeadLength} Character</p>
                                                <div className='text-danger text-center mt-1'>{formErrors?.lead}</div>
                                            </Col>
                                        </Row>
                                        <Row className='mt-4 pb-8'>
                                            <Col xs={12} md={4} className='mt-2'>
                                                <span>{translate(languageData, "sidebarContent")} *</span>
                                            </Col>
                                            <Col xs={12} md={8} className='mt-3 mt-md-0'>
                                                <ReactQuill
                                                    theme='snow'
                                                    onChange={handleEditorChange}
                                                    value={editor}
                                                    modules={modules}
                                                    formats={formats}
                                                    bounds={'.app'}
                                                    placeholder='Write content'
                                                />
                                                {formValues?.link < linkCount && (
                                                    <Alert variant="danger">
                                                        {translate(languageData, "Toomanylinks")} : {formValues?.link}
                                                    </Alert>
                                                )}
                                                <p className="text-end">{editor?.replace(/<[^>]*>/g, '').length || 0}/{formValues?.minArticleLength ? formValues?.minArticleLength : 0}-{formValues?.maxArticleLength ? formValues?.maxArticleLength : 0} Character</p>
                                            </Col>
                                        </Row>
                                        <Row className='align-items-center mt-5'>
                                            <Col xs={12} md={4}>
                                                <span>{translate(languageData, "MessageforPublisher")} </span>
                                            </Col>
                                            <Col xs={12} md={8} className="mt-3 mt-md-0 mb-3">
                                                <div className="wrap-input100 validate-input mb-0">
                                                    <input
                                                        className='input100'
                                                        type='text'
                                                        name='publisherMsgText'
                                                        placeholder={translate(languageData, "MessageforPublisher")}
                                                        style={{ paddingLeft: "15px" }}
                                                        onChange={(e) => handleChange(e)}
                                                        value={formValues.publisherMsgText}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className='align-items-center mt-5'>
                                            <Col xs={12} md={4}>
                                                <span>{translate(languageData, "image")}</span>
                                            </Col>
                                            <Col xs={12} md={1} className='mt-3 mt-md-0'>
                                                <div>{displayedImage ? <img src={displayedImage} alt='Displayed' /> : ""}</div>
                                            </Col>
                                            <Col xs={12} md={3} className='mt-3 mt-md-0'>
                                                <div><FileUpload allowedFileExtensions={['.jpg', '.gif', '.png']} getData={handleFiles} name='image' buttonName={translate(languageData, "uploadImage")} /></div>
                                            </Col>
                                            <Col xs={12} md={1} className='mt-3 mt-md-0'>
                                                <div>{translate(languageData, "orselectviapixabay")}</div>
                                            </Col>

                                            <Col xs={12} md={3} className='mt-3 mt-md-0'>
                                                <PixabayImageSearch onSelectImage={handlePixabayImageSelect} />
                                            </Col>
                                        </Row>
                                    </>) : (<div className='text-center'>{translate(languageData, "notFoundAnyNewRecords")}</div>))}
                    </Card.Body>
                    {(dataFound.success == true && dataFound?.msg == "Data found") ?
                        (
                            <div className='d-flex justify-content-end'>
                                {loading ? <img src={globalLoader} className='mx-auto' /> :
                                    <div className='d-flex gap-2 mx-4 my-3'>
                                        <Button className='btn btn-primary' onClick={() => updateResubmitArticleServices()}>
                                            {translate(languageData, "submit")}
                                        </Button>
                                    </div>
                                }
                            </div>) : ""}
                </Card>
            </div>
        </div>
    );
}

export default AddArticle;
