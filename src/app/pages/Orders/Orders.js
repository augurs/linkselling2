import React from 'react'
import { orderslist } from '../../../services/OrdersServices/ordersServices'
import { useEffect } from 'react'
import { useState } from 'react'
import globalLoader from '../../../assets/images/loader.svg'
import { formatDate, translate } from '../../../utility/helper'
import { useLanguage } from '../../Context/languageContext'
import DataTable from 'react-data-table-component'
import { FaEye, FaPlus, FaLink } from 'react-icons/fa';
import "./Orders.css";
import { Link } from 'react-router-dom'
const Orders = () => {

  const userData = JSON.parse(localStorage.getItem('userData'))
  const { languageData } = useLanguage()

  const [ordersList, setOrdersList] = useState([])
  const [loading, setLoading] = useState(false)

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

  const tableData = ordersList?.map((item) => {
    const date = new Date(item?.created_at);
    return {
      domain: item?.domain,
      price: item?.price,
      project: item?.project,
      date: date?.toLocaleString(),
      status: item?.status,
      name: item?.name,
      id: item?.id
    }
  })

  const columns = [
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
            buttonClass = "btn btn-outline-dark btn-pill";
            buttonText = <small>{translate(languageData, "AcceptPublication")}</small>;
            break;
          default:
            
            buttonText = row.status;
        }

        return (
          <span className={`${buttonClass} d-flex justify-content-center align-items-center`}>
            <small>{buttonText}</small>
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
          <Link to={row.link}>
            <FaLink className="icon-link" />
          </Link>
          <Link to={`/viewArticle/${row.id}`}>
            <FaEye className="icon-view" />
          </Link>
        </div>
      ),
    }

  ]

  return (
    <div className='p-4'>

      <h3 className='mt-3 mb-3 text-center'>{translate(languageData, "OrdersList")}</h3>

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

    </div>
  )
}

export default Orders