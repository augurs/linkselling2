import React, { useEffect, useState } from 'react';
import { FaCopy, FaShare, FaTimes } from 'react-icons/fa';
import { BsPeople } from 'react-icons/bs';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { referralList, showReferralLink, withdrawalReferral } from "../../../services/walletServices/walletService"
import { translate } from '../../../utility/helper';
import { useLanguage } from "../../Context/languageContext";
import { baseURL2 } from "../../../utility/data";
import { toast } from 'react-toastify';
import { RWebShare } from 'react-web-share';
import { Link } from 'react-router-dom';
import globalLoader from '../../../assets/images/loader.svg'
import DataTable from 'react-data-table-component'
import moment from 'moment';
import FileUpload from '../FileUpload/FileUpload';
import { useWallet } from '../../Context/walletContext';
const Referral = ({handleLinkPath, toggleSidebar2}) => {
    const initialValues = {
        amount: "",
        ReferralPdf: "",
    };
    const [formValues, setFormValues] = useState(initialValues);
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [referralLink, setReferralLink] = useState('');
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDataPresent, setIsDataPresent] = useState(true);
    const [referralListData, setReferralListData] = useState([])
    const [showWithdrawalFields, setShowWithdrawalFields] = useState(false);
    const { showWalletBalance, balance } = useWallet();
    const accessToken = localStorage.getItem("accessToken")
    useEffect(() => {
        if (showReferralModal) {
            showReferralLinkServices();
            referralListServices();
        }
    }, [showReferralModal]);


    const { languageData } = useLanguage();

    const showReferralLinkServices = async () => {
        setLoading(true);
        try {
            const res = await showReferralLink(accessToken);
            if (res.success === true) {
                setReferralLink(res);
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
        setShowReferralModal(false);
    };

    const copyReferralLink = () => {
        const referralLink1 = `${baseURL2}/signUp?ref=${referralLink?.code}`;
        navigator.clipboard.writeText(referralLink1)
            .then(() => toast.success(translate(languageData, "Contentcopiedtoclipboard"), { position: toast.POSITION.TOP_CENTER, autoClose: 1500 }))
            .catch(error => console.error('Error copying to clipboard:', error));
    };

    const referralListServices = async () => {
        setLoading(true)
        const res = await referralList(accessToken)
        if (res.success === true) {
            setReferralListData(res?.code)
            setIsDataPresent(res?.code.length > 0);
            setLoading(false)
        } else {
            setIsDataPresent(false);
            setLoading(false);
        }
    }

    const tableData = referralListData?.map((item) => {
        let maskedEmail = '';
        if (item?.user_email.length <= 3) {
            maskedEmail = '*'.repeat(item?.user_email.length) + item?.user_email.substring(item?.user_email.length - 4);
        } else {
            maskedEmail = item?.user_email.substring(0, 3) + '*'.repeat(item?.user_email.length - 3);
        }
        return {
            referredCode: item?.referral_code,
            Email: maskedEmail,
            date: moment(item?.created_at).format("DD/MM/YYYY"),
        }
    })

    const columns = [
        {
            name: translate(languageData, "referredCode"),
            selector: row => `${row.referredCode}`,
            sortable: true,
        },
        {
            name: translate(languageData, "referredEmail"),
            selector: row => `${row.Email}`,
            sortable: true,
        },
        {
            name: translate(languageData, "AddingDate"),
            selector: row => row.date,
            sortable: true,
        },

    ]

    const handleMakeWithdrawal = () => {
        setShowWithdrawalFields(prevState => !prevState);
    };

    const withdrawalReferralAmountServices = async () => {
        setLoading(true)
        if (!formValues.amount) {
            toast(translate(languageData, "PleaseEnterAmount"), {
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
        if (!formValues.ReferralPdf) {
            toast(translate(languageData, "PleaseEnterPdf"), {
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
        const res = await withdrawalReferral(formValues, accessToken)
        if (res.success === true) {
            toast(translate(languageData, "withdrawalSuccessfully"), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            setShowWithdrawalFields(false)
            showReferralLinkServices()
            setFormValues(initialValues);
            showWalletBalance(accessToken)

            setLoading(false)
        } else if (res.success === false && res.message == "Please enter less than amount of your Balance") {
            toast(translate(languageData, "PleaseenterlessthanamountofyourBalance"), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
            setFormValues(initialValues);
            setLoading(false)
        } else if (res.success === false && res.message[0] == "The referral pdf must be a file of type: pdf.") {
            toast(translate(languageData, "pleaseEnterValidPDF"), {
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
        else {
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

    const handleAmountChange = (e) => {
        const { name, value } = e.target;
        if (name === 'amount' && parseFloat(value) == 0) {
            setFormValues({ ...formValues, [name]: 1 });
        } else {
            setFormValues({ ...formValues, [name]: parseFloat(value) });
        }
    };

    return (
        <div>
            <div onClick={() => setShowReferralModal(true)}>
                <Link to='#' className="side-menu__item has-link" data-bs-toggle="slide" onClick={() => toggleSidebar2() }>
                    <span className="side-menu__icon"><BsPeople size={20} style={{ color: "gray!important" }} /></span>
                    <span className="side-menu__label">{translate(languageData, "referFriends")}</span>
                </Link>
            </div>
            <Modal show={showReferralModal} onHide={() => setShowReferralModal(false)}>
                <Modal.Header className='d-flex align-items-center justify-content-between'>
                    <Modal.Title >
                        <div>
                            {translate(languageData, "Referfriends&getreward")}
                        </div>
                    </Modal.Title>
                    <FaTimes style={{ cursor: 'pointer' }} fontSize={20} onClick={handleCloseModal} />

                </Modal.Header>
                <Modal.Body className='d-flex flex-column gap-3'>
                    <Form.Group as={Row} controlId="balanceAmount">
                        <Col><Form.Label>{translate(languageData, "referalLink")} : </Form.Label></Col>
                        <Col sm="8">
                            <span className="text-break" style={{ cursor: 'pointer' }} onClick={copyReferralLink}>{`${baseURL2}/signUp?ref=${referralLink.code}`} <FaCopy /></span>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="balanceAmount" className='d-flex align-items-center'>
                        <Col>{translate(languageData, "referralAmount")} : </Col>
                        <Col sm="8" className='d-flex align-items-center gap-2'>
                            <span>{referralLink?.referralBalance != null ? referralLink?.referralBalance : 0} zł</span>
                            <span className='btn btn-outline-info' onClick={handleMakeWithdrawal}>
                                {translate(languageData, "makeWithdrawal")}
                            </span>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="balanceAmount">
                        <Col>{translate(languageData, "accountBalance")} : </Col>
                        <Col sm="8">
                            <span style={{ cursor: 'pointer' }} >{balance ? balance : 0} zł</span>
                        </Col>
                    </Form.Group>
                    {showWithdrawalFields && (
                        <>
                            <Form.Group as={Row} controlId="withdrawalAmount">
                                <Col><Form.Label>{translate(languageData, "enterAmount")} * : </Form.Label></Col>
                                <Col sm="8">
                                    {/* <Form.Control type="number" name="amount" min="1" max="5" onChange={(e) => setFormValues({ ...formValues, amount: e.target.value })} /> */}
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        value={formValues?.amount}
                                        onChange={(e) => {
                                            handleAmountChange(e)
                                        }}
                                    />
                                    {parseFloat(formValues?.amount) >= referralLink?.referralBalance ? <span className='text-danger'>{translate(languageData, "PleaseenterlessthanamountofyourBalance")}</span> : ""}
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="uploadPdf">
                                <Col><Form.Label>{translate(languageData, "uploadPDF")} * : </Form.Label></Col>
                                <Col sm="8">
                                    <FileUpload allowedFileExtensions={['.pdf']} getData={(selectedFile) => setFormValues({ ...formValues, ReferralPdf: selectedFile })} name="ReferralPdf" />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col></Col>
                                <Col sm="8" className='d-flex justify-content-end'>
                                    <Button disabled={parseFloat(formValues?.amount) >= referralLink?.referralBalance} variant="primary btn-primary" onClick={withdrawalReferralAmountServices}>
                                        {translate(languageData, "withdrawalAmount")}
                                    </Button>
                                </Col>
                            </Form.Group>

                        </>
                    )}
                    <div className='w-100 border-top'>
                        {loading ? (<div className='d-flex'>
                            <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
                        </div>) : isDataPresent ? (
                            <>
                                <DataTable
                                    columns={columns}
                                    data={tableData}
                                />
                            </>) : (
                            <Col lg={12} className="text-center mt-5">
                                <div className="input100">
                                    <p className='m-3'>{translate(languageData, "thereAreNoRecordsToDisplay")}</p>
                                </div>
                            </Col>
                        )}
                    </div>

                    <div className='d-flex justify-content-end gap-1'>
                        <RWebShare
                            data={{
                                url: `${baseURL2}/signUp?ref=${referralLink?.code}`,
                                text: 'Check out this referral link!'
                            }}
                        >
                            <Button variant="primary btn-outline-primary">
                                <FaShare /> {translate(languageData, "share")}
                            </Button>
                        </RWebShare>
                        <span className='btn btn-light' onClick={copyReferralLink}>
                            <FaCopy /> {translate(languageData, "copy")}
                        </span>
                    </div>
                </Modal.Body>

            </Modal>
        </div>
    );
}

export default Referral;
