import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap'
import { useLanguage } from '../Context/languageContext'
import { dashboardprojects, dashboardpromotion, todolists } from '../../services/HomeServices/homeService'
import { translate, formatDate } from '../../utility/helper';
import globalLoader from '../../assets/images/loader.svg'
import DataTable from 'react-data-table-component'
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaLink } from 'react-icons/fa';
import { orderslist } from '../../services/OrdersServices/ordersServices'
const Home = () => {
  const userData = JSON.parse(localStorage.getItem('userData'))
  const { languageData } = useLanguage()

  const [dashBoardproject, setDashBoardProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [ordersList, setOrdersList] = useState([])
  const [promotionList, setPromotionList] = useState([])
  const [toDoList, setToDoList] = useState([])



  //api 1st section start

  useEffect(() => {
    todoListService()
  }, [])

  const todoListService = async () => {
    setLoading(true)
    const res = await todolists(userData?.id)
    if (res.success === true) {
      setToDoList(res?.data)
      setLoading(false)
    }
  }

  const handleRedirect = (data) => {
    if (data.type === 'addnewarticle') {
      return `/resubmitarticle/${data?.id}`;
    } else if (data.type === 'requestarticle') {
      return `/uploadimagerequestarticle/${data?.article_id}`;
    }
    return '#';
  };

  const getActionText = (status) => {
    switch (status) {
      case "CustomerReview":
        return translate(languageData, "NeedToAddAnArticle");
      case "Published":
        return translate(languageData, "NeedToAcceptPublication");
      case "Accepted":
        return translate(languageData, "NeedToAcceptArticle");
      case "Rejected":
        return translate(languageData, "YourPublicationWasRejected");
      default:
        return status;
    }
  };

  const getButtonText = (status) => {
    switch (status) {
      case "CustomerReview":
        return translate(languageData, "AddArticle");
      case "Published":
        return translate(languageData, "AcceptPublication");
      case "Accepted":
        return translate(languageData, "Accept");
      case "Rejected":
        return translate(languageData, "Rejected");

      default:
        return "Action";
    }
  };

  // const removeNotification = (index) => {
  //   const updatedToDoList = [...toDoList.slice(0, index), ...toDoList.slice(index + 1)];
  //   setToDoList(updatedToDoList);
  // };
  //*api 1st section end

  //api 2nd section start

  useEffect(() => {
    dashBoardProjectsServices()
  }, [])

  const navigate = useNavigate();

  const dashBoardProjectsServices = async () => {
    setLoading(true)
    const res = await dashboardprojects(userData?.id)
    if (res.success === true) {
      setDashBoardProjects(res?.data)
      setLoading(false)
    }
  }

  const tableData = dashBoardproject?.map((item) => {
    return {
      no_of_proejct: item?.no_of_proejct,
      name: item.name.length > 10 ? `${item.name.slice(0, 10)}...` : item.name,
      id: item?.id
    }
  })

  const columns = [
    {
      name: translate(languageData, "ProjectName"),
      selector: row => `${row.name}`,
      sortable: true,
      center: true,
    },
    {
      name: translate(languageData, "noOfProjects"),
      selector: row => row.no_of_proejct,

      sortable: true,
      center: true,
      //  width: '180px'
    },
    {
      name: translate(languageData, "writingAction"),
      sortable: true,
      center: true,
      cell: (row) => (
        <Link to={`/buyArticles?pid=${row.id}`} className='btn btn-primary btn-pill d-flex justify-content-center'>{translate(languageData, "buyNew")}</Link>
      ),
    },

  ]
  //*api 2nd section end


  //api 3rd section start
  useEffect(() => {
    promotionListServices()
  }, [])

  const promotionListServices = async () => {
    setLoading(true)
    const res = await dashboardpromotion()
    if (res.success === true) {
      setPromotionList(res?.data)
      setLoading(false)
    }
  }

  const tableData2 = promotionList?.map((item) => {
    const date = new Date(item?.end_date);
    return {
      name: item?.name,
      portal: item?.portal,
      old_price: item?.old_price,
      new_price: item?.new_price,
      date: date?.toLocaleString(),
      id: item?.id
    }
  }).reverse();

  const columns2 = [
    {
      name: translate(languageData, "promoName"),
      selector: (row) => row.name,
      sortable: true,
      center: true,
      wrap: true,
    },
    {
      name: translate(languageData, "PortalName"),
      selector: (row) => row.portal,
      sortable: true,
      center: true,
      wrap: true,
      width: "130px"
    },
    {
      name: translate(languageData, "oldNewPrice"),
      selector: (row) => `${row.old_price} zł / ${row.old_price} zł`,
      sortable: true,
      center: true,
      wrap: true,
      width: "150px"
    },
    {
      name: translate(languageData, "promotionEnd"),
      selector: (row) => formatDate(row.date),
      sortable: true,
      center: true,
      wrap: true,
      width: "150px"
    },
    {
      name: translate(languageData, "writingAction"),
      sortable: true,
      center: true,
      cell: (row) => (
        <div className='d-flex justify-content-center'>
          <Link to={`/buyArticles?id=${row.id}`} className='btn btn-primary btn-pill'>
            <small>{translate(languageData, "buyPublication")}</small>
          </Link>
        </div>
      ),
    },
  ];
  //*api 3rd section end

  //api 4th section start
  useEffect(() => {
    ordersListServices()
  }, [])

  const ordersListServices = async () => {
    setLoading(true)
    const res = await orderslist(userData?.id)
    if (res.success === true) {
      setOrdersList(res?.data)
      setLoading(false)
    }
  }

  const tableData1 = ordersList?.slice(0, 5).map((item) => {
    const date = new Date(item?.created_at);
    return {
      domain: item?.domain,
      price: item?.price,
      project: item?.project,
      date: date?.toLocaleString(),
      status: item?.status,
      name: item?.name,
      id: item?.id,
      link: item?.link,
      type: item?.type
    }
  })

  const columns1 = [
    {
      name: translate(languageData, "domainName"),

      cell: row =>
        <div>
          <div>
            <div>
              {row?.domain}
            </div>
            <div className='text-muted'><small>
              {row?.name}</small>
            </div>
          </div>
        </div>
    },
    {
      name: translate(languageData, "artilstProject"),
      selector: row => row.project,

      sortable: true,
      center: true,
      //  width: '180px'
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
          case "RejectedByPortal":
            buttonClass = "btn btn-outline-primary btn-pill";
            buttonText = <small>{translate(languageData, "RejectedByPortal")}</small>;
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

  ]

  const noDataComponent = <div className="text-center">{translate(languageData, "thereAreNoRecordsToDisplay")}</div>;

  return (
    <div className="inner-body" id="content">
      <h1 className='text-center mt-2'>{translate(languageData, "home")}</h1>
      <Row>
        <Col xs={12} sm={12} lg={6}>
          <Card className='mt-5'>
            <Card.Header className='d-flex justify-content-between border-bottom pb-4'>
              <h3 className='fw-semibold'>{translate(languageData, "todo")}</h3>
            </Card.Header>
            <Card.Body >
              <div className="px-1" style={{ height: '200px', overflowY: 'scroll', overflowX: 'hidden', maxHeight: '200px' }}>
                {toDoList && toDoList.length > 0 ? (
                  <Row className='mt-1'>
                    {toDoList?.map((data, index) => (
                      <Col xs={12} sm={12} key={index}>
                        <Card className='shadow-md mb-1'>
                          <div className='d-flex align-items-center justify-content-between p-1'>
                            <div>
                              <h6 className='mb-0'>{data?.title}</h6>
                              <small className='d-flex'><div className='text-bold'>{translate(languageData, "Action")}</div>: {getActionText(data?.status)} (<span className='text-primary'>{data?.portal}</span>)</small>
                            </div>
                            <div>
                              <Link to={handleRedirect(data)}>
                                <Button className="btn btn-primary mt-1">
                                  <small>{getButtonText(data?.status)}</small>
                                </Button></Link>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div className="text-center">{translate(languageData, "thereAreNoRecordsToDisplay")}</div>
                )}



              </div>

            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card className='mt-5'>
            <Card.Header className='f-flex justify-content-between border-bottom pb-4'>
              <h3 className='fw-semibold'>{translate(languageData, "projectList")}</h3>
              <Button className='btn btn-primary btn-w-md me-2 mt-2' onClick={() => navigate('/addProject')}>{translate(languageData, "AddProject")}</Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <div className=' w-100'>
                  {loading ? <div className='d-flex'>
                    <img src={globalLoader} className='mx-auto mt-1' alt='loader1' />
                  </div> :
                    <div style={{ height: '200px', overflowY: 'scroll', maxHeight: '200px' }}>
                      <DataTable
                        columns={columns}
                        data={tableData}
                        noDataComponent={noDataComponent}
                      />
                    </div>
                  }
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} lg={6}>
          <Card className='mt-5'>
            <Card.Header className='f-flex justify-content-between border-bottom pb-4'>
              <h3 className='fw-semibold'>{translate(languageData, "promotionalList")}</h3>
            </Card.Header>
            <Card.Body >
              <Row>
                <div className='mt-1 w-100'>
                  {loading ? <div className='d-flex'>
                    <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
                  </div> :
                    <div style={{ height: '200px', overflowY: 'scroll', overflowX: 'hidden', maxHeight: '200px' }}>
                      <DataTable
                        columns={columns2}
                        data={tableData2}
                        noDataComponent={noDataComponent}
                      />
                    </div>
                  }
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card className='mt-5'>
            <Card.Header className='d-flex justify-content-between border-bottom pb-4'>
              <h3 className='fw-semibold'>{translate(languageData, "OrdersList")}</h3>
              <Button className='btn btn-primary btn-w-md me-2 mt-2 d-flex justify-content-center' onClick={() => navigate('/orders')}><small>{translate(languageData, "viewAllOrders")}</small></Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <div className='mt-1 w-100'>
                  {loading ? <div className='d-flex'>
                    <img src={globalLoader} className='mx-auto mt-1' alt='loader1' />
                  </div> :
                    <div style={{ height: '200px', overflowY: 'scroll', maxHeight: '200px' }}>
                      <DataTable
                        columns={columns1}
                        data={tableData1}
                        noDataComponent={noDataComponent}
                      />
                    </div>
                  }
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </div>

  )
}

export default Home