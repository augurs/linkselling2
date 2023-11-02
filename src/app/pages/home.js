import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap'
import { useLanguage } from '../Context/languageContext'
import { dashboardprojects } from '../../services/HomeServices/homeService'
import { translate } from '../../utility/helper';
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
    }
  })

  const columns = [
    {
      name: translate(languageData, "ProjectName"),
      selector: row => `${row.name}`, // Add "$" sign before row.price
      sortable: true,
      center: true,
      // width: '180px'
    },
    {
      name: translate(languageData, "no_of_proejct"),
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
        <Link to={`/buyArticles`} className='btn btn-primary btn-pill'>Buy New</Link>
      ),
    },

  ]



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
      selector: row => row.date,

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
        let buttonText = row.status;
        
        switch (row.status) {
          case "PendingForAssing":
            buttonClass = "btn btn-danger btn-pill";
            break;
          case "RequestChanges":
            buttonClass = "btn btn-warning btn-pill";
            break;
          case "Completed":
            buttonClass = "btn btn-primary btn-pill";
            break;
          case "AssignedToWriter":
            buttonClass = "btn btn-info btn-pill";
            break;
          case "CustomerReview":
            buttonClass = "btn btn-success btn-pill";
            break;
          default:
            buttonClass = "btn btn-primary btn-pill";
        }
    
        return (
          <span className={buttonClass}>
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

  return (
    <div className="inner-body" id="content">
      <h1 className='text-center mt-2'>Home</h1>
      <Row>
        <Col xs={12} sm={7}>
          <Card className='mt-5'>
            <Card.Header className='f-flex justify-content-between border-bottom pb-4'>
              <h3 className='fw-semibold'>To do</h3>
            </Card.Header>
            <Card.Body >
              <Row>
                <Col xs={12} sm={4}>
                  <Card className='mt-5 shadow-lg'> {/* Increased shadow with 'shadow-lg' class */}
                    <Card.Header className='f-flex justify-content-between border-bottom pb-4'>
                      <h3 className='fw-semibold'>To do 1.</h3>
                    </Card.Header>
                    <Card.Body>
                      <div className='mb-4'>
                        <h4>Send for verification the article Tajski masaż - co to, zalety,….</h4>
                        <p>Date: ASAP (deadline has expired: 2023-10-25, 14:47)</p>
                        <Button className="btn btn-primary">Complete</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={4}>
                  <Card className='mt-5 shadow-lg'> {/* Increased shadow with 'shadow-lg' class */}
                    <Card.Header className='f-flex justify-content-between border-bottom pb-4'>
                      <h3 className='fw-semibold'>To do 2.</h3>
                    </Card.Header>
                    <Card.Body>
                      <div className='mb-4'>
                        <h4>Supplement the article (brak tytułu) which has been ordered</h4>
                        <p>Date: No deadline</p>
                        <Button className="btn btn-primary">Complete</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={4}>
                  <Card className='mt-5 shadow-lg'> {/* Increased shadow with 'shadow-lg' class */}
                    <Card.Header className='f-flex justify-content-between border-bottom pb-4'>
                      <h3 className='fw-semibold'>To do 3.</h3>
                    </Card.Header>
                    <Card.Body>
                      <div className='mb-4'>
                        <h4>Supplement the article (brak tytułu) which has been ordered</h4>
                        <p>Date: No deadline</p>
                        <Button className="btn btn-primary">Complete</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={5}>
          <Card className='mt-5'>
            <Card.Header className='f-flex justify-content-between border-bottom pb-4'>
              <h3 className='fw-semibold'>Project list  of User</h3>
              <Button className='btn btn-primary btn-w-md me-2 mt-2' onClick={() => navigate('/addProject')}>{translate(languageData, "AddProject")}</Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <div className='mt-5 w-100'>
                  {loading ? <div className='d-flex'>
                    <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
                  </div> :
                    <>
                      <DataTable
                        columns={columns}
                        data={tableData}
                      />
                    </>
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
              <h3 className='fw-semibold'>To do</h3>
            </Card.Header>
            <Card.Body >
              Remain api
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={5}>
          <Card className='mt-5'>
            <Card.Header className='f-flex justify-content-between border-bottom pb-4'>
              <h3 className='fw-semibold'>Order list  of User</h3>
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