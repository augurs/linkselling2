import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap'
import { useLanguage } from '../Context/languageContext'
import { dashboardprojects, dashboardpromotion, todolists } from '../../services/HomeServices/homeService'
import { translate, formatDate } from '../../utility/helper';
import globalLoader from '../../assets/images/loader.svg'
import DataTable from 'react-data-table-component'
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaPlus, FaLink } from 'react-icons/fa';
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
      name: item?.name,
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
      // width: '180px'
    },
    {
      name: translate(languageData, "PortalName"),
      selector: (row) => row.portal,
      sortable: true,
      center: true,
      // width: '180px'
    },
    {
      name: translate(languageData, "oldNewPrice"),
      selector: (row) => `${row.old_price} zł / ${row.old_price} zł`,
      sortable: true,
      center: true,
      // width: '180px'
    },
    {
      name: translate(languageData, "promotionEnd"),
      selector: (row) => row.date,
      sortable: true,
      center: true,
      // width: '180px'
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

  const tableData1 = ordersList?.slice(0,5).map((item) => {
    const date = new Date(item?.created_at);
    return {
      domain: item?.domain,
      price: item?.price,
      project: item?.project,
      date: date?.toLocaleString(),
      status: item?.status,
      name: item?.name
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
      name: translate(languageData, "price"),
      selector: row => `${row.price} zł`, // Add "$" sign before row.price
      sortable: true,
      center: true,
      // width: '180px'
    },

    {
      name: translate(languageData, "artilstProject"),
      selector: row => row.project,

      sortable: true,
      center: true,
      //  width: '180px'
    },
    {
      name: translate(languageData, "dateOfOrder"),
      selector: row => formatDate(row.date),

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
        let buttonClass = "btn btn-primary btn-pill";
        let buttonText = "";

        switch (row.status) {
          case "PendingForAssing":
            buttonClass = "btn btn-danger btn-pill";
            buttonText = <small>{translate(languageData, "PendingForAssing")}</small>;
            break;
          case "Rejected":
            buttonClass = "btn btn-warning btn-pill";
            buttonText = <small>{translate(languageData, "Rejected")}</small>;
            break;
          case "Accepted":
            buttonClass = "btn btn-primary btn-pill";
            buttonText = <small>{translate(languageData, "Accepted")}</small>;
            break;
          case "AssignedToWriter":
            buttonClass = "btn btn-info btn-pill";
            buttonText = <small>{translate(languageData, "AssignedToWriter")}</small>;
            break;
            case "ReadyToPublish":
            buttonClass = "btn btn-warning btn-pill";
            buttonText = <small>{translate(languageData, "ReadyToPublish")}</small>;
            break;
          case "RejectedLink":
            buttonClass = "btn btn-primary btn-pill";
            buttonText = <small>{translate(languageData, "RejectedLink")}</small>;
            break;
          case "Published":
            buttonClass = "btn btn-info btn-pill";
            buttonText = <small>{translate(languageData, "Published")}</small>;
            break;
          case "CustomerReview":
            buttonClass = "btn btn-success btn-pill";
            buttonText = <small>{translate(languageData, "CustomerReview")}</small>;
            break;
          default:
            buttonClass = "btn btn-primary btn-pill";
            buttonText = row.status;
        }

        return (
          <span className={`${buttonClass} d-flex justify-content-center align-items-center`} style={{ minWidth: '135px', minHeight: "35px" }}>
            {buttonText}
          </span>
        );
      },
    }

    ,

    {
      name: translate(languageData, "writingAction"),
      sortable: true,
      center: true,
      cell: (row) => (
        <div className='d-flex gap-2'>
          <a href={row.link} target='_blank'>
            <FaLink className="icon-link" />
          </a>
          <a href={row.viewLink} target='_blank'>
            <FaEye className="icon-view" />
          </a>
          <a href={row.invoice} target='_blank'>
            <FaPlus className="icon-add" />
          </a>
        </div>
      ),
    }

  ]
  //*api 4th section end

  return (
    <div className="inner-body" id="content">
      <h1 className='text-center mt-2'>{translate(languageData, "home")}</h1>
      <Row>
        <Col xs={12} sm={7}>
          <Card className='mt-5'>
            <Card.Header className='d-flex justify-content-between border-bottom pb-4'>
              <h3 className='fw-semibold'>{translate(languageData, "todo")}</h3>
            </Card.Header>
            <Card.Body >
              <div className="px-1" style={{ maxHeight: '346px', overflowY: 'scroll', overflowX: 'hidden' }}>
                <Row>
                  {toDoList?.map((data, index) => (
                    <Col xs={12} sm={4} key={index}>
                      <Card className='mt-5 shadow-lg' >
                        <Card.Body className='d-flex justify-content-center'>
                          <div className='mb-4'>
                            <h4>{data?.title}</h4>
                            <small>Date: {formatDate(data.created_at)}</small>
                            <Button className="btn btn-primary"><small>{data?.status}</small></Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={5}>
          <Card className='mt-5'>
            <Card.Header className='f-flex justify-content-between border-bottom pb-4'>
              <h3 className='fw-semibold'>{translate(languageData, "projectList")}</h3>
              <Button className='btn btn-primary btn-w-md me-2 mt-2' onClick={() => navigate('/addProject')}>{translate(languageData, "AddProject")}</Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <div className=' w-100'>
                  {loading ? <div className='d-flex'>
                    <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
                  </div> :
                    <div style={{ height: '240px', overflowY: 'scroll' }}>
                      <DataTable
                        columns={columns}
                        data={tableData}
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
        <Col xs={12} sm={7}>
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
                    <div style={{ height: '317px', overflowY: 'scroll' }}>
                      <DataTable
                        columns={columns2}
                        data={tableData2}
                      />
                    </div>
                  }
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={5}>
          <Card className='mt-5'>
            <Card.Header className='f-flex justify-content-between border-bottom pb-4'>
              <h3 className='fw-semibold'>{translate(languageData, "OrdersList")}</h3>
              <Button className='btn btn-primary btn-w-md me-2 mt-2' onClick={() => navigate('/orders')}>{translate(languageData, "viewAllOrders")}</Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <div className='mt-1 w-100'>
                  {loading ? <div className='d-flex'>
                    <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
                  </div> :
                    <>
                      <DataTable
                        columns={columns1}
                        data={tableData1}
                      />
                    </>
                  }
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </div >

  )
}

export default Home