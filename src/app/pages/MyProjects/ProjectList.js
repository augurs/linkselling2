import React from 'react'
import { Button, Col, Dropdown, Row } from 'react-bootstrap'
import DataTable from 'react-data-table-component';
import Checkbox from '../../Components/checkbox';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getArticles, searchArticles } from '../../../services/articleServices/articleServices';
import globalLoader from '../../../assets/images/loader.svg'
import Select from 'react-select'
import { countries, languages } from '../../../utility/data';
import { projectList, searchProject } from '../../../services/ProjectServices/projectServices';
import { translate } from '../../../utility/helper';
import { useLanguage } from '../../Context/languageContext';


const ProjectList = () => {

    const [order, setOrder] = useState("Orders")
    // const [articleList, setArticleList] = useState([])
    const [searchTerms, setSearchTerms] = useState({ title: "", langauge: "" })
    // const [articleSearchData, setArticleSearchData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [projectListData, setProjectList] = useState([])
    const [searchedData, setSearchedData] = useState([])

    const navigate = useNavigate();

    const { languageData } = useLanguage()


    useEffect(() => {
        handleSearchService()
    }, [searchTerms])

    useEffect(() => {
        projectListServices()
    }, [])



    const handleSearchService = async () => {
        setLoading(true)
        const res = await searchProject(searchTerms)
        setSearchedData(res?.data)
        setLoading(false)
    }


    const projectListServices = async () => {
        setLoading(true)
        const res = await projectList()
        setProjectList(res.data)
        setLoading(false)
    }

    // const handleArticleList = async () => {
    //     const res = await getArticles()
    //     setArticleList(res.data)
    // }

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


    const columns = [
        {
            name: translate(languageData , "ProjectName"),
            selector: row => row.projectName,
            sortable: true,
            left: true,
        },
        {
            name: translate(languageData , "artilisAddingDate"),
            selector: row => row.dateOfAdding,
            sortable: true,
            left: true,
        },
        {
            name: translate(languageData , "Language"),
            selector: row => row.language,
            sortable: true,
            left: true,
        },
        {
            name: translate(languageData , "WebUrl"),
            selector: row => row.weburl,
            sortable: true,
            left: true,
            cell: (row) => (
                <Link to={`http://${row.weburl}`} target="_blank" style={{textDecoration : "underline"}}>
                    {row.weburl}
                </Link>
            ),
        },


        {
            name: translate(languageData , "Action"),
            cell: row => <button className='btn btn-primary' onClick={() => navigate(`/editProject/${row.id}`)}>{translate(languageData , "Edit")}</button>,
            left: true,
        },
    ];


    const tableData = searchedData.map((item) => {
        let date = item.created_at.split('T');
        date = date[0]
        return {
            id: item.id,
            projectName: item.name,
            dateOfAdding: date,
            language: item.language,
            weburl: item.domain
        }
    })

    const data = tableData


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

    const handleLanguageChange = (selectedOption) => {
        setSearchTerms({ ...searchTerms, language: selectedOption?.value })
    }


    console.log(searchTerms, "206");







    const checkboxHeader = (
        <input
            type="checkbox"
        //   checked={selectAllRows}
        //   onChange={handleSelectAllRows}
        />
    );

    return (
        <div className='p-4'>
            <div className='d-flex flex-wrap '>
                <Button className='btn btn-primary btn-w-md me-2 mt-2' onClick={() => navigate('/addProject')}>{translate(languageData , "AddProject")}</Button>

            </div>
            <div className='mt-4'>
                <Row>
                    {/* <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group mb-3">
                            <select name="country" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Country" onChange={(e) => setSearchTerms({ ...searchTerms, project: e.target.value })}>
                                <option label="Country"></option>
                                {countries.map((item, index) => {
                                    return (
                                        <option value={item.name} key={index}>{item.name}</option>

                                    )
                                })}
                            </select>
                        </div>

                    </Col> */}
                    <Col xs={12} sm={6} md={6} className='mb-3'>
                        <Select options={languagesOpts} name='language' placeholder={translate(languageData , "Language")} styles={{ control: (provided) => ({ ...provided, borderColor: '#ecf0fa', height: '45px', }) }} onChange={handleLanguageChange} />

                    </Col>
                    <Col xs={12} sm={6} md={6} className='mb-2'>
                        <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                            <input className="input100" type="text" name="title" placeholder={translate(languageData , "artilstSearch")} onChange={(e) => setSearchTerms({ ...searchTerms, title: e.target.value })} />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="zmdi zmdi-search" aria-hidden="true"></i>
                            </span>
                        </div>
                    </Col>

                </Row>
                {/* <Row>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="type" style={{ height: "45px" }} className=" form-select" id="default-dropdown" data-bs-placeholder="Select Type" >
                                <option label="Type"></option>
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
                                <option label="Source"></option>
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
        
                            <input className="form-control" id="datepicker-date" placeholder="MM/DD/YYYY" type="date" style={{ height: "45px" }} onChange={(e) => setSearchTerms({ ...searchTerms, date: e.target.value })} />
                        </div>
                    </Col>
                </Row> */}


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
                        // selectableRows
                        // selectableRowsHighlight
                        // selectableRowsHeader
                        // selectableRowsHeaderComponent={checkboxHeader}

                    />
                }
            </div>

        </div>
    )
}

export default ProjectList