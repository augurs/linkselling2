import React, { useEffect, useState } from 'react';
import { FaWallet, FaPlus } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { updateWallet, walletBalance } from "../../../services/walletServices/walletService"
import { translate } from '../../../utility/helper';
import { useLanguage } from "../../Context/languageContext";

const WalletBalance = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [balance, setBalance] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newBalance, setNewBalance] = useState('');
    const [taxPercentage, setTaxPercentage] = useState(23); // Change this to your tax percentage
    const [taxAmount, setTaxAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        showWalletServices();
    }, []);

    const { languageData } = useLanguage();

    const showWalletServices = async () => {
        setLoading(true);
        try {
            const res = await walletBalance(userData?.id);
            if (res.success === true) {
                setBalance(res.data.wallet_amount);
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
                <Modal.Body className='d-flex flex-column align-items-center gap-4'>
                    <Form.Group controlId="balanceAmount" className='d-flex justify-content-between'>
                        <Form.Label>{translate(languageData, "amount")}   : </Form.Label>
                        <Form.Control
                            type="number"
                            className='w-75'
                            placeholder={translate(languageData, "enterAmount")}
                            value={newBalance}
                            onChange={(e) => {
                                setNewBalance(e.target.value);
                                calculateTaxAndTotalAmount(e.target.value);
                            }}
                        />
                    </Form.Group>
                    {taxAmount > 0 && (
                        <>
                            <div className="d-flex justify-content-between text-nowrap gap-2">
                                <label className="form-label">{translate(languageData, "linkTax")}   : </label>
                                <input placeholder="Wprowadź ilość" type="number" className="w-75 form-control" value={taxAmount.toFixed(2)} disabled/>
                            </div>
                            <div className="d-flex text-nowrap align-items-center gap-2">
                                <label className='mt-2'>{translate(languageData, "TotalAmount")} : </label>
                                <input type="number" className="w-75 form-control" value={totalAmount.toFixed(2)} disabled />
                            </div>
                        </>
                    )}
                    <div className='d-flex gap-2'>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            {translate(languageData, "close")}
                        </Button>
                        <Button variant="primary" onClick={handleAddBalance}>
                            {translate(languageData, "addBalance")}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default WalletBalance;
