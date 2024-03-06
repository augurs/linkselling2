import React, { useEffect, useState } from 'react';
import { FaHandHoldingUsd, FaTimes } from 'react-icons/fa';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { redeemCode } from "../../../services/walletServices/walletService";
import { translate } from '../../../utility/helper';
import { useLanguage } from "../../Context/languageContext";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { BsPatchCheckFill } from "react-icons/bs";
const Referral = () => {
    const initialValues = {
        redeemCode: ""
    };
    const [formValues, setFormValues] = useState(initialValues);
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [res, setRes] = useState(null);
    const { languageData } = useLanguage();


    useEffect(() => {
        if (res?.success === false && res.message === "Wrong code") {
            toast(translate(languageData, "wrongCode"), {
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
    }, [res, languageData]);

    const handleCloseModal = () => {
        setShowRedeemModal(false);
        setFormValues(initialValues);
        setRes(null);
    };

    const redeemCodeServices = async () => {
        setLoading(true);
        if (!formValues.redeemCode) {
            toast(translate(languageData, "pleaseEnterRedeemCode"), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
            setLoading(false);
            return;
        }
        const response = await redeemCode(formValues, userData?.id);
        setRes(response);
        setLoading(false);
        if (response.success === true && response.message == '') {
            toast(translate(languageData, "redeemSuccessfully"), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            
        }
        if (response.success === true && response.message == "This is already active") {
            toast(translate(languageData, "thisCodeAlreadyUsed"), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'info'
            });
            
        }

    };

    const handleInputChange = (e) => {
        setRes(null);
        setFormValues({ ...formValues, redeemCode: e.target.value });
    };

    return (
        <div>
            <div onClick={() => setShowRedeemModal(true)}>
                <Link to='#' className="side-menu__item has-link" data-bs-toggle="slide">
                    <span className="side-menu__icon"><FaHandHoldingUsd size={20} style={{ color: "gray!important" }} /></span>
                    <span className="side-menu__label">{translate(languageData, "redeemCode")}</span>
                </Link>
            </div>
            <Modal show={showRedeemModal} onHide={handleCloseModal} centered>
                <Modal.Header className='d-flex align-items-center justify-content-between'>
                    <Modal.Title>
                        <div>
                            {translate(languageData, "redeemCode")}
                        </div>
                    </Modal.Title>
                    <FaTimes style={{ cursor: 'pointer' }} fontSize={20} onClick={handleCloseModal} />
                </Modal.Header>
                <Modal.Body className='d-flex flex-column gap-3'>
                    <Form.Group as={Row} controlId="enterCode">
                        <Col><Form.Label>{translate(languageData, "enterCode")}: </Form.Label></Col>
                        <Col sm="8">
                            <Form.Control placeholder="Enter code" type="text" name="redeemCode" value={formValues.redeemCode} onChange={handleInputChange} />
                            {res?.success === false && res.message === "Wrong code" && (
                                <span className='text-danger mt-2'>{translate(languageData, "wrongCode")}</span>
                            )}
                            {res?.success === true && (
                                <span className='text-primary mt-2'><BsPatchCheckFill className="text-primary" fontSize={16} /> {res?.data} </span>
                            )}
                        </Col>
                    </Form.Group>
                    <div className='d-flex justify-content-end gap-1 border-top'>
                        <Button onClick={redeemCodeServices} className='mt-2'>
                            {loading ? 'Loading...' : translate(languageData, "redeem")}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Referral;
