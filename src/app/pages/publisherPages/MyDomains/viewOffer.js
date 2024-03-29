import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import globalLoader from '../../../../assets/images/loader.svg'
import { translate } from '../../../../utility/helper'
import { useLanguage } from '../../../Context/languageContext'
import DataTable from 'react-data-table-component'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Col, InputGroup, Row } from 'react-bootstrap'
import { viewOffer } from '../../../../services/PublisherServices/MyOfferServices/MyofferServices'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEye, FaEdit } from 'react-icons/fa'
import { useLocation } from 'react-router-dom';
const ViewOffer = () => {

    const publisherData = JSON.parse(localStorage.getItem('publisherData'))
    const accessToken = localStorage.getItem('publisherAccessToken');
    const { languageData } = useLanguage()
    const navigate = useNavigate();
    const [offerList, setOfferList] = useState([])
    const [loading, setLoading] = useState(false)
    const [isDataPresent, setIsDataPresent] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const domainUrl = queryParams.get('domain');

    useEffect(() => {
        ViewOfferListServices()
    }, [])

    const ViewOfferListServices = async () => {
        setLoading(true)
        const res = await viewOffer(domainUrl, accessToken)
        if (res.success === true) {
            setOfferList(res?.data)
            setIsDataPresent(res.data.length > 0);
            setLoading(false)
        } else {
            setIsDataPresent(false);
            setLoading(false);
        }
    }

    const tableData = offerList
        ?.filter((item) =>
            (item?.url && item?.url.toLowerCase().includes(searchTerm.toLowerCase())) ||
            ((typeof item?.our_price === 'number' ? item?.our_price.toString() : item?.our_price) &&
                (typeof item?.our_price === 'number' ? item?.our_price.toString().toLowerCase().includes(searchTerm.toLowerCase()) : item?.our_price)) ||
            ((typeof item?.lead_length === 'number' ? item?.lead_length.toString() : item?.lead_length) &&
                (typeof item?.lead_length === 'number' ? item?.lead_length.toString().toLowerCase().includes(searchTerm.toLowerCase()) : item?.lead_length)) ||
            ((typeof item?.article_max_length === 'number' ? item?.article_max_length.toString() : item?.article_max_length) &&
                (typeof item?.article_max_length === 'number' ? item?.article_max_length.toString().toLowerCase().includes(searchTerm.toLowerCase()) : item?.article_max_length)) ||
            ((typeof item?.article_min_length === 'number' ? item?.article_min_length.toString() : item?.article_min_length) &&
                (typeof item?.article_min_length === 'number' ? item?.article_min_length.toString().toLowerCase().includes(searchTerm.toLowerCase()) : item?.article_min_length)) ||
            (item?.contact_email && typeof item?.contact_email === 'string' && item?.contact_email.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .map((item) => {
            return {
                url: item?.url,
                our_price: item?.our_price,
                client_price: item?.client_price,
                language: item?.language,
                id: item?.id,
                articleMaxLength: item?.article_max_length ? item?.article_max_length : 0,
                articleMinLength: item?.article_min_length ? item?.article_min_length : 0,
                leadLength: item?.lead_length ? item?.lead_length : 0,
                contactEmail: item?.contact_email,
                status: item?.status,
            };
        });



    const columns = [
        {
            name: translate(languageData, "domainName"),
            selector: row => `${row?.url}`,
            sortable: true,
            wrap: true
        },
        {
            name: translate(languageData, "ourPrice"),
            selector: row => `${row.our_price} zł`,
            sortable: true,
        },
        {
            name: translate(languageData, "leadLength"),
            selector: row => `${row.leadLength}`,
            sortable: true,
        },
        {
            name: translate(languageData, "Language"),
            selector: row => `${row.language}`,
            sortable: true,
        },
        {
            name: translate(languageData, "articleMinLength"),
            selector: row => `${row.articleMinLength}`,
            sortable: true,
        },
        {
            name: translate(languageData, "articleMaxLength"),
            selector: row => `${row.articleMaxLength}`,
            sortable: true,
        },
        // {
        //     name: translate(languageData, "BuyArticleEmail"),
        //     selector: row => `${row.contactEmail}`,
        //     sortable: true,
        //     wrap: true
        // },
        {
            name: translate(languageData, "artilstStatus"),
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => {
                let buttonClass = "text-primary";
                let buttonText = "";

                switch (row.status) {
                    case "Deactive":
                        buttonClass = "text-danger";
                        buttonText = <h6>{translate(languageData, "deactive")}</h6>;
                        break;
                    case "Active":
                        buttonClass = "text-primary";
                        buttonText = <h6>{translate(languageData, "active")}</h6>;
                        break;

                    default:

                        buttonText = row.status;
                }

                return (
                    <span className={`${buttonClass}`}>
                        {buttonText}
                    </span>
                );
            },
        },
        // {
        //     name: translate(languageData, 'writingAction'),
        //     cell: (row) => (
        //         <div className='d-flex gap-2'>
        //             <OverlayTrigger
        //                 placement="top"
        //                 overlay={<Tooltip id="tooltip">{translate(languageData, "editOffer")}</Tooltip>}
        //             >
        //                 <Link to={`/publisher/updateOffer/${row.id}`}>
        //                     <FaEdit className='icon-link' />
        //                 </Link>
        //             </OverlayTrigger>
        //             <OverlayTrigger
        //                 placement="top"
        //                 overlay={<Tooltip id="tooltip">{translate(languageData, "viewAllOffer")}</Tooltip>}
        //             >
        //                 <Link to={`/publisher/viewOffer/${row.id}`}>
        //                     <FaEye className='icon-link' />
        //                 </Link>
        //             </OverlayTrigger>
        //         </div >
        //     ),
        // },

    ]

    return (
        <div className='p-4'>

            <h3 className='mt-3 mb-3 text-center'>{translate(languageData, "viewOffer")}</h3>

            <div className='mt-5 w-100'>
                <div className='my-4'>
                    <Row className='flex justify-content-between'>
                        <Col xs={12} sm={6} md={4} >
                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                <input className="input100" type="search" name="search" placeholder={translate(languageData, "artilstSearch")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="zmdi zmdi-search" aria-hidden="true"></i>
                                </span>
                            </div>
                        </Col>
                        {/* <Col xs={12} sm={6} md={4}>
                            <div className="d-flex justify-content-end">
                                <Link onClick={() => navigate("/publisher/myOffer/0")}><Button>{translate(languageData, "addOffer")}</Button></Link>
                            </div>
                        </Col> */}
                    </Row>
                </div>
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

        </div>
    )
}

export default ViewOffer