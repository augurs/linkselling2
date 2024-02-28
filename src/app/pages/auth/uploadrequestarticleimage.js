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
import Select from 'react-select'
import { baseURL2 } from '../../../utility/data';
const AddArticle = () => {

    const initialValues = {
        image: "",
        userStatus: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [loading, setLoading] = useState(false)
    const [displayedImage, setDisplayedImage] = useState(null);
    const [showDropdown, setShowDropdown] = useState(true);

    const { languageData } = useLanguage();
    const { id } = useParams();
    const allowedImageExtension = ['.jpg', '.gif', '.png']
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

    const handleSelectChange = (selectedOption) => {
        setFormValues({ ...formValues, userStatus: selectedOption?.value })
    }

    useEffect(() => {
        resubmitImg()
    }, [])
    const resubmitImg = async () => {
        const res = await uploadimagereqarticle(userData2?.id, id)
        if (res.success === true) {
            const dynamicImageUrl = `${baseURL2}/LinkSellingSystem/public/articles/${res.data[0].image}`;
            setFormValues({
                ...formValues,
                id: res.data[0].id,
                title: res.data[0].article_title,
                link: res.data[0].max_links,
                url: res.data[0].url,
                image: dynamicImageUrl,
                comment: res.data[0].comments,
                content: res.data[0].content,
                date: formatDate(res.data[0].created_at),
                lead: res.data[0].short_description,

            });
            setShowDropdown(res.data[0].status === 'Published');
        } else {
            setShowDropdown(false);
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



    const updateResubmitArticleServices = async () => {
        setLoading(true)
        const res = await updaterimagrequestedarticle(formValues, formValues?.id)
        if (res.success === true) {
            toast(translate(languageData, "responseUpdateSuccessfully"), {
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
    }

    console.log(formValues, "132");

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
                                <span>{translate(languageData, "AddArtiLead")}</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0">
                                    {formValues?.lead}
                                </div>
                            </Col>
                        </Row>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4} className='mt-2'>
                                <span>{translate(languageData, "sidebarContent")}</span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3">
                                <div dangerouslySetInnerHTML={{ __html: formValues?.content }} />
                            </Col>
                        </Row>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "CommentsAndRecommendations")} </span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    {formValues?.comment || "--"}
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
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "maxLinks")} </span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    {formValues?.link}
                                </div>

                            </Col>
                        </Row>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "writingUrl")} </span>
                            </Col>
                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                <a href={formValues?.url} className="wrap-input100 validate-input mb-0">
                                    {formValues?.url}
                                </a>

                            </Col>
                        </Row>
                        {!showDropdown && (
                        <>
                        <h2 className='mt-5'>{translate(languageData, "UpdateImage")} *</h2>
                        <Row className='align-items-center mt-5'>
                            <Col xs={12} md={4}>
                                <span>{translate(languageData, "image")}</span>
                            </Col>
                            <Col xs={12} md={1} className='mt-3 mt-md-0'>
                                {displayedImage ? <div> <img src={displayedImage} alt='Displayed' /></div> : <div className="border border-primary text-center">Image Preview</div>}
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
                        </>)}
                        {showDropdown && (
                            <Row className='align-items-center mt-5'>
                                <Col xs={12} md={4}>
                                    <span>{translate(languageData, "Status")}</span>
                                </Col>
                                <Col xs={12} md={8} className='mt-3 mt-md-0'>
                                    <Select options={languagesOpts} placeholder={translate(languageData, "Select")} styles={{ control: (provided) => ({ ...provided, borderColor: '#ecf0fa', height: '45px', }) }} onChange={handleSelectChange} value={formValues?.value}/>
                                </Col>

                            </Row>)}
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