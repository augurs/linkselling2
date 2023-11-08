import React from 'react'
import { orderslist } from '../../../services/OrdersServices/ordersServices'
import { useEffect } from 'react'
import { useState } from 'react'
import globalLoader from '../../../assets/images/loader.svg'
import { translate } from '../../../utility/helper'
import { useLanguage } from '../../Context/languageContext'
import DataTable from 'react-data-table-component'
import { FaEye, FaPlus, FaLink } from 'react-icons/fa';
import "./Orders.css";
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
      name: item?.name
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
        let buttonText = "";

        switch (row.status) {
          case "PendingForAssing":
            buttonClass = "btn btn-danger btn-pill";
            buttonText = translate(languageData,"pending");
            break;
          case "RequestChanges":
            buttonClass = "btn btn-warning btn-pill";
            buttonText = translate(languageData,"requestChanges");;
            break;
          case "Completed":
            buttonClass = "btn btn-primary btn-pill";
            buttonText = translate(languageData,"completed");;
            break;
          case "AssignedToWriter":
            buttonClass = "btn btn-info btn-pill";
            buttonText = translate(languageData,"Assigned");;
            break;
          case "CustomerReview":
            buttonClass = "btn btn-success btn-pill";
            buttonText = translate(languageData,"review");;
            break;
          default:
            buttonClass = "btn btn-primary btn-pill";
            buttonText = row.status;
        }

        return (
          <span className={`${buttonClass} d-flex justify-content-center`}>
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