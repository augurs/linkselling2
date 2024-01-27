import React, { useEffect, useState } from 'react';
import { FaUserFriends, FaCopy, FaShare, FaTimes } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { showReferralLink } from "../../../services/walletServices/walletService"
import { translate } from '../../../utility/helper';
import { useLanguage } from "../../Context/languageContext";
import { baseURL2 } from "../../../utility/data";
import { toast } from 'react-toastify';
import { RWebShare } from 'react-web-share';
const WalletBalance = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [referralLink, setReferralLink] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        showReferralLinkServices();
    }, []);


    const { languageData } = useLanguage();

    const showReferralLinkServices = async () => {
        setLoading(true);
        try {
            const res = await showReferralLink(userData?.id);
            if (res.success === true) {
                setReferralLink(res?.code);
                setLoading(false);
            } else {
                console.error('API call failed:', res);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const copyReferralLink = () => {
        const referralLink1 = `${baseURL2}/signUp?ref=${referralLink}`;
        navigator.clipboard.writeText(referralLink1)
            .then(() => toast.success(translate(languageData, "Contentcopiedtoclipboard"), { position: toast.POSITION.TOP_CENTER, autoClose: 1500 }))
            .catch(error => console.error('Error copying to clipboard:', error));
    };
    return (
        <div>
            <div onClick={() => setShowModal(true)}>
                <FaUserFriends className='m-1' />
                Refer friends
            </div>
            {/* Add Balance Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header className='d-flex align-items-center justify-content-between'>
                    <Modal.Title >
                        <div>
                            {translate(languageData, "Refer friends & get reward")}
                        </div>
                    </Modal.Title>
                    <FaTimes fontSize={20} onClick={handleCloseModal} />

                </Modal.Header>
                <Modal.Body className='d-flex flex-column gap-3'>
                    <Form.Group as={Row} controlId="balanceAmount">
                        <Col><Form.Label>{translate(languageData, "Referal Link")} : </Form.Label></Col>
                        <Col sm="8">
                            <span style={{ cursor: 'pointer' }} onClick={copyReferralLink}>{`${baseURL2}/signUp?ref=${referralLink}`} <FaCopy /></span>
                        </Col>
                    </Form.Group>

                    <div className='d-flex justify-content-end gap-1'>
                        <RWebShare
                            data={{
                                url: `${baseURL2}/signUp?ref=${referralLink}`,
                                text: 'Check out this referral link!'
                            }}
                        >
                            <Button variant="primary btn-outline-primary">
                                <FaShare /> Share
                            </Button>
                        </RWebShare>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            {translate(languageData, "close")}
                        </Button>
                    </div>
                </Modal.Body>

            </Modal>
        </div>
    );
}

export default WalletBalance;
