import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import FileUpload from '../../Components/FileUpload/FileUpload'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import globalLoader from '../../../assets/images/loader.svg'
import { translate, formatDate } from '../../../utility/helper';
import { useLanguage } from '../../Context/languageContext';
import { uploadimagereqarticle, updaterimagrequestedarticle } from '../../../services/Resubmitarticle/resubmitarticle';
import { useEffect } from 'react';
import PixabayImageSearch from '../../Components/Pixabay/pixabay';

const AddArticle = () => {

    const initialValues = {
        image: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [loading, setLoading] = useState(false)
    const [displayedImage, setDisplayedImage] = useState(null);

    const { languageData } = useLanguage();


    const userData2 = JSON.parse(localStorage.getItem("userData"))


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





    const { id } = useParams();





    useEffect(() => {
        resubmitimg()

    }, [])
    const resubmitimg = async () => {
        const res = await uploadimagereqarticle(userData2?.id, id)
        if (res.success === true) {
            const dynamicImageUrl = `https://linkselling.augurslive.com/LinkSellingSystem/public/articles/${res.data[0].image}`;
            setFormValues({
                ...formValues,
                id: res.data[0].id,
                title: res.data[0].title,
                link: res.data[0].max_links,
                image: dynamicImageUrl,
                comment: res.data[0].comments,
                content: res.data[0].content,
                date: formatDate(res.data[0].created_at)

            });
        }
    }

    const handleFiles = (file, name) => {
        setFormValues({ ...formValues, [name]: file });
        const reader = new FileReader();
        reader.onloadend = () => {
            setDisplayedImage(reader.result);
        };
        reader.readAsDataURL(file);
    };


    const allowedImageExtension = ['.jpg', '.gif', '.png']



    const updateResubmitArticleServices = async () => {
        setLoading(true)
        const res = await updaterimagrequestedarticle(formValues, formValues?.id)
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
                                <span>{translate(languageData, "artilstTitle")}</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    {formValues?.title}
                                </div>
                            </Col>
                        </Row>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "CommentsAndRecommendations")} </span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    {formValues?.comment}
                                </div>

                            </Col>
                        </Row>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "PublicationDate")}</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    {formValues?.date}
                                </div>

                            </Col>
                        </Row>
                        <Row className='mt-4 pb-8'>
                            <Col xs={12} md={4} className='mt-2'>
                                <span>{translate(languageData, "sidebarContent")}</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                {formValues?.content}

                            </Col>
                        </Row>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "link")} </span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    {formValues?.link}
                                </div>

                            </Col>
                        </Row>
                        <h2 className='mt-5'>{translate(languageData, "UpdateImage")} *</h2>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "image")}</span>
                            </Col>
                            <Col xs={12} md={1} className='mt-3 mt-md-0'>
                            {displayedImage ? <div> <img src={displayedImage} alt='Displayed' /></div> : <div className= "border border-primary text-center">Image Preview</div>}
                            </Col>
                            <Col xs={12} md={3} className="mt-3 mt-md-0">
                                <div><FileUpload allowedFileExtensions={allowedImageExtension} getData={handleFiles} name="image" /></div>
                            </Col>
                            <Col xs={12} md={1} className='mt-3 mt-md-0'>
                                <div>{translate(languageData, "orselectviapixabay")}</div>
                            </Col>
                            <Col xs={12} md={3} className='mt-3 mt-md-0'>
                                <PixabayImageSearch onSelectImage={handlePixabayImageSelect} />
                            </Col>
                        </Row>
                    </Card.Body>

                    <div className='d-flex mb-5 mt-5'>
                        <Button className='btn btn-primary btn-w-md mx-auto' onClick={() => updateResubmitArticleServices()}>{loading ? <img src={globalLoader} width={20} /> : translate(languageData, "submit")} </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default AddArticle