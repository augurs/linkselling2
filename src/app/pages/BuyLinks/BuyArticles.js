import React, { useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import polandFlag from "../../../assets/images/flags/pl.svg"
import { MdLink, MdOutlineKeyboardArrowDown, MdAnchor } from 'react-icons/md';
import usFlag from "../../../assets/images/flags/us.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { PiProhibitBold } from "react-icons/pi";
import { BsExclamationOctagon } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";
import "./BuyLinks.css";
import CloseIcon from '@mui/icons-material/Close';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Modal } from "react-bootstrap";
import { anchorTypes } from "../../../utility/data";
import { translate, countLinksInEditor } from "../../../utility/helper";
import { useLanguage } from "../../Context/languageContext";
import { addToCartArticles, articleTypeList, getPublisherArticleDetails, getPublisherArticles } from "../../../services/buyArticleServices/buyArticlesServices";
import { ToastContainer, toast } from "react-toastify";
import globalLoader from '../../../assets/images/loader.svg'
import green from '../../../assets/images/cards/Green.png'
import grey from '../../../assets/images/cards/Grey.png'
import { useEffect } from "react";
import { getArticles } from "../../../services/articleServices/articleServices";
import { getCart } from "../../../services/invoicesServices/invoicesServices";
import { useCart } from "../../Context/cartListContext";
import { Checkbox, FormControl, ListItemText, MenuItem, OutlinedInput, Select } from 'material-ui-core';
import Select1 from 'react-select'
import { Pagination, Stack } from "@mui/material";
import { projectList } from '../../../services/ProjectServices/projectServices';
import { useSidebar } from '../../Context/togglerBarContext';
import { dashboardpromotion } from '../../../services/HomeServices/homeService'
import ReactQuill from "react-quill";
import FileUpload from '../../Components/FileUpload/FileUpload'
import { BsInfoCircle } from 'react-icons/bs';
import { languages } from '../../../utility/data'
import { addProjects } from '../../../services/ProjectServices/projectServices'
import { FaPlus, FaSearch } from 'react-icons/fa';
import { IoTicketOutline } from 'react-icons/io5';
import PixabayImageSearch from '../../Components/Pixabay/pixabay';
import { walletBalance } from "../../../services/walletServices/walletService"
import { modules, formats, base64ToFile } from "../../../utility/helper";
import moment from "moment";
const BuyArticles = () => {

    const userData = JSON.parse(localStorage.getItem('userData'));
    const initialValues = {
        project: "",
    };

    let initialValues1 = {
        projectName: "",
        webAddress: "",
        publicationLang: "",
    }
    const lang = localStorage.getItem("lang");
    const { languageData } = useLanguage();
    // const [rating, setrating] = useState(initialState)
    const [formValues, setFormValues] = useState(initialValues);
    const [formValues1, setFormValues1] = useState(initialValues1);
    const [formErrors, setFormErrors] = useState({})
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [showCartOptions, setShowCartOptions] = useState(false);
    const [articleType, setArticleType] = useState(translate(languageData, "RequestArticleWriting"));
    const [articleTypeValue, setarticleTypeValue] = useState('RequestArticleWriting')
    const [traficType, setTraficType] = useState({ price: '0,00 zł', clicks: "0" })
    const [confirmTraffic, setConfirmTraffic] = useState(false)
    const [orderType, setOrderType] = useState('Basic article');
    const [orderPrice, setOrderPrice] = useState('50,00 zł');
    const [orderId, setOrderId] = useState(1);
    const [requestArticleTitle, setRequestArticleTitle] = useState("")
    const [selectArticle, setSelectArticle] = useState('')
    const [loading, setLoading] = useState(false)
    const [finalPrice, setFinalPrice] = useState(64400)
    const [monthGuarantee, setMonthGuarantee] = useState(false)
    const [cartLoading, setCartLoading] = useState(false)
    const [articleList, setArticleList] = useState([])
    const [cartList, setCartList] = useState([])
    const [project, setProject] = useState('')
    const [content, setContent] = useState('')
    const [image, setImage] = useState(null);
    const [imageSource, setImageSource] = useState(null);
    const [date, setDate] = useState('')
    const [addArtiLead, setAddArtiLead] = useState('')
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
    const [articlesData2, setArticlesData2] = useState([]);
    const [checkboxes, setCheckboxes] = useState([]);
    const [error, setError] = useState('');
    const [search, setSearch] = useState({ doFollow: 0, promotions: 0, drMin: "", drMax: "", minLinks: "", maxLinks: "", ahrefMin: "", ahrefMax: "" })
    const { cartListServices } = useCart()
    const { toggleSidebar1 } = useSidebar();
    const [showModal, setShowModal] = useState(false);
    const [selectedMaxLinks, setSelectedMaxLinks] = React.useState(null);
    const [provideSubject, setProvideSubject] = useState(false);
    const [weProvideSubject, setWeProvideSubject] = useState(true);
    const [linkValues, setLinkValues] = useState([]);
    const [anchorValues, setAnchorValues] = useState([]);
    const [suggestion, setSuggestion] = useState('')
    const [provideSubjectText, setProvideSubjectText] = useState('')
    const [publisherMsgText, setPublisherMsgText] = useState('')
    const [cardLang, setCardLang] = useState(lang)
    const [userDiscount, setUserDiscount] = useState('');
    const [useArticleList, setUseArticleList] = useState([])
    const [addNewArticleProjectDropdown, setAddNewArticleProjectDropdown] = useState([])

    const allowedImageExtension = ['.jpg', '.gif', '.png']

    useEffect(() => {
        if (useArticleList) {
            const data = useArticleList?.find((item) => item?.id == addNewArticleProjectDropdown)
            setRequestArticleTitle(data?.title)
            setDate(moment(data?.created_at, 'YYYY/MM/DD').format('YYYY-MM-DD'))
            setAddArtiLead(data?.lead)
            setContent(data?.content)
            setImageSource({ previewUrl: data?.file });
            setImage('');
        }
    }, [addNewArticleProjectDropdown, useArticleList])

    useEffect(() => {
        getUserDiscountServices()
    }, [])

    useEffect(() => {
        handleUseArticleList()
    }, [])

    const getUserDiscountServices = async () => {
        setListLoading(true)
        const res = await walletBalance(userData?.id);
        setUserDiscount(res?.data)
        setListLoading(false)
    }

    useEffect(() => {
        if (articleType === translate(languageData, "AddNewArticle") || articleType === translate(languageData, "selectLater") || articleType === translate(languageData, "RequestArticleWriting")) {
            setAddArtiLead('')
        }
    }, [articleType]);

    const handleMaxLinksSelection = (maxLinks) => {
        setSelectedMaxLinks(maxLinks);
    };

    const handleLinkChange = (index, value) => {
        const newLinkValues = [...linkValues];
        newLinkValues[index] = value;
        setLinkValues(newLinkValues);
    };

    const handleAnchorChange = (index, value) => {
        const newAnchorValues = [...anchorValues];
        newAnchorValues[index] = value;
        setAnchorValues(newAnchorValues);
    };

    const generateRows = () => {
        const rows = [];
        for (let i = 1; i <= selectedMaxLinks; i++) {
            rows.push(
                <Row key={i} className='align-items-center mt-5'>
                    <Col xs={12} md={4}>
                        <span>{translate(languageData, "link")} {i} *</span>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0 mb-3">
                        <div className="wrap-input100 validate-input mb-0" data-bs-validate="Link is required">
                            <input
                                className="input100"
                                type="url"
                                name={`link${i}`}
                                placeholder={`${translate(languageData, "link")} ${i}`}
                                style={{ paddingLeft: "15px" }}
                                onChange={(e) => handleLinkChange(i - 1, e.target.value)}
                                value={linkValues[i - 1] || ''}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={4}>
                        <span>{translate(languageData, "requestanchor")} {i} *</span>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                        <div className="wrap-input100 validate-input mb-0" data-bs-validate="Anchor is required">
                            <input
                                className="input100"
                                type="url"
                                name={`Anchor${i}`}
                                placeholder={`${translate(languageData, "requestanchor")} ${i}`}
                                style={{ paddingLeft: "15px" }}
                                onChange={(e) => handleAnchorChange(i - 1, e.target.value)}
                                value={anchorValues[i - 1] || ''}
                            />
                        </div>
                    </Col>
                </Row>
            );
        }
        return rows;
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const pid = queryParams.get('pid');

    const handleRemoveTypeAnchor1 = () => {
        setSearch({ ...search, doFollow: 0 });
    };

    const handleRemovePromotion = (checkboxId) => {
        setSearch({ ...search, promotions: 0 });

        const updatedCheckboxes = checkboxes.map((checkbox) => ({
            ...checkbox,
            checked: checkbox.id === checkboxId ? false : checkbox.checked,
        }));
        setCheckboxes(updatedCheckboxes);
    };

    const handleRemoveTypeAnchor = (type) => {
        setTypeAnchors(typeAnchors.filter((item) => item !== type));
    };

    const navigate = useNavigate()

    useEffect(() => {
        getPublisherArticlesService()
    }, [search, typeAnchors, page])

    useEffect(() => {
        if (articleType === translate(languageData, "AddNewArticle") || articleType === translate(languageData, "selectLater") || articleType === translate(languageData, "UseArticle")) {
            setRequestArticleTitle('');
            setDate('');
            handleEditorChange('')
            setImage('')
            setImageSource('')
            setPublisherMsgText('')
            setSuggestion('')
            setLinkValues('')
            setAnchorValues('')
            setAddArtiLead('')
        }
    }, [articleType]);


    const handleInputChange = (e) => {
        const { name, value } = e.target
        setSearch({ ...search, [name]: value })
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues1({ ...formValues1, [name]: value })
    }

    const handlePageChange = (event, value) => {
        setPage(value)
    }


    useEffect(() => {
        if (articleType === translate(languageData, "RequestArticleWriting")) {
            setarticleTypeValue('RequestArticle')
        } else if (articleType === translate(languageData, "AddNewArticle")) {
            setarticleTypeValue('AddAnArticle ')
        } else if (articleType === translate(languageData, "selectLater")) {
            setarticleTypeValue('SelectLater')
        } else {
            setarticleTypeValue('UseArticle')
        }
    }, [articleType])

    useEffect(() => {
        if (articleType === translate(languageData, "RequestArticleWriting")) {
            setPublisherMsgText('')
        }
    }, [articleType])

    useEffect(() => {
        if (lang)
            setCardLang(lang)
    }, [lang])


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
        toggleSidebar1()
    }

    const handletoggle = () => {
        toggleSidebar1()
    }


    const checkAddedToCart = articles?.some((item) => item?.cart === 'Yes')

    const getArticleListServices = async () => {
        setListLoading(true)
        const res = await getArticles(userData?.id)
        setArticleList(res?.data)
        setListLoading(false)
    }

    useEffect(() => {
        setArticleType(translate(languageData, "RequestArticleWriting"))
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
                            <div className="d-flex gap-2 justify-content-center">
                                <Link className="my-1" style={{ fontSize: "18px" }}>
                                    {row?.portalLink}
                                </Link>
                                <Link to={`https://linkanonymous.com/?https://${row?.portalLink}`}><Button className="mt-2 btn btn-outline-primary"><FaSearch /></Button></Link></div>
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
                    <div><img src={row.language === "pl" ? polandFlag : usFlag} width={20} alt="flag" /></div>

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
            name: translate(languageData, "Action"),
            cell: (row) => (
                <div>
                    {row.cartOption && selectedSubArticles?.id === row?.id ? (
                        <Button
                            variant="outline-primary"
                            onClick={() => setShowCartOptions(false)}
                        >
                            {translate(languageData, "back")}
                        </Button>
                    )
                        // : (
                        //     row.cart === 'Yes' ?
                        //         <Button
                        //             variant="primary"
                        //             onClick={() => { setShowCartOptions(true); setSelectedSubArticles(row); handleMaxLinksSelection(row.maxLinks); }}
                        //             disabled
                        //         >
                        //             {translate(languageData, "Select")}
                        //         </Button>
                        :
                        <Button
                            variant="outline-primary"
                            onClick={() => { setShowCartOptions(true); setSelectedSubArticles(row); handleMaxLinksSelection(row.maxLinks); }}
                        >
                            {translate(languageData, "Select")}
                        </Button>
                    }
                </div>
            ),
            center: true,
        },
    ];

    const modalTableData = publisherArticleDetails?.map((item) => {
        const discount = userDiscount?.discount || 0;
        const discountedPrice = item?.client_price * (1 - discount / 100);
        return {
            id: item?.id,
            portalLink: item?.url,
            language: item?.language,
            dr: item?.dr,
            ahrefs: item?.ahrefs ? item?.ahrefs : "N/A",
            ai: item?.ai ? item?.ai : "N/A",
            bestPrice: discountedPrice >= 0 ? discountedPrice : item?.client_price,
            cartOption: showCartOptions,
            cart: item.cart,
            typeOfAnchors: item?.type_of_anchor,
            maxLinks: item?.max_links,
            maxArticleLength: item?.max_article_length,
            minArticleLength: item?.min_article_length,
            maxLeadLength: item?.max_lead,
            minLeadLength: item?.min_lead ? item?.min_lead : 0,


        }
    })



    const columns = [
        {
            name: (
                <div>
                    <div>
                        {translate(languageData, "PortalType")}
                        <OverlayTrigger placement="top" overlay={<Tooltip>{translate(languageData, "Herewedescribedabout")}</Tooltip>}>
                            <span className="ms-2">
                                <BsInfoCircle />
                            </span>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
            selector: (row) => row.protalType,
            selector: (row) => row.portalLink,
            sortable: true,
            cell: (row) => (
                <div className="my-2 d-flex align-items-center gap-1">
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
                    <div className="btn btn-outline-primary">
                        <Link to={`https://linkanonymous.com/?https://${row?.portalLink}`}>
                            <FaSearch style={{ cursor: "pointer" }} />
                        </Link>
                    </div>

                </div>
            ),
            width: "250px",
            style: {
                width: "250px",
            },
        },
        {
            name: (
                <div>
                    <div>
                        {translate(languageData, "Language")}
                        <OverlayTrigger placement="top" overlay={<Tooltip>{translate(languageData, "Heregivendomaincountry")}</Tooltip>}>
                            <span className="ms-2">
                                <BsInfoCircle />
                            </span>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
            selector: (row) => row.protalType,
            center: true,
            cell: (row) => (
                <div >
                    <div><img src={row.language === "pl" ? polandFlag : usFlag} width={20} alt="flag" /></div>
                </div>
            ),
        },
        {
            name: (
                <div>
                    DR
                    <OverlayTrigger placement="top" overlay={<Tooltip>{translate(languageData, "DomainRatingdomain")}</Tooltip>}>
                        <span className="ms-2">
                            <BsInfoCircle />
                        </span>
                    </OverlayTrigger>
                </div>
            ),
            selector: (row) => row.dr,
            sortable: true,
            center: true,
            cell: (row) => (
                <div>
                    <div>{row.dr}</div>
                </div>
            ),

        },

        {
            name: (
                <div>
                    {translate(languageData, "Ahrefs")}
                    <OverlayTrigger placement="top" overlay={<Tooltip>{translate(languageData, "Ahrefratingofdomain")}</Tooltip>}>
                        <span className="ms-2">
                            <BsInfoCircle />
                        </span>
                    </OverlayTrigger>
                </div>
            ),
            selector: (row) => row.ahrefs,
            sortable: true,
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
                    <div>
                        {translate(languageData, "BestPrice")}
                        <OverlayTrigger placement="top" overlay={<Tooltip>{translate(languageData, "priceofdomain")}</Tooltip>}>
                            <span className="ms-2">
                                <BsInfoCircle />
                            </span>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
            selector: (row) => row.bestPrice,
            sortable: true,
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
        const discount = userDiscount?.discount || 0;
        const discountedPrice = item?.client_price * (1 - discount / 100);
        return {
            id: item?.id,
            language: item?.language,
            portalLink: item?.url,
            dr: item?.dr,
            bestPrice: discountedPrice >= 0 ? discountedPrice : item?.client_price,
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


    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    const addToCartArticleServices = async () => {
        if (articleType === translate(languageData, "AddNewArticle")) {
            if (!requestArticleTitle) {
                toast(translate(languageData, "TitleofArticleField"), {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }
            if (linkCount === 0) {
                toast(translate(languageData, "Minimum1link"), {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });

                return;
            }

            if (linkCount > 0 && linkCount > selectedMaxLinks) {
                toast(translate(languageData, "Minimum1link"), {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }
            if (!image) {
                toast(translate(languageData, "ImageField"), {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }
            if (content?.replace(/<[^>]*>/g, '').length > selectedSubArticles?.maxArticleLength) {
                const maxArticleLength = selectedSubArticles?.maxArticleLength;
                const errorMessage = `${translate(languageData, "maxArticleLength")}: ${maxArticleLength}`;
                toast(errorMessage, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });

                return;
            }
            if (content?.replace(/<[^>]*>/g, '').length < selectedSubArticles?.minArticleLength) {
                const minArticleLength = selectedSubArticles?.minArticleLength;
                const errorMessage = `${translate(languageData, "minArticleLength")}: ${minArticleLength}`;
                toast(errorMessage, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }

            if (addArtiLead?.length > selectedSubArticles?.maxLeadLength) {
                const maxLeadLength = selectedSubArticles?.maxLeadLength;
                const errorMessage = `${translate(languageData, "maxLeadLength")}: ${maxLeadLength}`;
                toast(errorMessage, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }

        }
        if (articleType === translate(languageData, "RequestArticleWriting")) {
            if (provideSubject && (!provideSubjectText || provideSubjectText.trim() === '')) {
                toast(translate(languageData, "SubjectFieldNotEmpty"), {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }
            if (linkValues == 0) {
                toast(translate(languageData, "Minimum1link"), {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }
            if (anchorValues == 0) {
                toast(translate(languageData, "Min1anchor"), {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }
            if (linkValues.some((link) => !isValidUrl(link))) {
                toast(translate(languageData, "InvalidLink"), {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }
        }
        if (articleType === translate(languageData, "UseArticle")) {
            if (!requestArticleTitle) {
                toast(translate(languageData, "TitleofArticleField"), {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }
            if (linkCount === 0) {
                toast(translate(languageData, "Minimum1link"), {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });

                return;
            }

            if (linkCount > 0 && linkCount > selectedMaxLinks) {
                toast(translate(languageData, "Minimum1link"), {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }
            if (!addNewArticleProjectDropdown || !addNewArticleProjectDropdown?.length) {
                toast(translate(languageData, "selectArticleFromList"), {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }
            if (content?.replace(/<[^>]*>/g, '').length > selectedSubArticles?.maxArticleLength) {
                const maxArticleLength = selectedSubArticles?.maxArticleLength;
                const errorMessage = `${translate(languageData, "maxArticleLength")}: ${maxArticleLength}`;
                toast(errorMessage, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });

                return;
            }
            if (content?.replace(/<[^>]*>/g, '').length < selectedSubArticles?.minArticleLength) {
                const minArticleLength = selectedSubArticles?.minArticleLength;
                const errorMessage = `${translate(languageData, "minArticleLength")}: ${minArticleLength}`;
                toast(errorMessage, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }

            if (addArtiLead?.length > selectedSubArticles?.maxLeadLength) {
                const maxLeadLength = selectedSubArticles?.maxLeadLength;
                const errorMessage = `${translate(languageData, "maxLeadLength")}: ${maxLeadLength}`;
                toast(errorMessage, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'error'
                });
                return;
            }

        }

        const articlesubjectValue = provideSubjectText && provideSubjectText.trim() !== '' ? provideSubjectText : 'we provide subject';
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
            article_amount: articleType === translate(languageData, "RequestArticleWriting") ? orderPrice?.split(',')[0] : "",
            article_id: articleType === translate(languageData, "RequestArticleWriting") ? orderId : articleType === translate(languageData, "UseArticle") ? addNewArticleProjectDropdown : "",
            project: project,
            content: content,
            image: image,
            date: date,
            links: linkCount,
            anchorurl: linkValues,
            suggestion: suggestion,
            articlesubject: articlesubjectValue,
            anchor: anchorValues,
            artId: articleType === translate(languageData, "UseArticle") ? addNewArticleProjectDropdown : "",
            publisherMsgText: publisherMsgText,
            addArtiLead: addArtiLead,
        }
        setCartLoading(true)
        const res = await addToCartArticles(data, articleType === translate(languageData, "AddNewArticle"))
        if (res.success === true) {
            toast(translate(languageData, 'addedCartSuccessfully'), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            handleUseArticleList()
            setCartLoading(false)
            setShowCartOptions(false)
            getCartServices()
            setConfirmModal(true)
            cartListServices()
            getPublisherArticlesService()
            setAddNewArticleProjectDropdown('')
        } else {
            toast(translate(languageData, 'dataNotAddedCart'), {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
            setCartLoading(false)
            setShowCartOptions(false)
            cartListServices()
            setShowOfferModal(false)
            getPublisherArticlesService()
        }
    }

    const handleConfirmation = () => {
        setConfirmModal(false);
        setShowOfferModal(false)
    }

    const getCartServices = async () => {
        const res = await getCart(userData?.id)
        setCartList(res?.product)
    }

    const handleEditorChange = (html) => {
        setContent(html)
    }

    const linkCount = countLinksInEditor(content);

    useEffect(() => {
        if (linkCount > selectedMaxLinks) {
            console.error('Too many links in editor!');
        }
    }, [linkCount]);


    const handleFiles = (file) => {
        const previewUrl = URL.createObjectURL(file);
        setImageSource({ previewUrl })
        setImage(file);
    };

    const handlePixabayImageSelect = (selectedPixabayImage) => {
        fetch(selectedPixabayImage.largeImageURL)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const blob = new Blob([buffer], { type: 'image/jpeg' });
                const previewUrl = URL.createObjectURL(blob);
                setImage(blob);
                setImageSource({ previewUrl })
            })
            .catch(error => {
                console.error('Error fetching image:', error);
            });
    };




    // const paginationArray = numberToNumeralsArray(lastPage)

    const publisherArticleDetailService = async (domain) => {
        const res = await getPublisherArticleDetails(domain, userData?.id)
        if (res.success === true) {
            setShowOfferModal(true)
            setPublisherArticleDetails(res?.data)
            setSelectedPublisherArticle(domain)
        }
    }

    //slect project api and auto select option with id start
    const articleListServices = async () => {
        const res = await projectList(userData?.id);
        const filteredData = res?.data?.filter(item => item.status === 'Active');
        setArticlesData2(filteredData);
    }

    useEffect(() => {
        articleListServices()
    }, [])

    useEffect(() => {
        if (pid) {
            setProject(pid);
        }
    }, [pid]);




    //slect project api and auto select option with id 

    //filter article send data with cheked box start
    const getPublisherArticlesService = async () => {
        const res = await getPublisherArticles(page, search, typeAnchors, userData?.id)
        setArticles(res.data)
        setLastPage(res?.last_page)
    }
    //filter article send data with cheked box start

    //promotion api start//

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const res = await dashboardpromotion();

            if (res.success === true) {
                const data = res.data.reverse();
                if (id) {
                    const updatedCheckboxes = data.map(checkbox => ({
                        ...checkbox,
                        checked: checkbox.id === parseInt(id),
                    }));
                    setCheckboxes(updatedCheckboxes);
                    setSearch({ ...search, promotions: id });
                } else {
                    setCheckboxes(data);
                }
            }

            setLoading(false);
        }

        fetchData();
    }, [id]);

    const handleCheckChange = (e, checkboxId) => {
        const { checked } = e.target;
        const updatedCheckboxes = checkboxes.map(checkbox => ({
            ...checkbox,
            checked: checkbox.id === checkboxId ? checked : checkbox.checked,
        }));
        setCheckboxes(updatedCheckboxes);
        setSearch({ ...search, promotions: checked ? checkboxId : 0 });


    };

    const handleCheckChange1 = (e) => {
        const { checked } = e.target;
        setSearch({ ...search, doFollow: checked ? 1 : 0 });

    };

    const numCheckboxesToDisplay = checkboxes?.length;
    const boxWidth = `${100 / numCheckboxesToDisplay}%`;

    //promotion api end//

    //add project modal api start



    const handleSelectChange1 = (selectedOption) => {
        setFormValues1({ ...formValues1, publicationLang: selectedOption?.value })
        validate(formValues1)
    }

    const fieldTranslationMap = {
        name: translate(languageData, "ProjectNameField"),
        language: translate(languageData, "publicationLanguageField"),
        domain: translate(languageData, "WebAddressField"),

    };
    const addProjectService = async () => {

        setLoading(true)
        const res = await addProjects(formValues1, userData?.id);

        if (res.response === true && res.success === true) {
            toast(translate(languageData, "Projectaddedsucessfully"), {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,

                type: 'success'
            });
            await articleListServices();
            setProject(res.data.id);
            setLoading(false)
        } else if (res.success === false && res.response) {
            for (const field in res.response) {
                if (res.response.hasOwnProperty(field)) {
                    const errorMessages = res.response[field].map(message => {
                        const translationKey = fieldTranslationMap[field] || field;
                        return `${translate(languageData, translationKey)}`;
                    });
                    const errorMessage = errorMessages.join('. ');
                    toast(errorMessage, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        type: 'error'
                    });
                }
            }
        } else {
            toast(translate(languageData, "loginFailureMessage2"), {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,

                type: 'error'
            });
            setLoading(false)
        }
        handleCloseModal();
    }


    const validate = (values) => {
        let errors = {};
        let isValid = true;

        if (!values.projectName) {
            errors.projectName = translate(languageData, "ProjectNameRequired");
            isValid = false
        }

        if (!values.webAddress) {
            errors.webAddress = translate(languageData, "WebAddressRequired");
            isValid = false;
        }

        if (!values.publicationLang) {
            errors.publicationLang = translate(languageData, "PublicationLanguageRequired")
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    }


    const languageOption = languages.map((item) => {
        return {
            value: item.name,
            label: item.name
        }
    })

    const languagesOpts = [
        {
            value: "English",
            label: "English"
        },
        {
            value: "Polish",
            label: "Polish"
        }
    ]
    //add project modal api end


    const handleUseArticleList = async () => {
        const res = await getArticles(userData?.id)
        setUseArticleList(res?.data)
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
                            <Col xs={12} sm={12} md={4} className="">
                                <FormControl fullWidth onMouseEnter={handletoggle}>
                                    <Select
                                        labelId="typeofanchors-label"
                                        id="typeofanchors"
                                        multiple
                                        value={typeAnchors}
                                        onChange={handleAnchorsType}
                                        input={<OutlinedInput name="typeofanchors" />}
                                        renderValue={(selected) => (
                                            <div className="d-flex align-items-center">
                                                <MdAnchor size={20} className="text-primary" />
                                                <span className="d-flex flex-grow-1 justify-content-center text-primary">
                                                    {selected?.length > 0 ? selected.join(', ') : translate(languageData, "anchorTypes")}
                                                </span>
                                            </div>
                                        )}
                                        style={{ height: "40px", marginTop: "5px" }}
                                        className="custom-select"
                                        displayEmpty={true}
                                        IconComponent={() => (
                                            <MdOutlineKeyboardArrowDown
                                                size={20}
                                                className='me-1 MuiSvgIcon-root MuiSelect-icon text-primary'
                                            />
                                        )}
                                    >
                                        <MenuItem value="" disabled>
                                            {translate(languageData, "selectAnchorTypes")}
                                        </MenuItem>
                                        {anchorTypes.map((name, index) => (
                                            <MenuItem key={index} value={name.type} className='check_list'>
                                                <Checkbox checked={typeAnchors.indexOf(name.type) > -1} />
                                                <ListItemText primary={name.label} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col xs={12} sm={12} md={4} className=''>
                                <div className='border border-muted d-flex align-items-center bg-white mb-3 p-3' style={{ height: "45px" }}>
                                    <MdLink size={24} color="text-primary" />
                                    <span className='flex-grow-1 d-flex align-items-center justify-content-center'>
                                        {translate(languageData, "doFollowP")}
                                    </span>
                                    <label className="custom-control custom-checkbox mb-1">
                                        <Form.Check
                                            id='checkguarantee'
                                            onChange={(e) => handleCheckChange1(e)}
                                            name="doFollow"
                                            checked={search?.doFollow}
                                        />
                                    </label>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={4} className='d-flex gap-2'>
                                {checkboxes
                                    ?.slice(0, numCheckboxesToDisplay)
                                    .map((checkbox) => (
                                        <div key={checkbox.id} className='border border-muted d-flex align-items-center bg-white mb-3 p-2 ' style={{ height: "45px", width: boxWidth }}>
                                            {/* Left side: promo code icon */}
                                            <IoTicketOutline size={24} color="primary" />

                                            {/* Middle: checkbox text */}
                                            <span className='flex-grow-1 d-flex align-items-center justify-content-center'>
                                                {translate(languageData, checkbox.name)}
                                            </span>

                                            {/* Right side: checkbox */}
                                            <label className="custom-control custom-checkbox mb-1">
                                                <Form.Check
                                                    id={checkbox.id}
                                                    onChange={(e) => handleCheckChange(e, checkbox.id)}
                                                    name={checkbox.name}
                                                    checked={checkbox.checked}
                                                />
                                            </label>
                                        </div>
                                    ))}
                            </Col>


                            <Col xs={12} sm={12} md={4} className="mb-3 d-flex">
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

                            <Col xs={12} sm={12} md={4} className="mb-3 d-flex">
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


                            <Col xs={12} sm={12} md={4} className="mb-3 d-flex">
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

                        <ul className="d-flex gap-2">
                            {typeAnchors.map((type) => (
                                <li key={type}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        className="btn btn-light text-dark"
                                        onClick={() => handleRemoveTypeAnchor(type)}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <CloseIcon className="closeIcon" style={{ marginRight: '8px' }} fontSize="small" />
                                        {type}
                                    </Button>
                                </li>
                            ))}
                            {search?.doFollow ? <div>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    className="btn btn-light text-dark"
                                    onClick={handleRemoveTypeAnchor1}
                                >
                                    <CloseIcon className="closeIcon" style={{ marginRight: '8px' }} fontSize="small" />
                                    doFollow
                                </Button>
                            </div> : ""}
                            {search?.promotions && checkboxes.find((checkbox) => checkbox.id === search.promotions) ? (
                                <div>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        className="btn btn-light text-dark"
                                        onClick={() => handleRemovePromotion(search.promotions)}
                                    >
                                        <CloseIcon className="closeIcon" style={{ marginRight: '8px' }} fontSize="small" />
                                        Promotions
                                    </Button>
                                </div>
                            ) : ''}
                        </ul>
                    </Card.Body>
                </Card>
                <Card>

                    <Card.Body>
                        {listLoading ?
                            <div className="d-flex">
                                <img src={globalLoader} className='mx-auto mt-5' alt='loader1' />
                            </div> :

                            <DataTable columns={columns} data={data} />}
                    </Card.Body>

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

                <Modal
                    show={showOfferModal}
                    onHide={() => setShowOfferModal(false)}
                    size="xl"
                    className="w-100"
                >
                    <Modal.Header>
                        <div>
                            <h4>
                                {translate(languageData, "SelectionPortalOffer")}: <b>{selectedPublisherArticle?.portalLink}</b>
                            </h4>
                        </div>
                        <div className="form-group d-flex justify-content-center gap-2">
                            <div className="btn btn-outline-primary d-flex align-items-center" onClick={handleShowModal}>
                                <FaPlus style={{ cursor: "pointer" }} className="me-1" />{translate(languageData, "AddProject")}
                            </div>
                            <div>
                                <select name={translate(languageData, "artilstProject")} style={{ height: "45px" }} className="btn btn-primary" id="default-dropdown" data-bs-placeholder="Project" onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    setProject(selectedValue);
                                    if (selectedValue.trim() === '') {
                                        setError(
                                            <span className="text-danger">
                                                {translate(languageData, 'PleaseSelectYourProject')}
                                            </span>
                                        );
                                    } else {
                                        setError('');
                                    }
                                }} value={project}>
                                    <option label={translate(languageData, "artilstProject")}></option>
                                    {articlesData2?.map((item, index) => {
                                        return (
                                            <option value={item?.id} key={index}>{item?.name?.length > 10 ? item?.name?.slice(0, 10) + '...' : item?.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>

                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex jusify-content-between w-100 flex-wrap">
                        </div>
                        <div className="px-4">
                            <DataTable columns={modalColumns} data={modalTableData} />
                        </div>
                        {showCartOptions &&
                            <div>
                                <div className="d-flex justify-content-center flex-wrap">
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
                                    <Button

                                        className={`${articleType === translate(languageData, "UseArticle")
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                            }   rounded-0`}
                                        onClick={() => setArticleType(translate(languageData, "UseArticle"))}
                                    >
                                        {translate(languageData, "UseArticle")}
                                    </Button>
                                </div>
                                <div className="mt-5">
                                    <div>
                                        {articleType === translate(languageData, "SelectOwnArticle") &&
                                            <div>
                                                {/* <p className="fw-semibold ps-4">{translate(languageData, "sidebarContent")}</p> */}
                                            </div>}
                                        <div className="ps-4">

                                            {articleType === translate(languageData, "RequestArticleWriting") &&
                                                <div>
                                                    <Row className='justify-content-center'>
                                                        {articlePackages?.map((item, index) => {
                                                            return (
                                                                <Col xs={12} lg={3} onClick={() => handleOrderPriceCard(item.name, item.price, item.id)} key={index} className='rounded-pill d-flex justify-content-center'>
                                                                    <Card className={`shadow-md ${orderType === item?.name && "border border-primary border-2 shadow-lg"}`} style={{ cursor: "pointer", maxHeight: "200px", maxWidth: "250px" }}>
                                                                        <Card.Body className='text-center' style={{ marginTop: "-16px" }}>
                                                                            <h4 className={`${orderType === item.name ? "text-primary" : "text-outline-primary"}`}>{item.price}</h4>
                                                                            <div className=''><FaInfoCircle style={{ color: 'blue' }} size={10} /></div>
                                                                            <h6 className="text-bold">{cardLang == "en" ? item.name : item.polish_name} </h6>
                                                                            <Link className="text-dark">{cardLang == "en" ? item?.description : item?.polish_description}</Link>
                                                                            <div></div>
                                                                        </Card.Body>
                                                                        <div className={`d-flex justify-content-center align-items-center ${orderType === item.name ? "green" : "grey"}`} style={{ marginTop: '-94px' }}>
                                                                            <img src={orderType === item.name ? green : grey} alt="cardimg" />
                                                                        </div>
                                                                    </Card>
                                                                </Col>

                                                            )
                                                        })}

                                                    </Row>
                                                    <Row className='align-items-center mt-5'>
                                                        <Col xs={12} md={4}>
                                                            <span>{translate(languageData, "articleSubject")} </span>
                                                        </Col>
                                                        <Col xs={12} md={4} className="mt-3 mt-md-0">
                                                            <div className="form-check form-check-inline">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    id="weProvideSubjectCheckbox"
                                                                    checked={weProvideSubject}
                                                                    onChange={() => {
                                                                        setWeProvideSubject(!weProvideSubject);
                                                                        setProvideSubject(false);
                                                                    }}
                                                                />
                                                                <label className="form-check-label" htmlFor="weProvideSubjectCheckbox">
                                                                    {translate(languageData, "weProvideArticleSubject")}
                                                                </label>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} md={4} className="mt-3 mt-md-0">
                                                            <div className="form-check form-check-inline">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    id="provideSubjectCheckbox"
                                                                    checked={provideSubject}
                                                                    onChange={() => {
                                                                        setProvideSubject(!provideSubject);
                                                                        setWeProvideSubject(false);
                                                                    }}
                                                                />
                                                                <label className="form-check-label" htmlFor="provideSubjectCheckbox">
                                                                    {translate(languageData, "provideArticleSubject")}
                                                                </label>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    {/* Additional Fields based on checkbox state */}
                                                    {provideSubject && (
                                                        <Row className='align-items-center mt-5'>
                                                            <Col xs={12} md={4}>
                                                                <span>{translate(languageData, "writeSubject")} *</span>
                                                            </Col>
                                                            <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                                                    <input className="input100" type="text" name="title" placeholder={translate(languageData, "writeSubject")} style={{ paddingLeft: "15px" }} onChange={(e) => setProvideSubjectText(e.target.value)} value={provideSubjectText} />
                                                                </div>

                                                            </Col>
                                                        </Row>
                                                    )}

                                                    <Row className='align-items-center mt-5'>
                                                        <Col xs={12} md={4}>
                                                            <span>{translate(languageData, "writeSuggestion")} </span>
                                                        </Col>
                                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Suggestion is required">
                                                                <textarea
                                                                    className="input100"
                                                                    name="suggestion"
                                                                    placeholder={translate(languageData, "writeSuggestion")}
                                                                    style={{ paddingLeft: "15px", height: "200px" }}
                                                                    onChange={(e) => setSuggestion(e.target.value)}
                                                                    value={suggestion}
                                                                    maxLength={300}
                                                                />
                                                            </div>

                                                        </Col>
                                                    </Row>
                                                    {selectedMaxLinks && generateRows()}
                                                    <Row className='align-items-center mt-5'>
                                                        <Col xs={12} md={4}>
                                                            <span>{translate(languageData, "MessageforPublisher")} </span>
                                                        </Col>
                                                        <Col xs={12} md={8} className="mt-3 mt-md-0 mb-3">
                                                            <div className="wrap-input100 validate-input mb-0">
                                                                <input
                                                                    className="input100"
                                                                    value={publisherMsgText}
                                                                    type="text"
                                                                    name="message"
                                                                    placeholder={`${translate(languageData, "MessageforPublisher")}`}
                                                                    style={{ paddingLeft: "15px" }}
                                                                    onChange={(e) => setPublisherMsgText(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>

                                            }

                                            {articleType === translate(languageData, "AddNewArticle") &&
                                                <div>
                                                    <Row className='align-items-center mt-5'>
                                                        <Col xs={12} md={4}>
                                                            <span>{translate(languageData, "artilstTitle")} *</span>
                                                        </Col>
                                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                                                <input className="input100" type="text" name="title" placeholder={translate(languageData, "artilstTitle")} style={{ paddingLeft: "15px" }} onChange={(e) => setRequestArticleTitle(e.target.value)} value={requestArticleTitle} />
                                                            </div>

                                                        </Col>
                                                    </Row>
                                                    <Row className='align-items-center mt-5'>
                                                        <Col xs={12} md={4}>
                                                            <span>{translate(languageData, "PublicationDate")} </span>
                                                        </Col>
                                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                                                <input className="input100" type="date" name="date" placeholder={translate(languageData, "PublicationDate")} style={{ paddingLeft: "15px" }} onChange={(e) => setDate(e.target.value)} value={date} />
                                                            </div>

                                                        </Col>
                                                    </Row>
                                                    <Row className='align-items-start mt-5'>
                                                        <Col xs={12} md={4}>
                                                            <span>{translate(languageData, "AddArtiLead")} </span>
                                                        </Col>
                                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                            <div className="wrap-input100 validate-input mb-0">
                                                                <textarea className="input100 px-4" type="text" name="lead" cols={6} rows={8} placeholder={translate(languageData, "AddArtiLead")} onChange={(e) => setAddArtiLead(e.target.value)} value={addArtiLead} />
                                                            </div>
                                                            {addArtiLead?.length > selectedSubArticles?.maxLeadLength && (
                                                                <Alert variant="danger">
                                                                    {translate(languageData, "maxLeadLength")}: {selectedSubArticles?.maxLeadLength}
                                                                </Alert>
                                                            )}
                                                            <p className="text-end">{addArtiLead?.length}/{selectedSubArticles?.minLeadLength}-{selectedSubArticles?.maxLeadLength} Character</p>
                                                        </Col>
                                                    </Row>
                                                    <Row className='mt-4 pb-2'>
                                                        <Col xs={12} md={4} className='mt-2'>
                                                            <span>{translate(languageData, "sidebarContent")} *</span>
                                                        </Col>
                                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                            <div className="wrap-input100 validate-input mb-0">
                                                                <ReactQuill
                                                                    theme="snow"
                                                                    onChange={handleEditorChange}
                                                                    value={content}
                                                                    modules={modules}
                                                                    formats={formats}
                                                                    bounds={'.app'}
                                                                    placeholder={translate(languageData, "writeContent")}
                                                                />
                                                            </div>
                                                            {linkCount > 0 && linkCount > selectedMaxLinks && (
                                                                <Alert variant="danger">
                                                                    {translate(languageData, "Toomanylinks")}: {selectedMaxLinks}
                                                                </Alert>
                                                            )}
                                                            {content?.replace(/<[^>]*>/g, '').length > selectedSubArticles?.maxArticleLength && (
                                                                <Alert variant="danger">
                                                                    {translate(languageData, "maxArticleLength")}: {selectedSubArticles?.maxArticleLength}
                                                                </Alert>
                                                            )}
                                                            <p className="text-end">{content?.replace(/<[^>]*>/g, '').length}/{selectedSubArticles?.minArticleLength}-{selectedSubArticles?.maxArticleLength} Character</p>
                                                        </Col>
                                                    </Row>
                                                    <Row className='align-items-center'>
                                                        <Col xs={12} md={4}>
                                                            <span>{translate(languageData, "MessageforPublisher")} </span>
                                                        </Col>
                                                        <Col xs={12} md={8} className="mt-3 mt-md-0 mb-3">
                                                            <div className="wrap-input100 validate-input mb-0">
                                                                <input
                                                                    className="input100"
                                                                    value={publisherMsgText}
                                                                    type="text"
                                                                    name="message"
                                                                    placeholder={`${translate(languageData, "MessageforPublisher")}`}
                                                                    style={{ paddingLeft: "15px" }}
                                                                    onChange={(e) => setPublisherMsgText(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <div>
                                                        <Row className='align-items-center mt-5'>
                                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                                <span>{translate(languageData, "image")} *</span>
                                                            </Col>
                                                            <Col xs={12} sm={12} md={1} lg={1}>
                                                                {imageSource && (
                                                                    <div>
                                                                        <img src={imageSource.previewUrl} alt="Selected" />
                                                                    </div>
                                                                )}
                                                            </Col>
                                                            <Col xs={12} sm={12} md={2} lg={2} className="mt-3 mt-md-0">
                                                                <div>
                                                                    <FileUpload allowedFileExtensions={allowedImageExtension} getData={handleFiles} name="image" buttonName={translate(languageData, "uploadImage")} />
                                                                </div>
                                                            </Col>
                                                            <Col md={2} sm={12} lg={2}>{translate(languageData, "orselectviapixabay")}</Col>

                                                            <Col xs={12} sm={12} md={3} lg={3} className='mt-3 mt-md-0'>
                                                                <PixabayImageSearch onSelectImage={handlePixabayImageSelect} />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>

                                            }

                                            {articleType === translate(languageData, "UseArticle") &&
                                                <div>
                                                    <Row className='align-items-center '>
                                                        <Col xs={12} md={4}>
                                                            <span>{translate(languageData, "choosearticle")} *</span>
                                                        </Col>
                                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                            <div className="form-group">
                                                                <select name="project" className="input100 px-3" id="default-dropdown" onChange={(e) => setAddNewArticleProjectDropdown(e.target.value)} onClick={() => validate(formValues)}>
                                                                    <option className="input100" label={translate(languageData, "ArticleList")}></option>
                                                                    {useArticleList?.filter((item) => item?.cart !== 'Yes' && item?.status !== 'Paid')?.map((item, index) => {
                                                                        return (
                                                                            <option className="input100" value={item.id} key={index}>{item.title}</option>
                                                                        )
                                                                    })}

                                                                </select>
                                                            </div>
                                                            <div className='text-danger text-center mt-1'>{formErrors.project}</div>
                                                        </Col>
                                                    </Row>
                                                    <Row className='align-items-center mt-5'>
                                                        <Col xs={12} md={4}>
                                                            <span>{translate(languageData, "artilstTitle")} *</span>
                                                        </Col>
                                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                                                <input className="input100" type="text" name="title" placeholder={translate(languageData, "artilstTitle")} style={{ paddingLeft: "15px" }} onChange={(e) => setRequestArticleTitle(e.target.value)} value={requestArticleTitle} />
                                                            </div>

                                                        </Col>
                                                    </Row>

                                                    <Row className='align-items-center mt-5'>
                                                        <Col xs={12} md={4}>
                                                            <span>{translate(languageData, "PublicationDate")} </span>
                                                        </Col>
                                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                                                <input className="input100" type="date" name="date" placeholder={translate(languageData, "PublicationDate")} style={{ paddingLeft: "15px" }} onChange={(e) => setDate(e.target.value)} value={date} />
                                                            </div>

                                                        </Col>
                                                    </Row>
                                                    <Row className='align-items-start mt-5'>
                                                        <Col xs={12} md={4}>
                                                            <span>{translate(languageData, "AddArtiLead")} </span>
                                                        </Col>
                                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                            <div className="wrap-input100 validate-input mb-0">
                                                                <textarea className="input100 px-4" type="text" name="lead" cols={6} rows={8} placeholder={translate(languageData, "AddArtiLead")} onChange={(e) => setAddArtiLead(e.target.value)} value={addArtiLead} />
                                                            </div>
                                                            {addArtiLead?.length > selectedSubArticles?.maxLeadLength && (
                                                                <Alert variant="danger">
                                                                    {translate(languageData, "maxLeadLength")}: {selectedSubArticles?.maxLeadLength}
                                                                </Alert>
                                                            )}
                                                            <p className="text-end">{addArtiLead?.length}/{selectedSubArticles?.minLeadLength}-{selectedSubArticles?.maxLeadLength} Character</p>
                                                        </Col>
                                                    </Row>
                                                    <Row className='mt-4 pb-2'>
                                                        <Col xs={12} md={4} className='mt-2'>
                                                            <span>{translate(languageData, "sidebarContent")} *</span>
                                                        </Col>
                                                        <Col xs={12} md={8} className="mt-3 mt-md-0">
                                                            <div className="wrap-input100 validate-input mb-0">
                                                                <ReactQuill
                                                                    theme="snow"
                                                                    onChange={handleEditorChange}
                                                                    value={content}
                                                                    modules={modules}
                                                                    formats={formats}
                                                                    bounds={'.app'}
                                                                    placeholder={translate(languageData, "writeContent")}
                                                                />
                                                            </div>
                                                            {linkCount > 0 && linkCount > selectedMaxLinks && (
                                                                <Alert variant="danger">
                                                                    {translate(languageData, "Toomanylinks")}: {selectedMaxLinks}
                                                                </Alert>
                                                            )}
                                                            {content?.replace(/<[^>]*>/g, '').length > selectedSubArticles?.maxArticleLength && (
                                                                <Alert variant="danger">
                                                                    {translate(languageData, "maxArticleLength")}: {selectedSubArticles?.maxArticleLength}
                                                                </Alert>
                                                            )}
                                                            <p className="text-end">{content?.replace(/<[^>]*>/g, '').length}/{selectedSubArticles?.minArticleLength}-{selectedSubArticles?.maxArticleLength} Character</p>
                                                        </Col>
                                                    </Row>
                                                    <Row className='align-items-center'>
                                                        <Col xs={12} md={4}>
                                                            <span>{translate(languageData, "MessageforPublisher")} </span>
                                                        </Col>
                                                        <Col xs={12} md={8} className="mt-3 mt-md-0 mb-3">
                                                            <div className="wrap-input100 validate-input mb-0">
                                                                <input
                                                                    className="input100"
                                                                    value={publisherMsgText}
                                                                    type="text"
                                                                    name="message"
                                                                    placeholder={`${translate(languageData, "MessageforPublisher")}`}
                                                                    style={{ paddingLeft: "15px" }}
                                                                    onChange={(e) => setPublisherMsgText(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <div>
                                                        <Row className='align-items-center mt-5'>
                                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                                <span>{translate(languageData, "image")} *</span>
                                                            </Col>
                                                            <Col xs={12} sm={12} md={1} lg={1}>
                                                                {imageSource && (
                                                                    <div>
                                                                        <img src={imageSource.previewUrl} alt="Selected" />
                                                                    </div>
                                                                )}
                                                            </Col>
                                                            <Col xs={12} sm={12} md={2} lg={2} className="mt-3 mt-md-0">
                                                                <div>
                                                                    <FileUpload allowedFileExtensions={allowedImageExtension} getData={handleFiles} name="image" buttonName={translate(languageData, "uploadImage")} />
                                                                </div>
                                                            </Col>
                                                            <Col md={2} sm={12} lg={2}>{translate(languageData, "orselectviapixabay")}</Col>

                                                            <Col xs={12} sm={12} md={3} lg={3} className='mt-3 mt-md-0'>
                                                                <PixabayImageSearch onSelectImage={handlePixabayImageSelect} />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            }
                                            <div>
                                                <Row align-items-center className="mt-4">
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

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className='align-items-center'>
                            <Col lg={3} xs={12}>
                                {translate(languageData, "NameOfTheProject")} *
                            </Col>
                            <Col lg={8} xs={12}>
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    <input className="input100" type="text" name="projectName" placeholder={translate(languageData, "ProjectName")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues1)} />
                                </div>
                                <div className='text-danger text-center mt-1'>{formErrors.projectName}</div>
                            </Col>
                        </Row>
                        <Row className='align-items-center mt-3'>
                            <Col lg={3} xs={12}>
                                {translate(languageData, "WebAddress")} *
                            </Col>
                            <Col lg={8} xs={12}>
                                <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                    <input className="input100" type="text" name="webAddress" placeholder={translate(languageData, "WebAddress")} style={{ paddingLeft: "15px" }} onChange={(e) => handleChange(e)} onKeyDown={() => validate(formValues1)} />
                                </div>
                                <div className='text-danger text-center mt-1'>{formErrors.webAddress}</div>
                            </Col>
                        </Row>
                        <Row className='align-items-center mt-3'>
                            <Col lg={3} xs={12}>
                                {translate(languageData, "publicationLanguage")} *
                            </Col>
                            <Col lg={8} xs={12}>
                                <Select1 options={languagesOpts} name='publicationLang' styles={{ control: (provided) => ({ ...provided, borderColor: '#ecf0fa', height: '45px', }) }} onChange={handleSelectChange1} />
                                <div className='text-danger text-center mt-1'>{formErrors.publicationLang}</div>
                            </Col>

                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                {translate(languageData, "close")}
                            </Button>
                        </div>
                        <div className=''>
                            <Button className='btn btn-primary btn-w-md mx-auto' onClick={() => addProjectService()}>{loading ? <img src={globalLoader} width={20} /> : translate(languageData, "Save")} </Button>
                        </div>
                    </Modal.Footer>
                </Modal>

            </div>
        </>
    );
};

export default BuyArticles;
