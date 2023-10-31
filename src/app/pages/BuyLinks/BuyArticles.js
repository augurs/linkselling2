import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import polandFlag from "../../../assets/images/flags/pl.svg"
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import usFlag from "../../../assets/images/flags/us.svg"
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { PiProhibitBold } from "react-icons/pi";

import { BsExclamationOctagon } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";
import "./BuyLinks.css";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Modal } from "react-bootstrap";
import { MenuProps, anchorTypes } from "../../../utility/data";
import { numberToNumeralsArray, translate } from "../../../utility/helper";
import { useLanguage } from "../../Context/languageContext";
import { addToCartArticles, articleTypeList, getPublisherArticleDetails, getPublisherArticles, requestArticle } from "../../../services/buyArticleServices/buyArticlesServices";
import { ToastContainer, toast } from "react-toastify";
import globalLoader from '../../../assets/images/loader.svg'
import green from '../../../assets/images/cards/Green.png'
import grey from '../../../assets/images/cards/Grey.png'
import { useEffect } from "react";
import { getArticles } from "../../../services/articleServices/articleServices";
import { getCart } from "../../../services/invoicesServices/invoicesServices";
import { useCart } from "../../Context/cartListContext";
import { Checkbox, FormControl, ListItemText, MenuItem, OutlinedInput, Select } from 'material-ui-core';
import { Pagination, Stack } from "@mui/material";

