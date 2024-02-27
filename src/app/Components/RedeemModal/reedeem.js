import React, { useEffect, useState } from 'react';
import { FaCopy, FaHandHoldingUsd, FaTimes } from 'react-icons/fa';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { redeemCode } from "../../../services/walletServices/walletService"
import { translate } from '../../../utility/helper';
import { useLanguage } from "../../Context/languageContext";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
const Referral = () => {
    const initialValues = {
        redeemCode: ""
    };
    const [formValues, setFormValues] = useState(initialValues);
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [wrongRes, setWrongRes] = useState('');




    const { languageData } = useLanguage();


    const handleCloseModal = () => {
        setShowRedeemModal(false);
    };



    const redeemCodeServices = async () => {
        setLoading(true)
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
            setLoading(false)
            return;
        }
        const res = await redeemCode(formValues)
        if (res.success === true) {
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
            setFormValues(initialValues);
            setLoading(false)
        } else if (res.success === false && res.message == "Wrong code") {
            setWrongRes(res.message)
            setLoading(false)
        } else {
            toast(translate(languageData, "loginFailureMessage2"), {
                position: "top-center",
                autoClose: 2000,
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



    return (
        <div>
            <div onClick={() => setShowRedeemModal(true)}>
                <Link to='#' className="side-menu__item has-link" data-bs-toggle="slide">
                    <span className="side-menu__icon"><FaHandHoldingUsd size={20} style={{ color: "gray!important" }} /></span>
                    <span className="side-menu__label">{translate(languageData, "redeemCode")}</span>
                </Link>
            </div>
            <Modal show={showRedeemModal} onHide={() => setShowRedeemModal(false)}>
                <Modal.Header className='d-flex align-items-center justify-content-between'>
                    <Modal.Title >
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
                            <Form.Control placeholder="Enter code" type="text" name="redeemCode" onChange={(e) => setFormValues({ ...formValues, redeemCode: e.target.value })} />
                            {/* {formValues.redeemCode ?
                                <span className='text-primary'>You have successfully Redeem Code</span>
                                :
                                <span className='text-danger'>Wrong Code! Please enter valid Code</span>} */}
                        </Col>

                    </Form.Group>
                    <div className='d-flex justify-content-end gap-1'>
                        <Button onClick={redeemCodeServices} disabled={!formValues.redeemCode}>
                            {translate(languageData, "Redeem")}
                        </Button>
                    </div>
                </Modal.Body>

            </Modal>
        </div>
    );
}

export default Referral;
