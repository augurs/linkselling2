import React, { useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { getArticles } from '../../../services/articleServices/articleServices'
import DataTable from 'react-data-table-component'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../Context/languageContext'
import { translate } from '../../../utility/helper'

const ArticleInProgress = () => {


    const navigate = useNavigate();

    const [articleList, setArticleList] = useState([])

    const { languageData } = useLanguage()




    useEffect(() => {
        handleArticleList()
    }, [])

    const columns = [

        {
            name: (
                <div>
                    <div>{translate(languageData , "TitleOfArticle")}</div>
                    <div className='text-muted fw-normal lh-1'>{translate(languageData , "SidebarMyProject")}</div>
                    <div className='text-muted fw-normal lh-1'>{translate(languageData , "PublisherPortal")}</div>
                </div>
            ),
            selector: row => row.title,
            cell: (row) => (
                <div>
                    <Link to={`http://${row.title}`} target="_blank" style={{ textDecoration: "underline" }}>
                        {row.title}
                    </Link>
                    <div className='text-muted' style={{ fontSize: "14px" }}>{row.title2}</div>
                </div>
            ),
            sortable: true,
            width: "250px",
            style: {

                width: "250px"
            },


        },
        {
            name: translate(languageData , "Views"),
            selector: row => row.view,
            sortable: true,
            width: "250px",
            style: {

                width: "250px"
            },


        },
        {
            name: (
                <div>
                    <div>{ translate(languageData , "DeadlineForPublication")}</div>
                    <div className='text-muted fw-normal lh-1'>{translate(languageData , "DeadlineForWriting")}</div>
                </div>
            ),
            selector: row => row.deadline,
            cell: (row) => (
                <div>
                    <div target="_blank">
                        {row.deadline}
                    </div>
                    <div className='text-muted' style={{ fontSize: "12px!important" }}>{row.deadline2}</div>
                </div>
            ),
            sortable: true,
            width: "250px",
            style: {

                width: "250px"
            },


        },
        {
            name: (
                <div>
                    <div>{translate(languageData , "artilstStatus")}</div>
                    <div className='text-muted fw-normal lh-1'>{ translate(languageData , "CurrentStatus")}</div>
                </div>
            ),
            selector: row => row.status,
            sortable: true,
            cell: row => <div className='mt-2 mb-2'>
                <div> <button className='btn btn-pill btn-outline-primary' style={{ fontSize: "12px" }}>Waiting for content</button></div>
                <div> <button className='btn btn-pill btn-outline-primary mt-1' style={{ fontSize: "12px" }} >New</button></div>
            </div>,
            width: "250px",
            style: {

                width: "250px"
            },


        },
        {
            name: (
                <div>
                    <div>{translate(languageData , "ArtilistPublicationCost")}</div>
                    <div className='text-muted fw-normal lh-1'>{translate(languageData , "WritingCostNet")}</div>
                </div>
            ),
            selector: row => row.cost,
            cell: (row) => (
                <div>
                    <div target="_blank">
                        {row.cost}
                    </div>
                    <div className='text-muted' style={{ fontSize: "12px!important" }}>{row.cost2}</div>
                </div>
            ),
            sortable: true,

            width: "250px",
            style: {

                width: "250px"
            },
        },
        {

            cell: row => <div className='mx-2'>
                <div><button className='btn btn-primary mt-1' style={{ fontSize: "12px" }} onClick={() => navigate('/articleDetails')}>Details</button></div>
                <div><button className='btn btn-primary mt-1' style={{ fontSize: "12px" }}>Submit for verification</button></div>
            </div>,
            width: "250px",
            style: {

                width: "250px"
            },

        },
    ];

    const data = [
        {
            title: "(brak tytułu)",
            title2: "meskiswiat.pl",
            view: "-",
            deadline: "07/09/23",
            deadline2: "07/09/23",
            cost: "103,50 zł",
            cost2: "0.00 zł"



        }
    ]


    const userData= JSON.parse(localStorage.getItem("userData"));

    const handleArticleList = async () => {
        const res = await getArticles(userData?.id)
        setArticleList(res.data)
    }

    const status = [
        translate(languageData , "All"),
        translate(languageData , "WaitingForContent"),
        translate(languageData , "PublisherWrites"),
        translate(languageData , "PublisherWrites"),
        translate(languageData , "ComplainToPublisher"),
        translate(languageData , "PublicationInProgress"),
        translate(languageData , "PublicationOverdue"),
        translate(languageData , "PublisherComments"),
        translate(languageData , "PublishedInVerification"),
        translate(languageData , "AdvertisersComments")

    ]


    return (
        <div className='p-4'>
            <div><h3 className='semi-bold mt-1'>{translate(languageData , "InProgressArticles")}</h3></div>
            <div className=' mt-4'>
                <Row>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="project" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country">
                                <option label={translate(languageData , "artilstProject")}></option>
                                {articleList.map((item, index) => {
                                    return (
                                        <option value={item.project} key={index}>{item.project}</option>

                                    )
                                })}
                            </select>
                        </div>

                    </Col>
                    <Col xs={12} sm={6} md={4} className='mb-3'>
                        <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                            <input className="input100" type="text" name="search" placeholder={translate(languageData , "EnterNameTitle")} />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="zmdi zmdi-search" aria-hidden="true"></i>
                            </span>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="status" style={{ height: "45px" }} className=" form-select" id="default-dropdown" data-bs-placeholder="Select Status">
                                <option label={translate(languageData , "artilstStatus")}></option>
                                {status.map((item, index) => {
                                    return (
                                        <option value={item} key={index}>{item}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className='border border-muted d-flex align-items-center bg-white mb-3' style={{ height: "45px" }}>
                            <label className="custom-control custom-checkbox mx-auto d-flex mt-1">
                                <Form.Check
                                    id='checkguarantee'
                                    className='pe-2'
                                />
                                <span className='mt-1'> {translate(languageData , "36MonthGuarantee")}</span>
                            </label>
                        </div>

                    </Col>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className='border border-muted d-flex align-items-center bg-white' style={{ height: "45px" }}>
                            <label className="custom-control custom-checkbox mx-auto d-flex mt-1">
                                <Form.Check
                                    id='checkguarantee'
                                    className='pe-2'
                                />
                                <span className='mt-1'> {translate(languageData , "PromotionOnFacebook")}</span>

                            </label>
                        </div>
                    </Col>

                </Row>


            </div>
            <div className='mt-5'>
                {/* {loading ?
                    <div className='d-flex justify-content-between align-items-center'>
                        <img src={globalLoader} className='mx-auto' />
                    </div> : */}
                <DataTable
                    // selectableRowsComponent={Checkbox}
                    columns={columns}
                    data={data}
                    customStyles={{
                        rows: {
                            style: {
                                fontSize: '14px',
                            },
                        },
                    }}
                // selectableRows
                // selectableRowsHighlight
                // selectableRowsHeader
                // selectableRowsHeaderComponent={checkboxHeader}

                />
            </div>
        </div>
    )
}

export default ArticleInProgress