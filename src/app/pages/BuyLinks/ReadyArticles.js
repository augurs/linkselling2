import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Dropdown, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { getArticles } from '../../../services/articleServices/articleServices'
import DataTable from 'react-data-table-component'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../Context/languageContext'
import { translate } from '../../../utility/helper'

const ReadyArticles = () => {


    const navigate = useNavigate();

    const [articleList, setArticleList] = useState([])
    const [showIndexationModal, setShowIndexationModal] = useState(false)

    const { languageData } = useLanguage()

    useEffect(() => {
        handleArticleList()
    }, [])

    const columns = [

        {
            name: (
                <div className='mt-1 mb-2'>
                    <div>{translate(languageData, "TitleOfArticle")}</div>
                    <div className='text-muted fw-normal'>{translate(languageData, "SidebarMyProject")}</div>
                    <div className='text-muted fw-normal'>{translate(languageData, "PublisherPortal")}</div>
                </div>
            ),
            selector: row => row.title,
            cell: (row) => (
                <div className='mt-2 mb-2'>
                    <Link to={`http://${row.title}`} target="_blank" style={{ textDecoration: "underline" }}>
                        {row.title}
                    </Link>
                    <div className='text-muted' style={{ fontSize: "14px" }}>{row.title2}</div>
                    <div className='d-flex mt-1'>
                        <Link to={"https://twitter.com"} target="_blank">
                            <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAZlBMVEX////u7u5BZ7Lt7e329vb39/f+/v7v7+9EarTq6ur3+Pvq6+0+ZbHn5+dffbw2YK9UdbicrNMrWa3Cy+MjVat0jMPx8/k+Y6vIz9+EmMaKnsvW3OzH0OVJbrYwXK3e4++pttZng7/z+NIUAAAGOklEQVRoge2bb3ejKhDGJSBIKkm2bWLbbLK93/9LXv4rOAjiTW/P2c6+yJki8xNj5gGGbZA23DbGrEuMR8NWykCXgK1RqAaHbvMD/gE/DIyN+auNS0LXkSKXBRdHrXEoHLpNa4xYg912sbWqr+MTe0Ohi9zdWZf6ViQwZhRsbcO+81CIjyDZbL6C0GX+auN6MBNcoBEctFp3vEvj+lCMC+7dtWDZl1eCke5bCdb3XAnmQmCUA4/PJwiN9D3XgbHpWwVukR5wFZjavhNw/Faj+VttQlNKBBrdqNWAw5/A+FbT1vZFNr+gMN0g9zOLUpUaF+cCm5hx5kLBxXFkeTtMCOFuL5EyWzCWIsn3qjplqncyk6uTYPlu4Fow5xxXg+Vd14uEfNAb1AlvUCf8V8siAa11Uha48EUJa+GrnOv5K2URSCCRLC6HyshiIlcTMEeWymLg/p1gmYOrwTKfpcBtDow55kkwYtoc2Lq+Vc6iOItmDTkw1aZiqRFbX8UyY1JOQ8mTNrw3djHuk3VVq+Cjiwljtq+OPIYaI89kkQWuzFyMvL2fulV2+rg2qUTmQbmUydj59divsl1/fD3TjUsYxnbHXYUdd3QbmJyruJJ8btgGcPP2Wsfd7V6vm8DvlQOWQ/4gy+BIFgPxovtTnwrcZcD9qWy1CBlhT10K3N0y5OFm14fhhzfHB+bVci4qUuDulgEPQ7cPIhfLolrT4eSIu1tmvEM/guGUmQDL8XKeetRyuGa8PmfE2GqwWtPJtA+DVVpUn8fn/qTtNuOqq+pGLNTaCgZbbn//uBpVoC/PEXlXC24XwJ15sfrd1fVtIvBQBDZqRZ3EakfOBOVUThqeg93v6P6ngcGDu3DfTCMjC3LS3pgP1Nq/qz/L9SAx3n4Otu/V/bNZBvfdk4lsQ1EWulDKlAsz64Jg/fHaJMBuwAq8OlfjBbDJlf05BXZWBfbNEFjb8dcU/Pt/AF/1ZAe46tHgf45qrgNckQUvyWICLHPk3YEPRyBlWjAqkUV45/MCPsTT4XD6tN3PB2mQavcdASMXbaIiMGU+/24ig97qXa0sKg/O1RAYEGcHbjleIxIReBgWwXdAnx2YcUOuA+9y4PmQ/xvwhLv2UZNNjzr3Hc+vKpZFNpFFKV7GA2RRCtPL/nKxUZuLtP3LHQbPBddHdrLI2kC8mBGvRAK5ycnOpwWfb/OpjzYni3BkWBZzKVOmKp8yD9Bkz4EfmasPqRn/D/j7gCtksRS8LIsJ1bLeFvAFElrilo2eXy6LFkyXwUuymK0tptfHx1+0zYBvqZQp16GiKleXgbsUGHGRLWougZe/YznzTIGF4NnaYgo8DBmwxHYJdeIltcVasF7HwmDKXG0RWi16t/JRW/A0lNtEbRlPrxb9mi6RQOQEbAksH7Nc2fUdDpeHdh3qZHK50gaB9bxvAdyZHQMoZar9nLISHwA2800JNtsQM3BnJ5wAmKut+GqRMOC+M9su8zWE3xACR1xaW0yKRGqjSTbYeRCoTsW1xTQ4aw+SxSJw2Wox2j91sljLlW9ZvG1auomqLb1tnB3xATqcUFpbJB/1G+XvYah1JT52rS8NvG0CN7YYAqwGMwM+k9LaIlM6OSvxUV3+6daCjx2LS41JsD6EM68tUlXw2sH702ORa5D/nKsLXmrzsmzEyCygw2Z919eP021Vie/w/kbYWMZF9luzkZEF28/WCrN1iXVVcZIRRGy90hYzI/diXWxbVRnU9J2GiiKvOo7hxTt0x3pg0BqG+j7HI3/AXwaOZDEoCNKodc2RG1p45CY6IKM+1P7MwqmaNrg4OlQj+0atcSTPn8miXuNYd/WRm0nf1bKoa23+at1afABFn72sO/miaqkczKAFYNO3ChydF10HFqZv3YjDNd0qMOGmbw24ZUIAYLQIRu60pu1bKosTn7byapUOWNjKKOi2U1f1ZWzeOu4IWHc+r0aqtmi8ecZAwSnFWQKZ9J0nEP1IF1OmEOlzmYAbpEzf96tzta9LfluR+PvAS7L4JSdRw73OeOcTrkDCrWUXe/5MFgEtS8giCVuz/0EjI4va3NWmaFV3LpMHp/XXHQi1nevAYn2JbwIWG8CiHrztUa+vLcaS8sBDvwh2H3Do918J/5H+8tZ8vwAAAABJRU5ErkJggg==' width="25" />
                        </Link>
                        <Link to="https://facebook.com" target="_blank">
                            <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAB8CAMAAACcwCSMAAAAYFBMVEX///9VrO+gze5Vre5MqO6ezu5Mqe3///3n8veUxurC3vNRq/Dw9/plsedPq+3i8fen0vBDouiKwurz/f7S6fdstup8u+thr+mby/Ha7PV/vOi02O+LyO+v1vTL5PNYrOmzqLdFAAADPUlEQVRoge2aa5ebIBCGVQigeCMardlu/P//ssAmbSKooUxOtj3z7n7KOfAw3OYiSYJCoVAoFAqFQv3r4vpPFG0WpUPWFsJ2FcbmvMxrRillUaK0zssklJ40FU2NyN/Ltk9p1YRaXl7ZAJJVGWh4DsbWtudhbHGbNACRlIggeMEkGFymtAha9RZw1vW8t0H7PWOg8EPQtB9gLQ+DZwxuw1l42LQjHOEIR/i3gRP7/xa4VEZ/fLDrjAHg0jseyY5F04m+PSkp7VBOr4B7IytZTTrStW36gUpWn6cDXbaNhsvR52dl1XEj0znnRfWjSaYa3nJ5Nl5++Ws93YJya74ZxCidRY+G00z//KEef9bx0VK5Ov0En3b6aYy7sAe7Zics5SLphmVjCLhRc7pbeHnmy045F9WLpt30ntXsdqVcB/Ro+fiCcy6H256azvRqveqdTvnsCfjjz3nd2c5NAjsdFaV68VXjNCyVywaAs/ZugfklGypSu/lnozyJFsANp7o7+Ne15uy3pFeeSzgePpNFqmsvtWWnH747OBrOCtE/zrJrtmn4Erg5al7c/XASfvZltwCOxbiPPXo5+hwvwG7v99B6bI3vpAHA5fBEB5/e7BbgqNHLbjM+eAsa8XAiZ7FTz+PCDSSALNd7btpptlJNAYlepco360qdx6OBWT4I0a234fp6ex08ZVvTrq/a2R9dA037aasPvlo/g8lYaL6y342TEd4LBg6e0qP3krUhRrXGBsvV2Nj7+tH043rpDgauoxTJTm3nms51MrWaWwLAie1d0rFwyAnfLJFDWF6brx5D4ew548Y3y6XxkYxS1Tm7lL/jtztNI92sz0fDD537ncYMgidlvnKxwcHrsRWefcZFNu9WqCH8ORmKR7/Cy8uR0J2CDAxcHzPKqmN7mUTXdU1fZANRcpcMA7eSkqqr2N5Sg8O/piC1n+yeLlj9v0VAhCMc4QgPhsOhCTHwAHrm1Jdj4QGWt7DwsI/3BSBcr/ky3t2WgGSnddiDjbc+VeFl9VSAtCtingiFPtJJmgrotNEx+HlSYh5mUQDVeelWaJ9Q9JO0zD5JC38U9g1kk/4ovXPsKBQKhUKhUKgX6BesaDYk30hDNAAAAABJRU5ErkJggg==' width="25" />
                        </Link>
                    </div>
                </div>
            ),
            sortable: true,
            width: "250px",
            style: {

                width: "250px"
            },


        },
        {
            name: translate(languageData, "Views"),
            selector: row => row.publicationStatus,
            cell: row => <button className='btn btn-primary' style={{ fontSize: "12px", width: "20px" }}>100</button>,
            sortable: true,
            width: "250px",
            style: {

                width: "250px"
            },


        },
        {
            name: translate(languageData, "PublicationStatus"),
            selector: row => row.publicationStatus,
            cell: row => <button className='btn btn-pill btn-outline-primary' style={{ fontSize: "12px" }}>Correct</button>,
            sortable: true,
            width: "250px",
            style: {

                width: "250px"
            },


        },
        {
            name: translate(languageData, "ArticleIndexationStatus"),
            // selector: row => row.indStatus,
            cell: (row) => (
                <button className='btn btn-pill btn-outline-primary' style={{ fontSize: "12px" }}>OK</button>
            ),
            sortable: true,
            width: "250px",
            style: {

                width: "250px"
            },


        },
        {
            name: translate(languageData, "DeadlineForPublication"),
            selector: row => row.deadline,
            sortable: true,
            // cell: row => <div className='mt-2 mb-2'>
            //     <div> <button className='btn btn-pill btn-outline-primary' style={{ fontSize: "12px" }}>Waiting for content</button></div>
            //     <div> <button className='btn btn-pill btn-outline-primary mt-1' style={{ fontSize: "12px" }} >New</button></div>
            // </div>,
            width: "250px",
            style: {

                width: "250px"
            },


        },
        {
            name: translate(languageData , "PublicationDate"),
            selector: row => row.deadline2,
            // cell: (row) => (
            //     <div>
            //         <div target="_blank">
            //             {row.cost}
            //         </div>
            //         <div className='text-muted' style={{ fontSize: "12px!important" }}>{row.cost2}</div>
            //     </div>
            // ),
            sortable: true,

            width: "250px",
            style: {

                width: "250px"
            },
        },
        {
            name: (
                <div className='mt-1 mb-2'>
                    <div>{translate(languageData, "ArtilistPublicationCost")}</div>
                    <div className='text-muted fw-normal'>{translate(languageData, "WritingCostNet")}</div>
                </div>
            ),

            cell: row => <div >
                <div className=''>140,00 zł</div>
                <div className='text-muted' style={{ fontSize: "12px" }}>0,00 zł</div>
            </div>,
            selector: row => row.cost,
            sortable: true,

            width: "250px",
            style: {

                width: "250px"
            },
        },
        {

            cell: row => <div ><Dropdown as={ButtonGroup} drop={"up"}>
                <Button variant="primary">{translate(languageData, "Details")}</Button>

                <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

                <Dropdown.Menu style={{ zIndex: "1000" }}>
                    <Dropdown.Item href="#/action-1">{translate(languageData, "Details")}</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">{translate(languageData, "PaidModification")}</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">{translate(languageData, "CheckPublication")}</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">{translate(languageData, "CheckIndexing")}</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
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
            deadline: "07/09/23 14:50",
            deadline2: "07/09/23 14:50",
            cost: "103,50 zł",
            cost2: "0.00 zł"



        }
    ]


    const modalColumns = [

        {
            name: <div>{translate(languageData , "StatusWhetherArticleCorrectlyPublished")}</div>,
            selector: row => row.status,

            width: "250px",
            style: {

                width: "250px"
            },

        },
        {
            name: translate(languageData , "NumberOfArticle"),
            selector: row => row.articleNum,
            cell: (row) => (
                row.status === "Publication correct" ?
                    <div className='text-success'>{row.articleNum}</div> : row.status === "Publication not available" ? <div className='text-danger'>{row.articleNum}</div> : <div className=''>{row.articleNum}</div>

            ),
            width: "250px",
            style: {

                width: "250px"
            },


        },
        {
            name: translate(languageData , "Action"),
            selector: row => row.publicationStatus,
            cell: row => <button className='btn btn-outline-light' style={{ fontSize: "12px" }}>Check the publication</button>,
            width: "250px",
            style: {

                width: "250px"
            },
        }

    ];

    const modalTableData = [
        {
            status: "Untested publication",
            articleNum: "0",
        },
        {
            status: "During the validation process",
            articleNum: "0",
        },
        {
            status: "Publication correct",
            articleNum: "36",
        },
        {
            status: "Publication not available",
            articleNum: "8",
        },
    ]

    const modalColumns2 = [

        {
            name: (
                <div>
                    <div>{translate(languageData , "StatusWhetherArticleCorrectlyPublished")}</div>
                    <div className='text-muted' style={{ fontSize: "12px" }}>{translate(languageData , "OnlyCorrectlyPublishedArticlesSection36")}</div>
                </div>
            ),
            selector: row => row.status,

            width: "250px",
            style: {

                width: "250px"
            },

        },
        {
            name: translate(languageData , "NumberOfArticle"),
            selector: row => row.articleNum,
            cell: (row) => (
                row.status === "Publication correct" ?
                    <div className='text-success'>{row.articleNum}</div> : row.status === "Publication not available" ? <div className='text-danger'>{row.articleNum}</div> : <div className=''>{row.articleNum}</div>

            ),
            width: "250px",
            style: {

                width: "250px"
            },


        },
        {
            name: translate(languageData , "Action"),
            selector: row => row.publicationStatus,
            cell: row => <button className='btn btn-primary' style={{ fontSize: "12px" }}>Check the publication</button>,
            width: "250px",
            style: {

                width: "250px"
            },
        }

    ];

    const modalTableData2 = [
        {
            status: "Publication correct, but not sure if it is indexed",
            articleNum: "0",
        },
        {
            status: "Publication correct and in the checking process indexation",
            articleNum: "0",
        },
        {
            status: "Publication correct and indexed",
            articleNum: "36",
        },
        {
            status: "Publication correct, but not indexed",
            articleNum: "8",
        },
    ]


    const userData = JSON.parse(localStorage.getItem("userData"));
    const handleArticleList = async () => {
        const res = await getArticles(userData?.id)
        setArticleList(res.data)
    }

    const status = [
        translate(languageData, "All"),
        "Untested",
        "Correct",
        translate(languageData, "Checked"),
        "Not Available",
    ]

    const indexationStatus = [
        translate(languageData, "All"),
        translate(languageData, "Unknown"),
        translate(languageData, "ReadyArticleChecked"),
        translate(languageData, "ReadyArticleOk"),
        translate(languageData, "Unindexed"),
        translate(languageData, "UnindexedPublisherBlocks"),
        translate(languageData, "DuringIndexation"),
        translate(languageData, "FailedIndexation")
    ]


    return (
        <div className='p-4'>
            <div><h3 className='semi-bold mt-1'>{translate(languageData , "ReadyArticles")}</h3></div>
            <div className=' mt-4'>
                <Row>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="project" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country">
                                <option label={translate(languageData, "artilstProject")}></option>
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
                            <input className="input100" type="text" name="search" placeholder={translate(languageData, "EnterNameTitle")} />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="zmdi zmdi-search" aria-hidden="true"></i>
                            </span>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="status" style={{ height: "45px" }} className=" form-select" id="default-dropdown" data-bs-placeholder="Select Status">
                                <option label={translate(languageData, "PublicationStatus")}></option>
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
                                <span className='mt-1'>{translate(languageData, "36MonthGuarantee")}</span>
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
                                <span className='mt-1'>{translate(languageData, "36MonthGuarantee")}</span>

                            </label>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="input-group">
                            {/* <div className="input-group-text bg-primary-transparent text-primary">
                                <i className="fe fe-calendar text-20"></i>
                            </div> */}
                            <input className="form-control" id="datepicker-date" placeholder="MM/DD/YYYY" type="date" style={{ height: "45px" }} max={new Date().toISOString().split("T")[0]} />
                        </div>
                    </Col>
                    <Row>
                        <Col xs={12} sm={6} md={4} className=''>
                            <div className="form-group">
                                <select name="status" style={{ height: "45px" }} className=" form-select" id="default-dropdown" data-bs-placeholder="Select Status">
                                    <option label={translate(languageData, "ArticleIndexationStatus")}></option>
                                    {indexationStatus.map((item, index) => {
                                        return (
                                            <option value={item} key={index}>{item}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </Col>
                    </Row>

                </Row>


            </div>
            <div className='mt-5'>

                <OverlayTrigger
                    placement={"top"}
                    overlay={
                        <Tooltip >
                            Go to Reports
                        </Tooltip>
                    }

                >
                    <Dropdown as={ButtonGroup} drop={"down"} className="mb-4">

                        <Button variant="primary">{translate(languageData, "Details")}</Button>

                        <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">{translate(languageData, "Details")}</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">{translate(languageData, "PaidModification")}</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">{translate(languageData, "CheckPublication")}</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">{translate(languageData, "CheckIndexing")}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </OverlayTrigger>

                <OverlayTrigger
                    placement={"top"}
                    overlay={
                        <Tooltip >
                            Checking the correctness of Article publication, indexing status and indexing orders from all articles and for selected project
                        </Tooltip>
                    }
                >
                    <Button variant="primary" className='ms-4' style={{ marginTop: "-17px" }} onClick={() => setShowIndexationModal(true)}>{translate(languageData , "VerificationIndexationArticles")}</Button>

                </OverlayTrigger>

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

            <Modal show={showIndexationModal} onHide={() => setShowIndexationModal(false)} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{translate(languageData , "VerificationIndexationArticles")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                       {translate(languageData , "VerificationIndexationArticlesLongContent")}
                    </div>
                    <div>
                        <DataTable
                            columns={modalColumns}
                            data={modalTableData}
                            customStyles={{
                                rows: {
                                    style: {
                                        fontSize: '14px',
                                    },
                                },
                            }}
                        />
                    </div>
                    <div className='mt-5'>
                        <DataTable
                            columns={modalColumns2}
                            data={modalTableData2}
                            customStyles={{
                                rows: {
                                    style: {
                                        fontSize: '14px',
                                    },
                                },
                            }}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowIndexationModal(false)} >
                        Close
                    </Button>
                    {/* <Button variant="primary" >
                        Save Changes
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ReadyArticles;