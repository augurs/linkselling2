import React from 'react'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../Context/languageContext'
import { translate } from '../../../utility/helper'
import polandFlag from "../../../assets/images/flags/pl.svg"
import englishFlag from "../../../assets/images/flags/us.svg"
import globalLoader from '../../../assets/images/loader.svg'
import { Col, Row } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import { addToCart, getMarketPlaceList } from '../../../services/invoicesServices/invoicesServices'
import { useEffect } from 'react'
import { useState } from 'react'
import { ColorRing } from 'react-loader-spinner'
import { useCart } from '../../Context/cartListContext'

const MarketPlace = () => {

    const { languageData } = useLanguage();
    const { cartListServices } = useCart()

    const userData = JSON.parse(localStorage.getItem('userData'));

    const [marketPlaceList, setMarketPlaceList] = useState([])
    const [loading, setLoading] = useState({ listLoading: false, addToCartLoading: false })
    const [clickedButton, setClickedButton] = useState('')


    useEffect(() => {
        getMarketPlaceListServices()
    }, [])

    const navigate = useNavigate()


    const addToCartServices = async (id) => {
        setLoading({ ...loading, addToCartLoading: true })
        setClickedButton(id)
        const res = await addToCart(userData.id, id , "1")
        if (res.success === true) {
            toast(res.result, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,

                type: 'success'
            });
            getMarketPlaceListServices()
            cartListServices()
            setLoading({ ...loading, addToCartLoading: false })
        } else {
            toast(res.result, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
            getMarketPlaceListServices()
            cartListServices()
            setLoading({ ...loading, addToCartLoading: false })

        }

    }




    const getMarketPlaceListServices = async () => {
        setLoading({ ...loading, listLoading: true })
        const res = await getMarketPlaceList(userData?.id)
        if (res.success === true) {
            setMarketPlaceList(res?.marketPlaces?.data)
            setLoading({ ...loading, listLoading: false })
        } else {
            setLoading({ ...loading, listLoading: false })
        }
    }


    const columns = [
        {
            name: translate(languageData, "marketPlaceId"),
            selector: row => row.id,
            sortable: true,
            center: true,
            width: '130px'
        },
        {
            name: translate(languageData, "domainName"),
            selector: row => row.name,
            sortable: true,
            center: true,
            //  width: '180px'
        },
        {
            name: translate(languageData, "language"),
            selector: row => row.language,
            cell: (row) => (
                <img src={row.language === 'PL' ? polandFlag : englishFlag} width={20} />
            ),
            sortable: true,
            center: true,
            //  width: '180px'
        },
        {
            name: translate(languageData, "CostGraphic Link"),
            selector: row => row.costGraphicLink,
            sortable: true,
            center: true,
            //  width: '180px'
        },
        {
            name: translate(languageData, "CostTestLink"),
            selector: row => row.costTestLink,
            sortable: true,
            center: true,
            //  width: '180px'
        },
        {
            name: translate(languageData, "Action"),
            cell: row => <div>{row.action !== "sold" ?
                <button className='btn btn-primary' onClick={() => addToCartServices(row?.id)}> {loading.addToCartLoading && clickedButton === row?.id ? <ColorRing
                    visible={true}
                    height="30"
                    width="30"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
                /> : translate(languageData , "addToCart")}</button> : <button className='btn btn-primary' onClick={() => navigate('/cart')}>{translate(languageData , "addToCart")}</button>}</div>,
            center: true,
            //  width: '180px'
        },
    ]

    const tableData = marketPlaceList?.map?.((item) => {
        return {
            id: item?.id,
            name: item?.name,
            language: item?.language,
            costGraphicLink: item?.graph_cost,
            costTestLink: item?.txt_cost,
            action: item.status
        }
    })



    return (
        <>
            <ToastContainer />
            <div className='p-4'>
            <h4 className='mt-1 mb-3'>{translate(languageData , "marketPlace")}</h4>
                {/* <Row>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="project" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country">
                                <option label='Language'></option>
                                <option value="pl">Polish</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                    </Col>
                    <Col xs={12} sm={6} md={4} className='mb-3'>
                        <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                            <input className="input100" type="text" name="search" placeholder='Price/Domain Name' />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="zmdi zmdi-search" aria-hidden="true"></i>
                            </span>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="status" style={{ height: "45px" }} className=" form-select" id="default-dropdown" data-bs-placeholder="Select Status" >
                                <option label='Project Link' ></option>
                                <option>Project 1</option>
                                <option>Project 2</option>
                            </select>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="status" style={{ height: "45px" }} className=" form-select" id="default-dropdown" data-bs-placeholder="Select Status" >
                                <option label='Type of Link' ></option>
                                <option>Link 1</option>
                                <option>Link 2</option>
                            </select>
                        </div>
                    </Col>
                </Row> */}
                <div className='w-100'>
                    {loading.listLoading ?
                        <div className='d-flex'>
                            <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
                        </div>
                        :
                        <DataTable
                            columns={columns}
                            data={tableData}
                        />
                    }
                </div>

            </div>
        </>
    )
}

export default MarketPlace