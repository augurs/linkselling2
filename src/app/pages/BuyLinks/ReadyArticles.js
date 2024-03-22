import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Dropdown, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { readyArticleList } from '../../../services/articleServices/articleServices'
import DataTable from 'react-data-table-component'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../Context/languageContext'
import { translate, formatDate } from '../../../utility/helper'
import { FaEye, FaLink } from 'react-icons/fa'
import { projectList } from '../../../services/ProjectServices/projectServices';
import globalLoader from '../../../assets/images/loader.svg'

const ReadyArticles = () => {


    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken')
    const [projectListData, setProjectList] = useState([])
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [showIndexationModal, setShowIndexationModal] = useState(false)
    const [isDataPresent, setIsDataPresent] = useState(true);
    const [dropdownStatus, setDropdownStatus] = useState('');
    const [project, setProject] = useState('');
    const [search, setSearch] = useState('');
    const [date, setDate] = useState('');


    // const userData = JSON.parse(localStorage.getItem("userData"));
    const { languageData } = useLanguage()

    useEffect(() => {
        projectListServices()
        readyArticleListServices()
    }, [])

    const projectListServices = async () => {
        const res = await projectList(accessToken)
        setProjectList(res.data)
    }

    const readyArticleListServices = async () => {
        setLoading(true)
        const res = await readyArticleList(accessToken)
        if (res.success === true) {
            setData(res?.data);
            setIsDataPresent(res.data.length > 0);
            setLoading(false);
        } else {
            setIsDataPresent(false);
            setLoading(false);
        }
    };


    const tableData = data?.filter((item) =>
        (item?.title && item?.title.toLowerCase().includes(search.toLowerCase()))
    ).filter((item) => item?.project && typeof item?.project === 'string' && item?.project.toLowerCase().includes(project.toLowerCase())
    )?.filter((item) => item?.status && typeof item?.status === 'string' && item?.status.toLowerCase().includes(dropdownStatus.toLowerCase())
    )?.filter((item) => item?.created_at && typeof item?.created_at === 'string' && item?.created_at.toLowerCase().includes(date.toLowerCase())).map((item) => {
        return {
            portal: item?.portal,
            price: item?.price,
            project: item?.project,
            date: item?.created_at,
            status: item?.status,
            name: item?.name,
            id: item?.id,
            link: item?.link,
            title: item?.title,
            type: item?.type
        }
    })

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
            selector: row => row.project,
            selector: row => row.portal,
            cell: (row) => (
                <div className='mt-2 mb-2'>
                    {row.title}
                    <div className='text-muted'><small>{row.project}</small></div>
                    <div className='text-muted'><small><Link to={`http://${row.portal}`} target="_blank" style={{ textDecoration: "underline" }}>{row.portal}</Link></small></div>
                </div>
            ),
            sortable: true,
            wrap: true,
            width: "190px",
            style: {

                width: "190px"
            },


        },
        {
            name: translate(languageData, "price"),
            selector: row => row.price,
            cell: row => `${row.price} zł`,
            sortable: true,
            center: true,
            wrap: true,
            width: "150px",
            style: {

                width: "150px"
            },


        },
        {
            name: translate(languageData, "artilstStatus"),
            selector: (row) => row.status,
            sortable: true,
            center: true,
            cell: (row) => {
                let buttonClass = "btn btn-outline-primary btn-pill";
                let buttonText = "";

                switch (row.status) {
                    case "Pending":
                        buttonClass = "btn btn-outline-warning btn-pill";
                        buttonText = <small>{translate(languageData, "pending")}</small>;
                        break;
                    case "AssignedToWriter":
                        buttonClass = "btn btn-outline-info btn-pill";
                        buttonText = <small>{translate(languageData, "AssignedToWriter")}</small>;
                        break;
                    case "Completed":
                        buttonClass = "btn btn-outline-success btn-pill";
                        buttonText = <small>{translate(languageData, "Completed")}</small>;
                        break;
                    case "RequestChanges":
                        buttonClass = "btn btn-outline-warning btn-pill";
                        buttonText = <small>{translate(languageData, "RequestChanges")}</small>;
                        break;
                    case "Rejected":
                        buttonClass = "btn btn-outline-danger btn-pill";
                        buttonText = <small>{translate(languageData, "Rejected")}</small>;
                        break;
                    case "Accepted":
                        buttonClass = "btn btn-outline-secondary btn-pill";
                        buttonText = <small>{translate(languageData, "Accepted")}</small>;
                        break;
                    case "CustomerReview":
                        buttonClass = "btn btn-outline-warning btn-pill";
                        buttonText = <small>{translate(languageData, "CustomerReview")}</small>;
                        break;
                    case "RejectedLink":
                        buttonClass = "btn btn-outline-danger btn-pill";
                        buttonText = <small>{translate(languageData, "RejectedLink")}</small>;
                        break;
                    case "Published":
                        buttonClass = "btn btn-outline-primary btn-pill";
                        buttonText = <small>{translate(languageData, "Published")}</small>;
                        break;
                    case "PendingForAssing":
                        buttonClass = "btn btn-outline-warning btn-pill";
                        buttonText = <small>{translate(languageData, "PendingForAssing")}</small>;
                        break;
                    case "Accept":
                        buttonClass = "btn btn-outline-dark btn-pill";
                        buttonText = <small>{translate(languageData, "Accept")}</small>;
                        break;
                    case "RejectPublication":
                        buttonClass = "btn btn-outline-danger btn-pill";
                        buttonText = <small>{translate(languageData, "RejectPublication")}</small>;
                        break;
                    case "AcceptPublication":
                        buttonClass = "btn btn-outline-success btn-pill";
                        buttonText = <small>{translate(languageData, "AcceptPublication")}</small>;
                        break;
                    case "ReadyToPublish":
                        buttonClass = "btn btn-outline-primary btn-pill";
                        buttonText = <small>{translate(languageData, "ReadyToPublish")}</small>;
                        break;
                    default:

                        buttonText = row.status;
                }

                return (
                    <span className={`${buttonClass} d-flex justify-content-center align-items-center`} style={{ minWidth: '140px', minHeight: "35px" }}>
                        {buttonText}
                    </span>
                );
            },
        },
        {
            name: translate(languageData, "dateOfOrder"),
            selector: row => row.date,
            cell: (row) => (
                row.date
            ),
            sortable: true,
            wrap: true,
            width: "150px",
            style: {

                width: "150px"
            },


        },
        {
            name: translate(languageData, "writingAction"),
            sortable: true,
            center: true,
            cell: (row) => (
                <div className='d-flex gap-2'>
                    {(row.status === "AcceptPublication" || row.status === "Published") && (
                        <Link to={row.link}>
                            <FaLink className="icon-link" />
                        </Link>
                    )}

                    <Link to={`/viewArticle/${row.type}/${row.id}`}>
                        <FaEye className="icon-view" />
                    </Link>
                </div>
            ),
        }
    ];

    const modalColumns = [

        {
            name: <div>{translate(languageData, "StatusWhetherArticleCorrectlyPublished")}</div>,
            selector: row => row.status,

            width: "250px",
            style: {

                width: "250px"
            },

        },
        {
            name: translate(languageData, "NumberOfArticle"),
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
            name: translate(languageData, "Action"),
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
                    <div>{translate(languageData, "StatusWhetherArticleCorrectlyPublished")}</div>
                    <div className='text-muted' style={{ fontSize: "12px" }}>{translate(languageData, "OnlyCorrectlyPublishedArticlesSection36")}</div>
                </div>
            ),
            selector: row => row.status,

            width: "250px",
            style: {

                width: "250px"
            },

        },
        {
            name: translate(languageData, "NumberOfArticle"),
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
            name: translate(languageData, "Action"),
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

    // const status = [
    //     translate(languageData, "All"),
    //     "Untested",
    //     "Correct",
    //     translate(languageData, "Checked"),
    //     "Not Available",
    // ]

    // const indexationStatus = [
    //     translate(languageData, "All"),
    //     translate(languageData, "Unknown"),
    //     translate(languageData, "ReadyArticleChecked"),
    //     translate(languageData, "ReadyArticleOk"),
    //     translate(languageData, "Unindexed"),
    //     translate(languageData, "UnindexedPublisherBlocks"),
    //     translate(languageData, "DuringIndexation"),
    //     translate(languageData, "FailedIndexation")
    // ]

    return (
        <div className='p-4'>
            <div><h3 className='semi-bold mt-1'>{translate(languageData, "ReadyArticles")}</h3></div>
            <div className=' mt-4'>
                <Row>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="project" style={{ height: "45px" }} class=" form-select" id="default-dropdown" onChange={(e) => setProject(e.target.value)} >
                                <option label={translate(languageData, "artilstProject")}></option>
                                {projectListData?.map((item, index) => {
                                    return (
                                        <option value={item.name} key={index}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>

                    </Col>
                    <Col xs={12} sm={6} md={4} className='mb-3'>
                        <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                            <input className="input100" type="text" name="search" placeholder={translate(languageData, "EnterNameTitle")} onChange={(e) => setSearch(e.target.value)} />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="zmdi zmdi-search" aria-hidden="true"></i>
                            </span>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="form-group">
                            <select name="status" style={{ height: "45px" }} className=" form-select" id="default-dropdown" data-bs-placeholder="Select Status" onChange={(e) => setDropdownStatus(e.target.value)} value={dropdownStatus}>
                                <option label={translate(languageData, "PublicationStatus")}></option>
                                {/* {data?.map((item, index) => {
                                    return (
                                        <option value={item?.status} key={index}>{item?.status}</option>
                                    )
                                })} */}

                                {[...new Set(data?.map((item) => item.status))]?.map(
                                    (status, index) => (
                                        <option value={status} key={index}>
                                            {status=="AcceptPublication" ? translate(languageData, "AcceptPublication"): status}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6} md={4} className=''>
                        <div className="input-group">
                            <input className="form-control" id="datepicker-date" placeholder="MM/DD/YYYY" type="date" style={{ height: "45px" }} max={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} />
                        </div>
                    </Col>
                </Row>

            </div>
            <div className='mt-5'>
                {loading ? (
                    <div className='d-flex justify-content-between align-items-center'>
                        <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
                    </div>
                ) : isDataPresent ? (
                    <DataTable
                        columns={columns}
                        data={tableData}
                        customStyles={{
                            rows: {
                                style: {
                                    fontSize: '14px',
                                },
                            },
                        }}
                    />
                ) : (
                    <Col lg={12} className="text-center mt-5">
                        <div className="input100">
                            <p className='m-3'>{translate(languageData, "thereAreNoRecordsToDisplay")}</p>
                        </div>
                    </Col>
                )}
            </div>

            <Modal show={showIndexationModal} onHide={() => setShowIndexationModal(false)} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{translate(languageData, "VerificationIndexationArticles")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {translate(languageData, "VerificationIndexationArticlesLongContent")}
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