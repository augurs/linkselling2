import React, { useEffect, useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { articlesInProgressList } from '../../../services/articleServices/articleServices'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../Context/languageContext'
import { translate, formatDate } from '../../../utility/helper'
import { FaEye, FaLink } from 'react-icons/fa'
import globalLoader from '../../../assets/images/loader.svg'
import { projectList } from '../../../services/ProjectServices/projectServices';
const ArticleInProgress = () => {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [projectListData, setProjectList] = useState([])
    const [searchText, setSearchText] = useState('');
    const [selectprojectText, setSelectprojectText] = useState('');
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [isDataPresent, setIsDataPresent] = useState(true);

    const { languageData } = useLanguage()
    const accessToken = localStorage.getItem('accessToken')



    useEffect(() => {
        projectListServices()
    }, [])

    useEffect(() => {
        articlesInProgressServices()
    }, [])


    const articlesInProgressServices = async () => {
        setLoading(true);
        const res = await articlesInProgressList(accessToken);
        if (res.success === true) {
            setData(res?.data);
            setIsDataPresent(res.data.length > 0);
            setLoading(false);
        } else {
            setIsDataPresent(false);
            setLoading(false);
        }
    };

    const tableData = data
        .filter((item) =>
            (item?.title && item?.title.toLowerCase().includes(searchText.toLowerCase())) ||
            (item?.portal && typeof item?.portal === 'string' && item?.portal.toLowerCase().includes(searchText.toLowerCase()))
        )
        .filter((item) => selectprojectText ? item?.project === selectprojectText : true)
        .map((item) => {
            return {
                portal: item?.portal,
                price: item?.price,
                project: item?.project,
                date1: item?.created_at,
                status: item?.status,
                name: item?.name,
                id: item?.id,
                link: item?.link,
                title: item?.title,
                type: item?.type
            }
        });


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
            selector: row => row.date1,
            cell: (row) => (
                <div>{row.date1}</div>
            ),
            sortable: true,
            center: true,
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

    const projectListServices = async () => {
        const res = await projectList(accessToken)
        setProjectList(res?.data)
    }

    // const status = [
    //     translate(languageData, "All"),
    //     translate(languageData, "WaitingForContent"),
    //     translate(languageData, "PublisherWrites"),
    //     translate(languageData, "PublisherWrites"),
    //     translate(languageData, "ComplainToPublisher"),
    //     translate(languageData, "PublicationInProgress"),
    //     translate(languageData, "PublicationOverdue"),
    //     translate(languageData, "PublisherComments"),
    //     translate(languageData, "PublishedInVerification"),
    //     translate(languageData, "AdvertisersComments")

    // ]


    return (
        <div className='p-4'>
            <div><h3 className='semi-bold mt-1'>{translate(languageData, "InProgressArticles")}</h3></div>
            <div className=' mt-4'>
                <Row>
                    <Col xs={12} sm={6} md={6} className=''>
                        <div className="form-group">
                            <select name="project" style={{ height: "45px" }} class=" form-select" id="default-dropdown" data-bs-placeholder="Select Project" value={selectprojectText} onChange={(e) => setSelectprojectText(e.target.value)}>
                                <option label={translate(languageData, "artilstProject")}></option>
                                {projectListData?.map((item, index) => {
                                    return (
                                        <option value={item.name} key={index}>{item.name}</option>

                                    )
                                })}
                            </select>
                        </div>

                    </Col>
                    <Col xs={12} sm={6} md={6} className='mb-3'>
                        <div className="wrap-input100 validate-input mb-0">
                            <input className="input100" type="text" name="search" placeholder={translate(languageData, "EnterNameTitle")} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="zmdi zmdi-search" aria-hidden="true"></i>
                            </span>
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
        </div>
    )
}

export default ArticleInProgress