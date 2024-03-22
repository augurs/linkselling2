import React from 'react'
import { Button, Col, Dropdown, Row } from 'react-bootstrap'
import DataTable from 'react-data-table-component';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getArticles, searchArticles } from '../../../services/articleServices/articleServices';
import globalLoader from '../../../assets/images/loader.svg'
import { translate } from '../../../utility/helper';
import { useLanguage } from '../../Context/languageContext';
import { FaEye } from 'react-icons/fa';
import { projectList } from '../../../services/ProjectServices/projectServices';
import { articleListStatus } from '../../../utility/data';

const ArticleList = () => {

    const [order, setOrder] = useState("Orders")
    const [articleList, setArticleList] = useState([])
    const [searchTerms, setSearchTerms] = useState({ title: "", project: "", status: "", date: "" })
    const [articleSearchData, setArticleSearchData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [projectListData, setProjectList] = useState([])

    const userData = JSON.parse(localStorage.getItem('userData'))
    const accessToken = localStorage.getItem('accessToken')
    const navigate = useNavigate();


    useEffect(() => {
        handleSearchService()
    }, [searchTerms])

    useEffect(() => {
        handleArticleList()
        projectListServices()
    }, [])

    const projectListServices = async () => {
        setLoading(true)
        const res = await projectList(accessToken)
        setProjectList(res.data)
        setLoading(false)
    }

    const handleSearchService = async () => {
        setLoading(true)
        const res = await searchArticles(searchTerms, accessToken)
        setArticleSearchData(res?.data)
        setLoading(false)
    }

    const handleArticleList = async () => {
        const res = await getArticles(accessToken)
        setArticleList(res?.data)
    }

    const { languageData } = useLanguage();

    const columns = [
        {
            name: translate(languageData, "artilstTitle"),
            selector: row => row.title,
            sortable: true,
            center: true,
        },
        {
            name: translate(languageData, "artilisAddingDate"),
            selector: row => row.date,
            sortable: true,
            center: true,
        },
        {
            name: translate(languageData, "artilstType") + " " + translate(languageData, "ArticleListSource"),
            selector: row => row.type,
            sortable: true,
            cell: row => <button className='btn btn-pill btn-outline-primary'>{translate(languageData, "own")}</button>,
            center: true,
        },
        {
            name: translate(languageData, "ArtilistPublicationCost"),
            selector: row => row.cost,
            sortable: true,
            center: true,
        },
        {
            name: translate(languageData, "artilstStatus"),
            cell: row => <button className='btn btn-pill btn-outline-primary btn-w-lg d-flex justify-content-center align-items-center' style={{ minWidth: "180px" }}>{row?.status}</button>,
            center: true,
        },

        {
            name: translate(languageData, "writingAction"),
            sortable: true,
            center: true,
            cell: (row) => (
                <div className='d-flex gap-2'>
                    <Link to={`/viewAddArticle/${row.id}`}>
                        <FaEye className="icon-view" />
                    </Link>
                </div>
            ),
        }
    ];


    const articleTableData = articleSearchData?.map((item) => {
        let arr = item?.created_at.split('T');
        let time = arr[1].split('.')
        let dateTime = arr[0] + " " + time[0]

        return {
            id: item.id,
            title: item.title,
            date: dateTime,
            cost: "0,00 zł",
            status: item?.status == "Ready to Publish" ? translate(languageData, "readyForPublication") : translate(languageData, "SidebarPublishedArticle")
        }
    })


    const sourecDropOptions = [
        {
            label: translate(languageData, "artilistOwnContent"), value: "owncontent"
        },
        {
            label: translate(languageData, "artilisContentFromLinkselling"), value: "contentfromlinkselling"
        }
    ]

    const noDataComponent = <div className="text-center">{translate(languageData, "thereAreNoRecordsToDisplay")}</div>;


    return (
        <div className='p-4'>

            <div className='d-flex flex-wrap '>
                <Button className='btn btn-primary btn-w-md me-2 mt-2' onClick={() => navigate('/addArticle')}>{translate(languageData, "SidebarAddArticle")}</Button>
                <Button className='btn btn-primary btn-w-md me-2 mt-2' >{translate(languageData, "artilistOrders")}</Button>
            </div>
            <div className=' mt-4'>
                <Row>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="project" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country" onChange={(e) => setSearchTerms({ ...searchTerms, project: e.target.value })}>
                                <option label={translate(languageData, "artilstProject")}></option>
                                {projectListData?.map((project, index) => (
                                    <option value={project.name} key={index}>{project.name}</option>
                                ))}
                            </select>
                        </div>

                    </Col>
                    <Col xs={12} sm={6} md={4} className='mb-3'>
                        <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                            <input className="input100" type="text" name="search" placeholder={translate(languageData, "artilstSearch")} onChange={(e) => setSearchTerms({ ...searchTerms, title: e.target.value })} />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="zmdi zmdi-search" aria-hidden="true"></i>
                            </span>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="status" style={{ height: "45px" }} className=" form-select" id="default-dropdown" data-bs-placeholder="Select Status" onChange={(e) => setSearchTerms({ ...searchTerms, status: e.target.value })}>
                                <option label={translate(languageData, "artilstStatus")}></option>
                                {articleListStatus?.map((status, index) => (
                                        <option value={status.value} key={index}>
                                            {status.label}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="source" style={{ height: "45px" }} className=" form-select" id="default-dropdown" data-bs-placeholder="Select Source" >
                                <option label={translate(languageData, "ArticleListSource")}></option>
                                {sourecDropOptions?.map((item, index) => {
                                    return (
                                        <option value={item.value} key={index}>{item.label}</option>
                                    )
                                })}

                            </select>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="input-group">
                            <input className="form-control" id="datepicker-date" placeholder="MM/DD/YYYY" type="date" style={{ height: "45px" }} max={new Date().toISOString().split("T")[0]} onChange={(e) => setSearchTerms({ ...searchTerms, date: e.target.value })} />
                        </div>
                    </Col>
                </Row>


            </div>
            <div className='mt-5'>
                {loading ?
                    <div className='d-flex justify-content-between align-items-center'>
                        <img src={globalLoader} className='mx-auto' />
                    </div> :
                    <DataTable
                        columns={columns}
                        data={articleTableData?.reverse()}
                        noDataComponent={noDataComponent}
                    />}
            </div>

        </div>
    )
}

export default ArticleList