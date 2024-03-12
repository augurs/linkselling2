import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { userprofileModal } from '../../../services/authServices/authservices';
import { useLanguage } from '../../Context/languageContext';
import { translate } from '../../../utility/helper';
import globalLoader from '../../../assets/images/loader.svg'
import { toast } from 'react-toastify'
const UserProfileModal = ({ isModalOpen, setModalOpen, showWalletServices, userDetails }) => {

    let initialValues = {
        Email: userDetails?.email,
        Phone: userDetails?.phone_number || "",
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const accessToken = localStorage.getItem("accessToken")
    const [formValues, setFormValues] = useState(initialValues);
    const [loading, setLoading] = useState(false)
    const { languageData } = useLanguage()
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        setFormValues({
            Email: userDetails?.email || "",
            Phone: userDetails?.phone_number !== null ? userDetails?.phone_number : "",
        });
    }, [userDetails]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };


    const userprofileModalService = async () => {
        setLoading(true);
        const res = await userprofileModal(userData?.id, formValues.Email, formValues.Phone);
        if (res.success === true) {
            toast(translate(languageData, "dataaddedsuccessfully"), {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            showWalletServices(accessToken);
            setLoading(false);
            setModalOpen(false);
        } else if (res.success === false) {
            toast(translate(languageData, "notadded"), {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
            setLoading(false);
            setModalOpen(false);
        } else {
            toast(translate(languageData, "somethingwentwrong"), {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
            setLoading(false);
            setModalOpen(false);
        }
    };



    return (
        <div>
            {loading ? (
                <div className="d-flex">
                    <img src={globalLoader} className="mx-auto mt-10" alt="loader1" />
                </div>
            ) : (
                <Modal show={isModalOpen} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{translate(languageData, "Edituser")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className='align-items-center'>
                            <Col lg={4} xs={12}>
                                {translate(languageData, "emailSignUp")} :
                            </Col>
                            <Col lg={8} xs={12}>
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="email is required">
                                    <input
                                        className="input100"
                                        type="text"
                                        name="Email"
                                        value={formValues.Email}
                                        placeholder={translate(languageData, "emailSignUp")}
                                        style={{ paddingLeft: "15px" }}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row className='align-items-center mt-2'>
                            <Col lg={4} xs={12}>
                                {translate(languageData, "PhoneNumber")} :
                            </Col>
                            <Col lg={8} xs={12}>
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="number is required">
                                    <input
                                        className="input100"
                                        type="number"
                                        name="Phone"
                                        value={formValues?.Phone !== null ? formValues?.Phone: "--"}
                                        placeholder={translate(languageData, "PhoneNumber")}
                                        style={{ paddingLeft: "15px" }}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </Col>
                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            {translate(languageData, "close")}
                        </Button>
                        <Button variant="primary" onClick={userprofileModalService}>
                            {translate(languageData, "Save")}
                        </Button>
                    </Modal.Footer>
                </Modal>)
}
        </div >
    )
}

export default UserProfileModal