import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import globalLoader from '../../../../assets/images/loader.svg'
import { translate } from '../../../../utility/helper'
import { useLanguage } from '../../../Context/languageContext'
import DataTable from 'react-data-table-component'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Col, Row } from 'react-bootstrap'
import { listoffer } from '../../../../services/PublisherServices/MyOfferServices/MyofferServices'
const OfferList = () => {

    const publisherData = JSON.parse(localStorage.getItem('publisherData'))
    const { languageData } = useLanguage()
    const navigate = useNavigate();
    const [offerList, setOfferList] = useState([])
    const [loading, setLoading] = useState(false)
    const [isDataPresent, setIsDataPresent] = useState(true);
    useEffect(() => {
        offerListServices()
    }, [])

    const offerListServices = async () => {
        setLoading(true)
        const res = await listoffer(publisherData?.user?.id)
        if (res.success === true) {
            setOfferList(res?.data)
            setIsDataPresent(res.data.length > 0);
            setLoading(false)
        } else {
            setIsDataPresent(false);
            setLoading(false);
        }
    }

    const tableData = offerList?.map((item) => {
        return {
            url: item?.url,
            our_price: item?.our_price,
            client_price: item?.client_price,
            language: item?.language,
            id: item?.id,
            articleMaxLength: item.article_max_length? item.article_max_length: 0,
            articleMinLength: item.article_min_length? item.article_min_length: 0,
            leadLength: item.lead_length?item.lead_length: 0,
            contactEmail: item?.contact_email
        }
    })

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
        {
            name: translate(languageData, "BuyArticleEmail"),
            selector: row => `${row.contactEmail}`,
            sortable: true,
            wrap: true
        },

    ]

    return (
        <div className='p-4'>

            <h3 className='mt-3 mb-3 text-center'>{translate(languageData, "listOffer")}</h3>

            <div className='mt-5 w-100'>
                <div className='my-4'>
                    <Row className='flex justify-content-between'>
                        <Col xs={12} sm={6} md={4} >
                            <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                <input className="input100" type="text" name="search" placeholder={translate(languageData, "artilstSearch")} />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="zmdi zmdi-search" aria-hidden="true"></i>
                                </span>
                            </div>
                        </Col>
                        <Col xs={12} sm={6} md={4}>
                            <div className="d-flex justify-content-end">
                                <Link onClick={() => navigate("/publisher/myOffer")}><Button>{translate(languageData, "addOffer")}</Button></Link>
                            </div>
                        </Col>
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

export default OfferList