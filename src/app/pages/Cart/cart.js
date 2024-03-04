import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import polandFlag from "../../../assets/images/flags/pl.svg"
import englishFlag from "../../../assets/images/flags/us.svg"
import { translate } from '../../../utility/helper'
import { useLanguage } from '../../Context/languageContext'
import { MdDelete, MdCancel } from 'react-icons/md';
import { buyNow, deleteCart, getCart } from '../../../services/invoicesServices/invoicesServices'
import globalLoader from '../../../assets/images/loader.svg'
import { useEffect } from 'react'
import { ColorRing } from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify'
import { Button, Modal } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../../Context/cartListContext'
import { walletBalance } from "../../../services/walletServices/walletService"
const Cart = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const hasError = queryParams.get('error') === 'true';

    const { languageData, language } = useLanguage()

    const [cartProducts, setCartProducts] = useState([])
    const [loading, setLoading] = useState({ listLoading: false, deleteLoading: false, buyNowLoading: false })
    const [deleteId, setDeleteId] = useState('')
    const [showCartModal, setshowCartModal] = useState(false)
    const [buyNowId, setBuyNowId] = useState('')
    const [purchasedData, setPurchasedData] = useState([])
    const [rowId, setRowId] = useState('')
    const [balance, setBalance] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(hasError);
    const [proceedCheck, setProceedCheck] = useState(true)

    const userData = JSON.parse(localStorage.getItem('userData'))
    const { cartListServices } = useCart()

    useEffect(() => {
        if (hasError) {
            setShowErrorModal(hasError);
        }
    }, [hasError]);

    useEffect(() => {
        showWalletServices()
    }, [])


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

    useEffect(() => {
        getCartServices()
    }, [])

    const navigate = useNavigate();


    const getCartServices = async () => {
        setLoading({ ...loading, listLoading: true })
        const res = await getCart(userData?.id)
        if (res.success === true) {
            setLoading({ ...loading, listLoading: false })
            setCartProducts(res)
        }
    }

    const deleteCartServices = async (id) => {
        setLoading({ ...loading, deleteLoading: true })
        setDeleteId(id)
        const res = await deleteCart(userData?.id, id)
        if (res.success === true) {
            toast(translate(languageData, "deletedCartSuccessfully"), {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            setLoading({ ...loading, deleteLoading: false })
            getCartServices()
            cartListServices()
        } else {
            toast(res.message, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
            setLoading({ ...loading, deleteLoading: false })
            getCartServices()
            cartListServices()
        }
    }

    const buyNowServices = async (domainId, serviceType, articleType, id) => {
        setBuyNowId(domainId)
        setRowId(id)
        setLoading({ ...loading, buyNowLoading: true })
        const res = await buyNow(userData?.id, domainId, serviceType, articleType)
        if (res.success === true) {
            setshowCartModal(true)
            setLoading({ ...loading, buyNowLoading: false })
            setPurchasedData(res)
            getCartServices()
            cartListServices()
            setRowId()
        } else {
            setshowCartModal(true)
            setLoading({ ...loading, buyNowLoading: false })
            getCartServices()
            cartListServices()
            setRowId()

        }
    }

    const columns = [
        {
            name: translate(languageData, "marketPlaceId"),
            selector: row => row.id,
            sortable: true,
            center: true,
            // width: '130px'
        },
        {
            name: translate(languageData, "domainName"),
            cell: (row) => (
                <div>
                    <div>
                        <div>{row?.name}</div>
                        <div className='text-muted'>
                            <small>
                                {row?.articleType === 'ArticleWriting'
                                    ? translate(languageData, 'articleWriting')
                                    : row?.articleType === 'RequestArticle'
                                        ? translate(languageData, 'publicationOfArticle')
                                        : row?.articleType === 'SelectLater'
                                            ? translate(languageData, 'selectLater')
                                            : row?.articleType === 'AddAnArticle'
                                                ? translate(languageData, 'AddNewArticle')
                                                : row?.articleType === 'UseArticle'
                                                    ? translate(languageData, 'UseArticle') : ''}
                            </small>
                        </div>
                    </div>
                </div>
            ),
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: translate(languageData, "writingLanguage"),
            selector: row => row.language,
            cell: (row) => (
                <span>
                    <img src={row.language === 'pl' ? polandFlag : englishFlag} width={20} alt='flag' />
                </span>
            ),
            sortable: true,
            center: true,
            //  width: '180px'
        },
        {
            name: "Dr",
            selector: row => row?.dr,
            sortable: true,

            cell: (row) => (
                <span className='text-center'>{row?.dr}</span>
            ),

            center: true,
            //  width: '150px'
        },
        {
            name: translate(languageData, "Ahrefs"),
            selector: row => row.ahref,
            sortable: true,
            center: true,
            //  width: '180px'
        },
        // {
        //     name: translate(languageData, 'CostGraphic Link'),
        //     selector: (row) => row.graphicLink,
        //     center: true,
        //     cell: (row) => (
        //         <div>
        //             <div>{row.graphicLink}</div>
        //         </div>
        //     ),
        // },
        {
            name: translate(languageData, 'ProjectName'),
            selector: (row) => row?.project_name ? row?.project_name : "--",
            center: true,
            width: "10VW"
        },
        {
            name: <div>
                <div>{translate(languageData, "BestPrice")}</div>
            </div>,
            selector: (row) => row.price,
            center: true,
            cell: (row) => (
                <div>
                    <div>{row.price}</div>
                </div>
            ),
        },
        // {
        //     name: translate(languageData, "Action"),
        //     cell: row => <button className='btn btn-primary d-flex justify-content-center' onClick={() => buyNowServices(row?.domainId, row?.serviceType, row?.articleType, row?.rowId)}> {loading.buyNowLoading && rowId === row?.rowId ? <ColorRing
        //         visible={true}
        //         height="30"
        //         width="30"
        //         ariaLabel="blocks-loading"
        //         wrapperStyle={{}}
        //         wrapperClass="blocks-wrapper"
        //         colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
        //     /> : translate(languageData, 'buyNow')} </button>,
        //     center: true,
        //     //  width: '180px'
        // },
        {
            name: translate(languageData, "cartRemove"),
            cell: row => <div style={{ cursor: "pointer" }}> {loading.deleteLoading && deleteId === row?.id ? <ColorRing
                visible={true}
                height="30"
                width="30"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={['#82c035', '#82c035', '#82c035', '#82c035', '#82c035']}
            /> : <MdDelete size={20} onClick={() => deleteCartServices(row?.cartId)} />}</div>,
            center: true,
            //  width: '180px'
        },
    ]


    const tableData = cartProducts?.product?.map((item) => {
        return {
            id: item?.service_type === '1' ? item?.links?.id : item?.articles?.id,
            name: item?.service_type === '1' ? item?.links?.name : item?.articles?.url,
            articleType: item?.article_type,
            language: item?.articles?.language,
            dr: item?.service_type === '1' ? 'N/A' : item?.articles?.dr,
            ahref: item?.service_type === '1' ? 'N/A' : item?.articles?.ahref_traffic,
            domainId: item?.domain_id,
            serviceType: item?.service_type,
            cartId: item?.id,
            testLink: item?.service_type === '1' ? item?.links?.txt_cost : "N/A",
            graphicLink: item?.service_type === '1' ? item?.links?.graph_cost : "N/A",
            price: item?.service_type === '1' ? "N/A" : item?.amount,
            rowId: item?.id,
            project_name: item?.project_name
        }
    })



    const handleClose = () => {
        setshowCartModal(false)
    }








    return (
        <>
            <ToastContainer />
            <div className='p-4'>
                <h4 className='mt-2 mb-2'>{translate(languageData, "cartDetail")}</h4>
                <div>
                    {loading.listLoading ?
                        <div className='d-flex'>
                            <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
                        </div> :
                        <DataTable
                            columns={columns}
                            data={tableData}
                        />}
                </div>
                {cartProducts?.product?.length > 0 &&
                    <div className='d-flex justify-content-between flex-wrap mt-6 mx-2'>
                        <div>
                            <span className='fs-4 me-2'>{translate(languageData, "linkTotalAmount")} :</span>
                            <span className='fs-3'>{cartProducts?.total} zł</span>
                        </div>
                        <div>
                            <Button variant='primary' onClick={() => buyNowServices("", cartProducts?.product[0]?.service_type, "")}>


                                {loading.buyNowLoading && buyNowId === "" ?

                                    <ColorRing
                                        visible={true}
                                        height="30"
                                        width="30"
                                        ariaLabel="blocks-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="blocks-wrapper"
                                        colors={['#82c035', '#82c035', '#82c035', '#82c035', '#82c035']}
                                    /> : translate(languageData, 'buyNow')

                                }

                            </Button>
                        </div>
                    </div>}

                <Modal show={showCartModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{translate(languageData, "linkDetails")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className='mb-1'>
                            <strong>{translate(languageData, "linkName")} : </strong>
                            <span className="text-break">
                                {purchasedData?.allProduct?.map((item, index) => (
                                    <span key={index}>
                                        {item?.links ? item?.links?.name : item?.articles?.url}
                                        {index < purchasedData.allProduct.length - 1 && ', '}
                                    </span>
                                ))}
                            </span>
                        </p>
                        <p className='mb-1'><strong>{translate(languageData, "linkTotalAmount")} : </strong> <span className=''>{purchasedData?.total} PLN</span></p>
                        <p className='mb-1'><strong>{translate(languageData, "Walletamount")} : </strong> {balance} PLN</p>
                        {!(parseFloat(purchasedData?.total) <= parseFloat(balance)) ?
                            <>
                                <p className='mb-1'><strong>{translate(languageData, "amountWith")} <span className='text-primary mx-1'>23%</span>  {translate(languageData, "linkTax")} : </strong> {purchasedData?.payable_amount}</p>
                                <p className='mb-1'><strong>{translate(languageData, "netPayableAmount")} :</strong> {purchasedData?.payable_amount}</p>
                            </>
                            : ""}


                        {language == 'pl' &&
                            <>
                                <hr></hr>

                                <div>
                                    <label className="custom-control custom-checkbox mt-4">
                                        <input type="checkbox" className="custom-control-input" name='proceed' onChange={(e) => setProceedCheck(e.target.checked)} checked={proceedCheck} />
                                        <span className="custom-control-label mt-2 fw-bold">Chcę, by usługi zostały zrealizowane przed upływem terminu odstąpienia od umowy</span>
                                    </label>
                                    <p>
                                        Oświadczenie dotyczy wyłącznie konsumentów lub podmiotów,
                                        którym przysługują analogiczne uprawnienia.
                                        Zaznaczenie tego pola jest niezbędne,
                                        by Wydawca przystąpił do realizacji usługi
                                        przed upływem 14 dni od dnia zamówienia
                                        (tj. przed upływem okresu na odstąpienie od umowy).
                                        W związku z tym, na Twoje żądanie Wydawca zrealizuje usługę przed upływem ww. terminu, tj.
                                        przed upływem 14 dni na odstąpienie. Jeżeli zamówisz realizację usługi,
                                        a Wydawca te żądanie wykona w pełni, tracisz prawo do odstąpienia od umowy.
                                    </p>
                                </div>
                            </>
                        }

                    </Modal.Body>
                    <Modal.Footer>
                        {language === 'pl' &&
                            <a href={purchasedData?.redirect_url_all} className={`btn btn-primary ${!proceedCheck && "disabled"}`}>{translate(languageData, 'buyNow')}</a>
                        }

                        {(language !== 'pl') &&
                            <a href={purchasedData?.redirect_url_all} className='btn btn-primary'>{translate(languageData, 'buyNow')}</a>

                        }
                        <Button variant="outline-primary" onClick={handleClose}>
                            {translate(languageData, "close")}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showErrorModal} onHide={() => { setShowErrorModal(false) }} className='d-flex justify-content-center align-items-center'>
                    <Modal.Body>
                        <div className='p-5'>
                            <span className='d-flex justify-content-center'>
                                <MdCancel size={72} className='text-danger' />
                            </span>
                            <h2 className='text-center mt-4 text-danger'>{translate(languageData, "OOPS!")}</h2>

                            <h3 className='text-center mt-4 text-danger'>
                                {translate(languageData, "yourPaymentIsNotDone")}
                            </h3>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => { setShowErrorModal(false) }}>
                            {translate(languageData, "close")}
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </>
    )
}

export default Cart