const BuyArticles = () => {

    const { languageData } = useLanguage();
    // const [rating, setrating] = useState(initialState)
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [showCartOptions, setShowCartOptions] = useState(false);
    const [articleType, setArticleType] = useState(translate(languageData, "SelectOwnArticle"));
    const [articleTypeValue, setarticleTypeValue] = useState('SelectOwnArticle')
    const [traficType, setTraficType] = useState({ price: '0,00 zł', clicks: "0" })
    const [confirmTraffic, setConfirmTraffic] = useState(false)
    const [orderType, setOrderType] = useState('Basic article');
    const [orderPrice, setOrderPrice] = useState('50,00 zł');
    const [orderId, setOrderId] = useState(1);
    // const [specifyDetails, setSpecifyDetails] = useState("Specify Now")
    const [requestArticleTitle, setRequestArticleTitle] = useState("")
    const [selectArticle, setSelectArticle] = useState('')
    const [loading, setLoading] = useState(false)
    const [finalPrice, setFinalPrice] = useState(64400)
    const [monthGuarantee, setMonthGuarantee] = useState(false)
    const [cartLoading, setCartLoading] = useState(false)
    const [articleList, setArticleList] = useState([])
    const [cartList, setCartList] = useState([])
    const [confirmModal, setConfirmModal] = useState(false)
    const [articles, setArticles] = useState([])
    const [listLoading, setListLoading] = useState(false)
    const [typeAnchors, setTypeAnchors] = useState([])
    const [lastPage, setLastPage] = useState()
    const [page, setPage] = useState(1)
    const [publisherArticleDetails, setPublisherArticleDetails] = useState([])
    const [selectedPublisherArticle, setSelectedPublisherArticle] = useState()
    const [selectedSubArticles, setSelectedSubArticles] = useState('')
    const [articlePackages, setArticlePackages] = useState([])


    const navigate = useNavigate()

    const userData = JSON.parse(localStorage.getItem('userData'));

    const [search, setSearch] = useState({ doFollow: 0, promotions: 0, drMin: "", drMax: "", minLinks: "", maxLinks: "", ahrefMin: "", ahrefMax: "" })

    const { cartListServices } = useCart()

    useEffect(() => {
        getPublisherArticlesService()
    }, [search, typeAnchors, page])


    const handleInputChange = (e) => {
        const { name, value } = e.target
        setSearch({ ...search, [name]: value })
    }


    console.log(articlePackages, "82");
    // const increasePage = () => {
    //     if (page <= lastPage) {
    //         return;
    //     }
    //     setPage(page + 1)
    // }

    // const decreasePage = () => {
    //     if (page >= 1) {
    //         return;
    //     }
    //     setPage(page - 1)

    // }

    const handlePageChange = (event, value) => {
        setPage(value)
    }

    const handleCheckChange = (e) => {
        const { name, checked } = e.target
        let newVal = checked ? 1 : 0;
        setSearch({ ...search, [name]: newVal })
    }

    // dofollow, promotion, min_dr, max_dr, min_link, max_link, min_href, max_hre
    // type_of_anchor


    useEffect(() => {
        if (articleType === translate(languageData, "SelectOwnArticle")) {
            setarticleTypeValue('SelectOwnArticle')
        } else if (articleType === translate(languageData, "RequestArticleWriting")) {
            setarticleTypeValue('RequestArticle')
        } else if (articleType === translate(languageData, "AddNewArticle")) {
            setarticleTypeValue('AddAnArticle ')
        } else {
            setarticleTypeValue('SelectLater')
        }
    }, [articleType])

    useEffect(() => {
        getArticleListServices()
    }, [])

    useEffect(() => {
        getCartServices()
    }, [])

    useEffect(() => {
        articleTypeListService()
    }, [])



    useEffect(() => {

        if (articleType === translate(languageData, "RequestArticleWriting")) {
            setFinalPrice(parseInt(orderPrice) + selectedSubArticles?.bestPrice)
        } else {
            setFinalPrice(selectedSubArticles?.bestPrice)
        }
    }, [articleType, orderPrice, traficType, confirmTraffic, selectedSubArticles])


    const handleAnchorsType = (e) => {
        const value = e.target.value
        setTypeAnchors(typeof value === 'string' ? value.split(',') : value)
    }



    const checkAddedToCart = articles?.some((item) => item?.cart === 'Yes')
    console.log(checkAddedToCart, "155");

    const requestArticleService = async () => {
        const data = {
            id: userData?.id,
            title: requestArticleTitle
        }
        setLoading(true)
        const res = await requestArticle(data)
        if (res.success === true && res.message === "Article Requested successfully.") {
            toast(res.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            setLoading(false)
        } else if (res.success === false) {
            setLoading(false)
        } else {
            toast("Something went wrong !", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            })
            setLoading(false)
        }
    }

    const getArticleListServices = async () => {
        setListLoading(true)
        const res = await getArticles(userData?.id)
        setArticleList(res?.data)
        setListLoading(false)
    }

    useEffect(() => {
        setArticleType(translate(languageData, "SelectOwnArticle"))
    }, [showCartOptions])





    const Tool = ({ children, title }) => (
        <OverlayTrigger
            overlay={
                <Tooltip placement="top" id="custom-tooltip">
                    {title}
                </Tooltip>
            }
        >
            {children}
        </OverlayTrigger>
    );


    const handleOrderPriceCard = (type, price, id) => {
        setOrderType(type)
        setOrderPrice(price)
        setOrderId(id)
    }

    const modalColumns = [
        {
            name: (
                <div>
                    <div>{translate(languageData, "PortalType")}</div>
                    <div>{translate(languageData, "Language")}</div>
                </div>
            ),
            selector: (row) => row.protalType,
            cell: (row) => (
                <div className="my-2">
                    <div className="d-flex align-items-center">
                        <div>
                            <Link className="my-1" style={{ fontSize: "18px" }}>
                                {row?.portalLink}
                            </Link>
                            <span>
                                {row?.homepage ?
                                    <Tool title="Homepage">
                                        <span>
                                            <AiOutlineHome
                                                className="text-warning ms-2 me-1"
                                                style={{ fontSize: "18px" }}
                                            />
                                        </span>
                                    </Tool> : <></>}
                                {row.noFollow ?
                                    <Tool title="No Follow">
                                        <span>
                                            <PiProhibitBold
                                                className="text-muted"
                                                style={{ fontSize: "18px" }}
                                            />
                                        </span>
                                    </Tool> : <></>}
                            </span>
                        </div>
                    </div>
                    <div><img src={row.language === "pl" ? polandFlag : usFlag} width={20} /></div>

                </div>
            ),
            width: "250px",
            style: {
                width: "250px",
            },
        },
        {
            name: "Dr",
            selector: (row) => row.dr,
            center: true,
            cell: (row) => (
                <div>
                    <div>{row.dr}</div>
                </div>
            ),

        },
        {
            name: translate(languageData, "Ahrefs"),
            selector: (row) => row.ahrefs,
            center: true,
            cell: (row) => (
                <div className="text-center">
                    <span>{row.ahrefs}</span>
                </div>
            ),
        },
        {
            name: "AI",
            selector: (row) => row.ai,
            center: true,
            cell: (row) => (
                <div>
                    <div>{row.ai}</div>
                </div>
            ),

        },
        {
            name: (
                <div>
                    <div>{translate(languageData, "BestPrice")}</div>
                </div>
            ),
            selector: (row) => row.bestPrice,
            center: true,
        },
        {
            name: (
                <div>
                    <div>{translate(languageData, "writingMaxLinks")}</div>
                </div>
            ),
            selector: (row) => row.maxLinks,
            center: true,
            width: "130px",
        },
        {
            name: (
                <div>
                    <div>{translate(languageData, "typeofAnchors")}</div>
                </div>
            ),
            selector: (row) => row.typeOfAnchors,
            center: true,
            width: "130px",
        },
        {
            name: "Action",
            cell: (row) => (
                <div>
                    {row.cartOption && selectedSubArticles?.id === row?.id ? (
                        <Button
                            variant="outline-primary"
                            onClick={() => setShowCartOptions(false)}
                        >
                            Back
                        </Button>
                    ) : (
                        row.cart === 'Yes' ?
                            <Button
                                variant="primary"
                                onClick={() => { setShowCartOptions(true); setSelectedSubArticles(row) }}
                                disabled
                            >
                                {translate(languageData, "Select")}
                            </Button>
                            :
                            <Button
                                variant="outline-primary"
                                onClick={() => { setShowCartOptions(true); setSelectedSubArticles(row) }}
                            >
                                {translate(languageData, "Select")}
                            </Button>
                    )}
                </div>
            ),
            center: true,
        },
    ];

    const modalTableData = publisherArticleDetails?.map((item, index) => {
        return {
            id: item?.id,
            portalLink: item?.url,
            language: item?.language,
            dr: item?.dr,
            ahrefs: item?.ahrefs ? item?.ahrefs : "N/A",
            ai: item?.ai ? item?.ai : "N/A",
            bestPrice: item?.client_price,
            cartOption: showCartOptions,
            cart: item.cart,
            typeOfAnchors: item?.type_of_anchor,
            maxLinks: item?.max_links,

        }
    })


    const columns = [
        {
            name: (
                <div>
                    <div>{translate(languageData, "PortalType")}</div>
                    <div>{translate(languageData, "Language")}</div>
                </div>
            ),
            selector: (row) => row.protalType,
            cell: (row) => (
                <div className="my-2">
                    <div >
                        <div className="d-flex align-items-center">
                            <Link className="my-1" style={{ fontSize: "18px" }}>
                                {row?.portalLink}
                            </Link>
                            <span>
                                {row?.homepage ?
                                    <Tool title="Homepage">
                                        <span>
                                            <AiOutlineHome
                                                className="text-warning ms-2 me-1"
                                                style={{ fontSize: "18px" }}
                                            />
                                        </span>
                                    </Tool> : <></>}
                                {row.noFollow ?
                                    <Tool title="No Follow">
                                        <span>
                                            <PiProhibitBold
                                                className="text-muted ms-2"
                                                style={{ fontSize: "18px" }}
                                            />
                                        </span>
                                    </Tool> : <></>}
                            </span>
                        </div>
                    </div>
                    <div><img src={row.language === "pl" ? polandFlag : usFlag} width={20} /></div>
                </div>
            ),
            width: "250px",
            style: {
                width: "250px",
            },
        },
        {
            name: "Dr",
            selector: (row) => row.dr,
            center: true,
            cell: (row) => (
                <div>
                    <div>{row.dr}</div>
                </div>
            ),

        },

        {
            name: translate(languageData, "Ahrefs"),
            selector: (row) => row.ahrefs,
            center: true,
            cell: (row) => (
                <div className="text-center">
                    <span>{row.ahrefs}</span>
                </div>
            ),
        },
        {
            name: (
                <div>
                    <div>{translate(languageData, "BestPrice")}</div>
                </div>
            ),
            selector: (row) => row.bestPrice,
            center: true,
        },

        {
            name: (
                <div>
                    <Link className="btn btn-outline" >
                        <i className="fa fa-columns" style={{ fontSize: "20px" }}></i>
                    </Link>
                </div>
            ),
            cell: (row) => (
                <div>
                    {row.cart === 'Yes' ?
                        <Button variant={"danger"} onClick={() => publisherArticleDetailService(row)}>
                            {translate(languageData, "selected")}
                        </Button> :
                        <Button variant={"primary"} onClick={() => publisherArticleDetailService(row)}>
                            {translate(languageData, "SeeOffers")}
                        </Button>}
                </div>
            ),
            selector: (row) => row.offers,
            center: true,
            width: "150px",
            style: {
                width: "150px",
            },
        },
    ];


    const data = articles?.map((item) => {
        return {
            id: item?.id,
            language: item?.language,
            portalLink: item?.url,
            dr: item?.dr,
            bestPrice: item?.client_price,
            ahrefs: item?.ahref_traffic,
            noFollow: item?.nofollow,
            homepage: item?.home_page,
            cart: item?.cart
        }
    })


    const articleTypeListService = async () => {
        const res = await articleTypeList()
        setArticlePackages(res?.data?.reverse())
    }

    // console.log(orderId, "516");


    const addToCartArticleServices = async () => {
        const data = {
            domainId: selectedSubArticles?.id,
            userId: userData?.id,
            article: selectArticle,
            trafficGuarantee: confirmTraffic,
            articleType: articleTypeValue,
            articleQuality: orderType,
            articleTitle: requestArticleTitle,
            monthGuarantee: monthGuarantee,
            amount: selectedSubArticles?.bestPrice,
            article_amount: orderPrice?.split(',')[0],
            article_id: orderId
        }
        setCartLoading(true)
        const res = await addToCartArticles(data)
        if (res.success === true) {
            toast(translate(languageData, 'addedCartSuccessfully'), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            setCartLoading(false)
            setShowCartOptions(false)
            getCartServices()
            setConfirmModal(true)
            cartListServices()
            getPublisherArticlesService()
        } else {
            toast(translate(languageData, 'dataNotAddedCart'), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            setCartLoading(false)
            setShowCartOptions(false)
            cartListServices()
            setShowOfferModal(false)
            getPublisherArticlesService()
        }
    }
    console.log(selectedSubArticles, "54");

    const handleConfirmation = () => {
        setConfirmModal(false);
        setShowOfferModal(false)
    }

    const getCartServices = async () => {
        const res = await getCart(userData?.id)
        setCartList(res?.product)
    }
    const getPublisherArticlesService = async () => {
        const res = await getPublisherArticles(page, search, typeAnchors, userData?.id)
        setArticles(res.data)
        setLastPage(res?.last_page)
    }


    // const paginationArray = numberToNumeralsArray(lastPage)

    const publisherArticleDetailService = async (domain) => {
        const res = await getPublisherArticleDetails(domain, userData?.id)
        if (res.success === true) {
            setShowOfferModal(true)
            setPublisherArticleDetails(res?.data)
            setSelectedPublisherArticle(domain)
        }
    }


    return (
        <>
            <ToastContainer />
            <div className="p-4 w-100">

                <Card>
                    <Card.Header className="justify-content-between align-items-center flex-wrap">
                        <div>
                            <h3>{translate(languageData, "BuyArticles")}</h3>
                        </div>
                        <div>
                            <Button variant="outline-light">
                                {translate(languageData, "DidNotFindPortalReportIt")}
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div>
                            <h4 className="fw-semibold">{translate(languageData, "BasicFilters")}</h4>
                        </div>
                        <Row className="mt-4" >
                            {/* <Col xs={12} sm={6} md={4} className="">
                                <div
                                    className="wrap-input100 validate-input"
                                    data-bs-validate="Password is required"
                                >
                                    <input
                                        className="input100"
                                        type="text"
                                        name="search"
                                        placeholder={translate(languageData, "Portal Name")}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <span className="focus-input100"></span>
                                    <span className="symbol-input100">
                                        <i className="zmdi zmdi-search" aria-hidden="true"></i>
                                    </span>
                                </div>
                            </Col>
                            <Col xs={12} sm={6} md={4} className="mb-3">
                                <div
                                    className="wrap-input100 validate-input mb-0"
                                    data-bs-validate="Password is required"
                                >
                                    <input
                                        className="input100"
                                        type="text"
                                        name="price"
                                        placeholder={translate(languageData, "EnterTopic")}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <span className="focus-input100"></span>
                                    <span className="symbol-input100">
                                        <i className="zmdi zmdi-search" aria-hidden="true"></i>
                                    </span>
                                </div>
                            </Col> */}
                            <Col xs={12} sm={6} md={4} className="" style={{ zIndex: "100" }}>
                                {/* <div className="form-group">
                                    <select
                                        name="status"
                                        style={{ height: "45px" }}
                                        className="form-select"
                                        id="default-dropdown"
                                        data-bs-placeholder="Select Status"
                                        onChange={(e) => setSearch(e.target.value)}
                                        multiple
                                    >
                                        <option label="Type of Anchors"></option>
                                        <option value="0" >0</option>
                                    </select>
                                </div> */}
                                <FormControl fullWidth>
                                    {/* <Label for="discountableItems">
                                        Discountable items
                                    </Label> */}
                                    <Select
                                        labelId="typeofanchors-label"
                                        id="typeofanchors"
                                        multiple
                                        value={typeAnchors}
                                        onChange={handleAnchorsType}
                                        input={<OutlinedInput name='typeofanchors' />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                        style={{ height: "40px" }}
                                        displayEmpty={true}
                                        IconComponent={() => (
                                            <MdOutlineKeyboardArrowDown size={20} className='me-1 MuiSvgIcon-root MuiSelect-icon' />
                                        )}
                                    >
                                        <MenuItem value="" disabled>{translate(languageData, "typeofAnchors")}</MenuItem>
                                        {anchorTypes?.map((name, index) => (

                                            <MenuItem key={index} value={name?.type} className='check_list'>
                                                <Checkbox checked={typeAnchors?.indexOf(name?.type) > -1} />
                                                <ListItemText primary={name?.type} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col xs={12} sm={6} md={4} className=''>
                                <div className='border border-muted d-flex align-items-center bg-white mb-3' style={{ height: "45px" }}>
                                    <label className="custom-control custom-checkbox mx-auto d-flex mt-1">
                                        <Form.Check
                                            id='checkguarantee'
                                            className='pe-2'
                                            onChange={(e) => handleCheckChange(e)}
                                            name="doFollow"
                                            checked={search.doFollow}

                                        />
                                        <span className='mt-1'>{translate(languageData, "doFollowP")}</span>
                                    </label>
                                </div>

                            </Col>

                            <Col xs={12} sm={6} md={4} className=''>
                                <div className='border border-muted d-flex align-items-center bg-white mb-3' style={{ height: "45px" }}>
                                    <label className="custom-control custom-checkbox mx-auto d-flex mt-1">
                                        <Form.Check
                                            id='checkguarantee'
                                            className='pe-2'
                                            onChange={(e) => handleCheckChange(e)}
                                            name="promotions"
                                            checked={search.promotions}
                                        />
                                        <span className='mt-1'>{translate(languageData, "promotions")}</span>
                                    </label>
                                </div>

                            </Col>


                            <Col xs={12} sm={6} md={4} className="mb-3 d-flex">
                                <Col lg={6} className="ps-0">
                                    <div
                                        className="wrap-input100 validate-input mb-0"
                                        data-bs-validate="Password is required"
                                    >
                                        <input
                                            className="input100"
                                            type="number"
                                            name="drMin"
                                            placeholder={translate(languageData, "dRMin")}
                                            // placeholder="DR Min"
                                            style={{ paddingLeft: "15px" }}
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                    </div>
                                </Col>
                                <Col lg={6} className="pe-0">
                                    <div
                                        className="wrap-input100 validate-input mb-0"
                                        data-bs-validate="Password is required"
                                    >
                                        <input
                                            className="input100"
                                            type="number"
                                            name="drMax"
                                            placeholder={translate(languageData, "dRMax")}
                                            // placeholder="DR Max"
                                            style={{ paddingLeft: "15px" }}
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                    </div>
                                </Col>
                            </Col>

                            <Col xs={12} sm={6} md={4} className="mb-3 d-flex">
                                <Col lg={6} className="ps-0">
                                    <div
                                        className="wrap-input100 validate-input mb-0"
                                        data-bs-validate="Password is required"
                                    >
                                        <input
                                            className="input100"
                                            type="number"
                                            name="minLinks"
                                            placeholder={translate(languageData, "minLinks")}
                                            // placeholder="Min Links"
                                            style={{ paddingLeft: "15px" }}
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                    </div>
                                </Col>
                                <Col lg={6} className="pe-0">
                                    <div
                                        className="wrap-input100 validate-input mb-0"
                                        data-bs-validate="Password is required"
                                    >
                                        <input
                                            className="input100"
                                            type="number"
                                            name="maxLinks"
                                            placeholder={translate(languageData, "maxLinks")}
                                            // placeholder="Max Links"
                                            style={{ paddingLeft: "15px" }}
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                    </div>
                                </Col>
                            </Col>


                            <Col xs={12} sm={6} md={4} className="mb-3 d-flex">
                                <Col lg={6} className="ps-0">
                                    <div
                                        className="wrap-input100 validate-input mb-0"
                                        data-bs-validate="Password is required"
                                    >
                                        <input
                                            className="input100"
                                            type="number"
                                            name="ahrefMin"
                                            placeholder={translate(languageData, "ahrefsMin")}
                                            // placeholder="AHREFS Min"
                                            style={{ paddingLeft: "15px" }}
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                    </div>
                                </Col>
                                <Col lg={6} className="pe-0">
                                    <div
                                        className="wrap-input100 validate-input mb-0"
                                        data-bs-validate="Password is required"
                                    >
                                        <input
                                            className="input100"
                                            type="number"
                                            name="ahrefMax"
                                            placeholder={translate(languageData, "ahrefsMax")}
                                            // placeholder="AHREFS Max"
                                            style={{ paddingLeft: "15px" }}
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                    </div>
                                </Col>
                            </Col>
                        </Row>




                        {/* <Button variant="primary" className="mx-auto d-flex mt-4">
                            {translate(languageData, "artilstSearch")}
                        </Button> */}
                    </Card.Body>
                    {listLoading ?
                        <div className="d-flex">
                            <img src={globalLoader} className='mx-auto mt-5' alt='loader1' />
                        </div> :
                        <DataTable columns={columns} data={data} />}
                </Card>

                <div className={`d-flex ${checkAddedToCart ? "justify-content-between" : "justify-content-end"} mb-4`}>
                    <Stack spacing={2}>
                        <Pagination count={lastPage} page={page} onChange={handlePageChange} color="primary" />
                    </Stack>
                    {checkAddedToCart &&
                        <div className="d-flex justify-content-end ">
                            <Button onClick={() => navigate('/cart')}>{translate(languageData, "proceedToCheckout")}</Button>
                        </div>}
                </div>





                {/* <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className={`page-item ${paginationArray.length < 2 || page === 1 ? 'disabled' : ''}`} onClick={() => decreasePage()}><a className="page-link" href="#">Previous</a></li>
                        {paginationArray.map((item, index) => {
                            return (
                                <li className="page-item" key={index}><a className={`page-link ${page === item && "bg-primary text-white"}`} href="#">{item}</a></li>
                            )
                        })}
                        <></> : <li className={`page-item ${paginationArray.length < 2 || page === lastPage ? 'disabled' : ''}`} onClick={() => increasePage()}><a class="page-link" href="#">Next</a></li>

                    </ul>
                </nav> */}



                <Modal
                    show={showOfferModal}
                    onHide={() => setShowOfferModal(false)}
                    size="xl"
                    className="w-100"
                >
                    <Modal.Header>
                        <div>
                            {/* <p className="mb-1">drseo.blog</p> */}
                            <h4>
                                {translate(languageData, "SelectionPortalOffer")}: <b>{selectedPublisherArticle?.portalLink}</b>
                            </h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex jusify-content-between w-100 flex-wrap">
                            {/* <div>
                                <span>{translate(languageData, "TrackingCode")} :</span>
                                <span className="ms-1 ">
                                    <IoIosCheckmarkCircle size={20} className="text-primary" />
                                </span>
                            </div> */}
                            {/* <div className="ms-6">
                                <span>{translate(languageData, "TrackingCode")} :</span>
                                <span className="ms-1 ">
                                    <IoIosCheckmarkCircle size={20} className="text-primary me-1" />
                                    {translate(languageData, "StatisticsFromPublisher")}: (25,00 zł net)
                                </span>
                            </div> */}
                        </div>
                        <div className="mt-2 px-4">
                            <DataTable columns={modalColumns} data={modalTableData} />
                        </div>
                        {showCartOptions &&
                            <div>
                                <div className="mt-5 d-flex justify-content-center flex-wrap">
                                    <Button
                                        className={`${articleType === translate(languageData, "SelectOwnArticle")
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                            }   rounded-0`}
                                        onClick={() => setArticleType(translate(languageData, "SelectOwnArticle"))}
                                    >
                                        {translate(languageData, "SelectOwnArticle")}
                                    </Button>
                                    <Button
                                        className={`${articleType === translate(languageData, "RequestArticleWriting")
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                            }   rounded-0`}
                                        onClick={() => setArticleType(translate(languageData, "RequestArticleWriting"))}
                                    >
                                        {translate(languageData, "RequestArticleWriting")}
                                    </Button>
                                    <Button
                                        className={`${articleType === translate(languageData, "AddNewArticle")
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                            }   rounded-0`}
                                        onClick={() => setArticleType(translate(languageData, "AddNewArticle"))}
                                    >
                                        {translate(languageData, "AddNewArticle")}
                                    </Button>
                                    <Button

                                        className={`${articleType === translate(languageData, "selectLater")
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                            }   rounded-0`}
                                        onClick={() => setArticleType(translate(languageData, "selectLater"))}
                                    >
                                        {translate(languageData, "selectLater")}
                                    </Button>
                                </div>
                                <div className="mt-5">
                                    <div>
                                        {articleType === translate(languageData, "SelectOwnArticle") &&
                                            <div>
                                                {/* <p className="fw-semibold ps-4">{translate(languageData, "sidebarContent")}</p> */}
                                            </div>}
                                        <div className="ps-4">
                                            {articleType === translate(languageData, "SelectOwnArticle") &&
                                                <Row className="mt-5 border-bottom">
                                                    {/* <Col xs={12} md={4}>
                                                        <span>{translate(languageData, "SelectArticle")} *</span>
                                                    </Col> */}
                                                    {/* <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                        <div className="form-group">
                                                            <select name="selectArticle" style={{ height: "45px" }} class=" form-select" id="default-dropdown" onChange={(e) => setSelectArticle(e.target.value)} value={selectArticle}>
                                                                <option label="Select"></option>
                                                                {articleList?.map((item, index) => {
                                                                    return (
                                                                        <option value={item?.id} key={index}>{item?.title}</option>
                                                                    )
                                                                })}

                                                            </select>
                                                        </div>

                                                    </Col> */}
                                                </Row>}

                                            {articleType === translate(languageData, "RequestArticleWriting") &&
                                                <div>
                                                    <Row className='justify-content-center'>
                                                        {articlePackages?.map((item, index) => {
                                                            return (

                                                                <Col xs={12} lg={4} onClick={() => handleOrderPriceCard(item.name, item.price, item.id)} key={index} className='mt-2 rounded-pill'>
                                                                    <Card className={`shadow-md ${orderType === item?.name && "border border-primary border-2 shadow-lg"}`} style={{ cursor: "pointer" }}>
                                                                        <Card.Body className='text-center'>
                                                                            <h3 className={`mt-4 ${orderType === item.name ? "text-primary" : "text-outline-primary"}`}>{item.price}</h3>
                                                                            <div className='mt-4 mb-3'><FaInfoCircle style={{ color: 'blue' }} size={25} /></div>
                                                                            <h3 className='mb-3'>{item.name} </h3>
                                                                            <Link >{item?.description}</Link>
                                                                            <div className='mt-4'>
                                                                                <Button className={`btn  ${orderType === item.name ? "btn-primary" : "btn-outline-primary"}`}>{translate(languageData, "Select")}</Button>
                                                                            </div>
                                                                            <div></div>
                                                                        </Card.Body>
                                                                        <div className={`d-flex justify-content-center align-items-center ${orderType === item.name ? "green" : "grey"}`} style={{ marginTop: '-59px' }}>
                                                                            <img src={orderType === item.name ? green : grey} />
                                                                        </div>
                                                                    </Card>
                                                                </Col>

                                                            )
                                                        })}

                                                    </Row>
                                                    {/* <Row>
                                                        <Col xs={12} md={6}>
                                                            {translate(languageData, "OrderDetails")}
                                                        </Col>
                                                        <Col xs={12} md={6}>
                                                            <Button className={`btn ${specifyDetails === "Specify Now" ? "btn-primary" : "btn-outline-primary"}  rounded-0`} onClick={() => setSpecifyDetails("Specify Now")}>Specify Now</Button>
                                                            <Button className={`btn ${specifyDetails === "Specify Later" ? "btn-primary" : "btn-outline-primary"}  rounded-0`} onClick={() => setSpecifyDetails("Specify Later")}>Specify Later</Button>

                                                        </Col>
                                                    </Row> */}
                                                    {/* {specifyDetails === "Specify Now" &&
                                                        <Row className='align-items-center mt-5'>
                                                            <Col xs={12} md={4}>
                                                                <span>Title *</span>
                                                            </Col>
                                                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                                                    <input className="input100" type="text" name="title" placeholder='Title' style={{ paddingLeft: "15px" }} onChange={(e) => setRequestArticleTitle(e.target.value)} value={requestArticleTitle} />
                                                                </div>
                                                                <div className='text-danger text-center mt-1'>{formErrors.title}</div>
                                                            </Col>
                                                        </Row>} */}

                                                    {/* <Row className='align-items-center mt-5'>
                                                    <Col xs={12} md={4}>
                                                        <span>{translate(languageData , "Theme")} *</span>
                                                    </Col>
                                                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                        <div className="form-group">
                                                        <Select options={""} name='language' placeholder="Language" styles={{ control: (provided) => ({ ...provided, borderColor: '#ecf0fa', height: '45px', }) }}  />

                                                        </div>
                                                    
                                                    </Col>
                                                </Row> */}


                                                </div>

                                            }


                                            <div>
                                                {/* <p className="fw-semibold mt-5">{translate(languageData, "TrafficGuarantee")}</p>
                                                <Row className="mt-5 border-bottom pb-5">
                                                    <Col xs={12} md={4}>
                                                        <span>I want traffic guarantee *</span>
                                                    </Col>
                                                    <Col xs={12} md={8} className="mt-3 mt-md-0 d-flex align-items-center">
                                                        <Form.Check
                                                            type="switch"
                                                            // id="custom-switch"
                                                            className="custom-switch"
                                                            onChange={(e) => setConfirmTraffic(e.target.checked)}
                                                        />
                                                        <Tool title="Traffice guarantee is provided by Content Stream between 10 days of approval of publication">
                                                            <span className="ms-5 pt-1">
                                                                <AiOutlineQuestionCircle size={25} className="text-primary" />
                                                            </span>
                                                        </Tool>

                                                    </Col>
                                                </Row> */}
                                                {/* {confirmTraffic &&
                                                    <div className="d-flex flex-wrap justify-content-center">
                                                        {trafficData.map((item, index) => {
                                                            return (
                                                                <div key={index} className={`border border-primary ${traficType.price === item.price && "bg-primary text-white"} text-center p-4 traffic-container`} style={{ cursor: "pointer" }} onClick={() => handleTrafficRow(item.price, item.clicks)}>
                                                                    <div className="">{item.clicks}</div>
                                                                    <div>Clicks</div>
                                                                    -----------------------
                                                                    <div>{item.price}</div>
                                                                </div>
                                                            )
                                                        })}

                                                    </div>} */}
                                                {/* <p className="fw-semibold mt-5">{translate(languageData, "36MonthGuarantee")}</p>
                                                <Row className="mt-5 border-bottom pb-5">
                                                    <Col xs={12} md={4}>
                                                        <span>{translate(languageData, "IwantBuy36MonthsGuarantee")}</span>
                                                    </Col>
                                                    <Col xs={12} md={8} className="mt-3 mt-md-0 d-flex align-items-center ps-5">
                                                        <Form.Check
                                                            type="switch"
                                                            // id="custom-switch"
                                                            className="custom-switch"
                                                            onChange={(e) => setMonthGuarantee(e.target.value)}
                                                        />
                                                        <Tool title="Option to purchase 36 month guarantee">
                                                            <span className="ms-2">
                                                                <PiShieldCheckFill className="text-primary" size={25} />
                                                            </span>
                                                        </Tool>
                                                        <Tool title="Traffice guarantee is provided by Content Stream between 10 days of approval of publication">
                                                            <span className="ms-7 pt-1">
                                                                <AiOutlineQuestionCircle size={25} className="text-primary" />
                                                            </span>
                                                        </Tool>

                                                    </Col>
                                                </Row> */}
                                                <Row align-items-center className="mt-4">
                                                    {/* <Col className="bg-light p-1" lg={6}>
                                                        <div>{translate(languageData, "ByPurchasingWarrantyYouAgreeTerms") + " " + "'" + translate(languageData, "IwantBuy36MonthsGuarantee") + "'"}</div>
                                                    </Col> */}
                                                    <Col lg={12}>
                                                        <div className="fs-4 text-muted text-end me-2">{translate(languageData, "price")} : {finalPrice} zł</div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                    </Modal.Body>
                    <Modal.Footer>
                        {/* {articleType === translate(languageData, "RequestArticleWriting") &&
                            <Button variant="primary" onClick={() => requestArticleService()}>
                                {loading ? "Wait..." : "Request Article"}
                            </Button>} */}

                        {showCartOptions ?
                            <Button variant="primary" onClick={() => addToCartArticleServices()}>
                                {cartLoading ? "Wait..." : translate(languageData, "addToCart")}
                            </Button> : ""}

                        <Button variant="outline-primary" onClick={() => { setShowOfferModal(false); setShowCartOptions(false) }}>
                            {translate(languageData, "close")}
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={confirmModal}
                    size="md"
                    className="w-100">
                    <Modal.Body className="text-center">
                        <BsExclamationOctagon className="text-primary mb-4" size={50} />
                        <div>
                            {translate(languageData, "doYouWantShoppingCartAndFinalizeYourPublicationOrder")}
                        </div>
                        <div className="d-flex mt-3 justify-content-center">
                            <Button variant="primary" onClick={() => handleConfirmation()}>
                                {translate(languageData, "continueShopping")}
                            </Button>
                            <Button variant="outline-primary" className="ms-2" onClick={() => navigate('/cart')}>
                                {translate(languageData, "goToCart")}
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
};

export default BuyArticles;
