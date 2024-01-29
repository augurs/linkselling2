import React, { useEffect, useState } from 'react';
import { FaWallet, FaPlus } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { updateWallet, walletBalance } from "../../../services/walletServices/walletService"
import { translate } from '../../../utility/helper';
import { useLanguage } from "../../Context/languageContext";
import { useWallet } from "../../Context/walletContext";

const WalletBalance = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [showModal, setShowModal] = useState(false);
    const [newBalance, setNewBalance] = useState('');
    const [taxPercentage, setTaxPercentage] = useState(23);
    const [taxAmount, setTaxAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const { languageData } = useLanguage();
    const { showWalletBalance, balance } = useWallet();

    useEffect(() => {
        showWalletBalance();
    }, []);

    const calculateTaxAndTotalAmount = (amount) => {
        const tax = (amount * taxPercentage) / 100;
        const total = parseFloat(amount) + parseFloat(tax);

        setTaxAmount(tax);
        setTotalAmount(total);
    };

    const handleAddBalance = async () => {
        try {
            const response = await updateWallet({ id: userData.id, amount: newBalance });
            if (response.success) {
                if (response.redirect_url_all) {
                    window.location.href = response.redirect_url_all;
                } else {
                    setShowModal(false);
                }
            } else {
                console.error('API call failed:', response);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <div onClick={() => setShowModal(true)}>
                <FaWallet style={{ fontSize: "20px", marginRight: "6px" }} />
                {balance} PLN{' '}
                <FaPlus
                    style={{ cursor: "pointer" }}
                />
            </div>
            {/* Add Balance Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{translate(languageData, "addBalance")}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex flex-column gap-3'>
                    <Form.Group as={Row} controlId="balanceAmount">
                        <Col><Form.Label>{translate(languageData, "amount")} : </Form.Label></Col>
                        <Col sm="8">
                            <Form.Control
                                type="text"
                                placeholder={translate(languageData, "enterAmount")}
                                value={newBalance}
                                onChange={(e) => {
                                    let input = e.target.value;
                                    input = input.replace(/[^\d.]/g, '');
                                    if (input.includes('.')) {
                                        const parts = input.split('.');
                                        input = `${parts[0]}.${parts[1].slice(0, 2)}`;
                                    }
                                    setNewBalance(input);
                                    calculateTaxAndTotalAmount(input);
                                }}
                            />
                        </Col>
                    </Form.Group>

                    {taxAmount > 0 && (
                        <>
                            <Form.Group as={Row}>
                                <Col><Form.Label>{translate(languageData, "linkTax")} : </Form.Label></Col>
                                <Col sm="8">
                                    <Form.Control type="number" value={taxAmount.toFixed(2)} disabled />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Col><Form.Label>{translate(languageData, "TotalAmount")} : </Form.Label></Col>
                                <Col sm="8">
                                    <Form.Control type="number" value={totalAmount.toFixed(2)} disabled />
                                </Col>
                            </Form.Group>
                        </>
                    )}

                    <div className='d-flex gap-2'>
                        <Button variant="primary" onClick={handleAddBalance}>
                            {translate(languageData, "addBalance")}
                        </Button>
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
