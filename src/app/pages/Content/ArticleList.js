import React from 'react'
import { Button, Col, Dropdown, Row } from 'react-bootstrap'
import DataTable from 'react-data-table-component';
import Checkbox from '../../Components/checkbox';
import { useState } from 'react';
import { json, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getArticles, searchArticles } from '../../../services/articleServices/articleServices';
import globalLoader from '../../../assets/images/loader.svg'
import { translate } from '../../../utility/helper';
import { useLanguage } from '../../Context/languageContext';

const ArticleList = () => {

    const [order, setOrder] = useState("Orders")
    const [articleList, setArticleList] = useState([])
    const [searchTerms, setSearchTerms] = useState({ title: "", project: "", status: "", date: "" })
    const [articleSearchData, setArticleSearchData] = useState([]);
    const [loading, setLoading] = useState(false)

    const userData = JSON.parse(localStorage.getItem('userData'))

    const navigate = useNavigate();


    useEffect(() => {
        handleSearchService()
    }, [searchTerms])

    useEffect(() => {
        handleArticleList()
    }, [])


    const userData2 = JSON.parse(localStorage.getItem("userData"));

    const handleSearchService = async () => {
        setLoading(true)
        const res = await searchArticles(searchTerms, userData2?.id)
        setArticleSearchData(res?.data)
        setLoading(false)
    }

    const handleArticleList = async () => {
        const res = await getArticles(userData?.id)
        setArticleList(res.data)
    }

    const { languageData } = useLanguage();








    const columns = [
        // {
        //     cell: row => (
        //         <input
        //             type="checkbox"
        //             onChange={() => console.log(row)}
        //         />
        //     ),
        //     sortable: false,
        //     width: '50px',
        //     center: true,
        // },
        {
            name: translate(languageData,"artilstTitle"),
            selector: row => row.title,
            sortable: true,
            center: true,
        },
        {
            name:  translate(languageData,"artilisAddingDate"),
            selector: row => row.date,
            sortable: true,
            center: true,
        },
        {
            name: translate(languageData,"artilstType")+" "+ translate(languageData,"ArticleListSource"),
            selector: row => row.type,
            sortable: true,
            cell: row => <button className='btn btn-pill btn-outline-primary'>{translate(languageData,"own")}</button>,
            center: true,
        },
        {
            name: translate(languageData,"ArtilistPublicationCost"),
            selector: row => row.cost,
            sortable: true,
            center: true,
        },
        {
            name: translate(languageData,"artilstStatus"),
            cell: row => <button className='btn btn-pill btn-outline-primary btn-w-lg' style={{ minWidth: "180px" }}>{translate(languageData,"readyForPublication")}</button>,
            center: true,
        },

        // {
        //     name: 'Action',
        //     cell: row => <button className='btn btn-primary'>Edit</button>,
        //     center: true,
        // },
    ];


    const articleTableData = articleSearchData.map((item) => {
        let arr = item?.created_at.split('T');
        let time = arr[1].split('.')
        let dateTime = arr[0] + " " + time[0]

        return {
            id: item.id,
            title: item.title,
            date: dateTime,
            cost: "0,00 zł",
            status: item.status
        }
    })

    const data = articleTableData

    const handleOrders = (orders) => {
        setOrder(orders)
    }


    const statusDropDownOptions = [
        {
            label: "New", value: "new",
        },
        {
            label: "Linkselling Write", value: "nLinksellingwrites",
        },
        {
            label: "Linkselling Complaint", value: "linksellingcomplaint",
        },
        {
            label: "Wait for pictures", value: "waitforpictures",
        },
        {
            label: "Resignation Submitted", value: "resignationsubmitted",
        },
        {
            label: "Completed", value: "completed",
        },
        {
            label: "In Verification", value: "inverification",
        },
        {
            label: "To be improved", value: "tobeimproved",
        },
        {
            label: "Rejected", value: "rejected",
        },
        {
            label: "Waiting for payment", value: "waitingforpayment",
        },
        {
            label: "Ready for publication", value: "readyforpublication",
        },
    ]


    const sourecDropOptions = [
        {
            label: "Own Content", value: "owncontent"
        },
        {
            label: "Content from Linkselling", value: "contentfromlinkselling"
        }
    ]


    const articleTypeDropOption = [
        {
            label: "Article for personal use", value: "articleforpersonaluse"
        },
        {
            label: "Paid Article", value: "paidarticle"
        },
        {
            label: "Guest Article", value: "guestarticle"
        },
        {
            label: "Infographic", value: "infographic"
        },
        {
            label: "Text", value: "text"
        }
    ]








    const checkboxHeader = (
        <input
            type="checkbox"
        //   checked={selectAllRows}
        //   onChange={handleSelectAllRows}
        />
    );

    const noDataComponent = <div className="text-center">{translate(languageData, "thereAreNoRecordsToDisplay")}</div>;

    return (
        <div className='p-4'>

            <div className='d-flex flex-wrap '>
                <Button className='btn btn-primary btn-w-md me-2 mt-2' onClick={() => navigate('/addArticle')}>{translate(languageData,"SidebarAddArticle")}</Button>
                <Dropdown className='mt-2'>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {translate(languageData,"artilistOrders")}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleOrders("Order an Article")}>Order an Article</Dropdown.Item>
                        {/* <Dropdown.Item onClick={() => handleOrders("Order infographic")}>Order infographic</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleOrders("Order a text")}>Order a text</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleOrders("Request for proposals")}>Request for proposals</Dropdown.Item> */}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className=' mt-4'>
                <Row>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="project" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country" onChange={(e) => setSearchTerms({ ...searchTerms, project: e.target.value })}>
                                <option label={translate(languageData,"artilstProject")}></option>
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
                            <input className="input100" type="text" name="search" placeholder={translate(languageData,"artilstSearch")} onChange={(e) => setSearchTerms({ ...searchTerms, title: e.target.value })} />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="zmdi zmdi-search" aria-hidden="true"></i>
                            </span>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="status" style={{ height: "45px" }} className=" form-select" id="default-dropdown" data-bs-placeholder="Select Status" onChange={(e) => setSearchTerms({ ...searchTerms, status: e.target.value })}>
                                <option label={translate(languageData,"artilstStatus")}></option>
                                {articleList.map((item, index) => {
                                    return (
                                        <option value={item.status} key={index}>{item.status}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="type" style={{ height: "45px" }} className=" form-select" id="default-dropdown" data-bs-placeholder="Select Type" >
                                <option label={translate(languageData,"artilstType")}></option>
                                {articleTypeDropOption.map((item, index) => {
                                    return (
                                        <option value={item.value} key={index}>{item.label}</option>
                                    )
                                })}

                            </select>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="source" style={{ height: "45px" }} className=" form-select" id="default-dropdown" data-bs-placeholder="Select Source" >
                                <option label={translate(languageData,"ArticleListSource")}></option>
                                {sourecDropOptions.map((item, index) => {
                                    return (
                                        <option value={item.value} key={index}>{item.label}</option>
                                    )
                                })}

                            </select>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="input-group">
                            {/* <div className="input-group-text bg-primary-transparent text-primary">
                                <i className="fe fe-calendar text-20"></i>
                            </div> */}
                            <input className="form-control" id="datepicker-date" placeholder="MM/DD/YYYY" type="date" style={{ height: "45px" }} max={new Date().toISOString().split("T")[0]} onChange={(e) => setSearchTerms({ ...searchTerms, date: e.target.value })} />
                        </div>
                    </Col>
                </Row>


            </div>
            {/* <div className='mt-4'>
                <Button className='btn btn-primary btn-w-md me-2 mt-2'>Export to ZIP</Button>
                <Button className='btn btn-primary btn-w-md me-2 mt-2'>Move to Archive</Button>
                <Button className='btn btn-primary btn-w-md mt-2'>Move to Archive</Button>
            </div> */}
            <div className='mt-5'>
                {loading ?
                    <div className='d-flex justify-content-between align-items-center'>
                        <img src={globalLoader} className='mx-auto' />
                    </div> :
                    <DataTable
                        // selectableRowsComponent={Checkbox}
                        columns={columns}
                        data={data}
                        noDataComponent={noDataComponent}
                    // selectableRows
                    // selectableRowsHighlight
                    // selectableRowsHeader
                    // selectableRowsHeaderComponent={checkboxHeader}

                    />}
            </div>

        </div>
    )
}

export default ArticleList