import React, { useState, useEffect } from 'react';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import FileUpload from '../../Components/FileUpload/FileUpload';
import { FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import globalLoader from '../../../assets/images/loader.svg';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../Context/languageContext';
import { translate, formatDate } from '../../../utility/helper';
import { resubmitarticle, updaterResubmitarticle } from '../../../services/Resubmitarticle/resubmitarticle';

const AddArticle = () => {
    const [formValues, setFormValues] = useState({
        date: "",
        title: "",
        image: "",
        comment: "",
        content: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [editor, setEditor] = useState();
    const [pixabayUrl, setPixabayUrl] = useState('');
    const [pixabayImages, setPixabayImages] = useState([]);
    const [displayedImage, setDisplayedImage] = useState(null);
    const [image, setImage] = useState(null);

    const { languageData } = useLanguage();
    const navigate = useNavigate();
    const { id } = useParams();

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
                setPixabayImages([]);
            })
            .catch(error => {
                console.error('Error fetching image:', error);
            });
    };
    

    const handlePixabaySearch = () => {
        const apiKey = '40830107-516989e1559b076d66f20b16e';
        const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${pixabayUrl}&image_type=photo`;

        axios.get(apiUrl)
            .then(response => {
                setPixabayImages(response.data.hits);
            })
            .catch(error => {
                console.error('Error fetching images from Pixabay:', error);
            });
    };

    useEffect(() => {
        resubmitArticleServices();
    }, []);

    const resubmitArticleServices = async () => {
        const res = await resubmitarticle(id);
        if (res.success === true) {
            const dynamicImageUrl = `https://linkselling.augurslive.com/LinkSellingSystem/public/articles/${res.data[0].image}`;
            setFormValues({
                ...formValues,
                id: res.data[0].id,
                title: res.data[0].title,
                link: res.data[0].max_links,
                image: dynamicImageUrl,
                comment: res.data[0].comment,
                content: res.data[0].content,
                date: formatDate(res.data[0].created_at),
            });
            setDisplayedImage(dynamicImageUrl);
        }
    };

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

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image',
    ];

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
                toast.error(translate(languageData, "TitleofArticleField"));
                return;
            }
            if (linkCount > 0 && linkCount > formValues?.link) {
                toast.error(`${translate(languageData, "Toomanylinks")}: ${formValues.link}`);
                return;
            }
            if (linkCount === 0) {
                toast.error(translate(languageData, "Minimum1link"));
                return;
            }

            const res = await updaterResubmitarticle(formValues, formValues?.id);
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
                        <div className='my-5'>
                            <h5 className='fw-bold'>{translate(languageData, "AddArtiContents")}</h5>
                        </div>
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
                                    style={{ height: "300px" }}
                                />
                                {formValues?.link < linkCount && (
                                    <Alert variant="danger">
                                        {translate(languageData, "Toomanylinks")} : {formValues?.link}
                                    </Alert>
                                )}
                            </Col>
                        </Row>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "image")}</span>
                            </Col>
                            <Col xs={12} md={1} className='mt-3 mt-md-0'>
                                <div><img src={displayedImage} alt='Displayed' /></div>
                            </Col>
                            <Col xs={12} md={3} className='mt-3 mt-md-0'>
                                <div><FileUpload allowedFileExtensions={['.jpg', '.gif', '.png']} getData={handleFiles} name='image' /></div>
                            </Col>
                            <Col xs={12} md={1} className='mt-3 mt-md-0'>
                                <div>{translate(languageData, "orselectviapixabay")}</div>
                            </Col>

                            <Col xs={12} md={3} className='mt-3 mt-md-0'>
                                <div className='input-group mb-0'>
                                    <span className='input-group-text'>
                                        <Button
                                            className='btn btn-outline-primary'
                                            onClick={handlePixabaySearch}
                                            style={{ width: "30px", height: "30px", padding: "0" }}
                                        >
                                            <FaSearch />
                                        </Button>
                                    </span>
                                    <input
                                        className='form-control'
                                        type='text'
                                        name='pixabayImageUrl'
                                        placeholder={translate(languageData, "pixabayImage")}
                                        onChange={(e) => setPixabayUrl(e.target.value)}
                                        value={pixabayUrl}
                                    />
                                </div>
                                {pixabayImages.map(pixabayImage => (
                                    <div key={pixabayImage.id} onClick={() => handlePixabayImageSelect(pixabayImage)}>
                                        <img src={pixabayImage.previewURL} alt={pixabayImage.tags} />
                                    </div>
                                ))}
                            </Col>
                        </Row>
                    </Card.Body>
                    <div className='d-flex mb-5 mt-5'>
                        {loading ? <img src={globalLoader} className='mx-auto'/>:
                        <Button className='btn btn-primary btn-w-md mx-auto' onClick={() => updateResubmitArticleServices()}>
                            { translate(languageData, "submit")}
                        </Button>}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default AddArticle;
