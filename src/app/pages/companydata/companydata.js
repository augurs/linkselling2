import React from 'react'
import { getInvoices } from '../../../services/invoicesServices/invoicesServices'
import { useEffect } from 'react'
import { useState } from 'react'
import globalLoader from '../../../assets/images/loader.svg'
import { translate } from '../../../utility/helper'
import { useLanguage } from '../../Context/languageContext'
import DataTable from 'react-data-table-component'
const Invoices = () => {

  const userData = JSON.parse(localStorage.getItem('userData'))
  const { languageData } = useLanguage()

  const [invoicesList, setInvoicesList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    invoicesListServices()
  }, [])



  const invoicesListServices = async () => {
    setLoading(true)
    const res = await getInvoices(userData?.id)
    if (res.success === true) {
      setInvoicesList(res?.user_info)
      setLoading(false)
    }
  }

  const tableData = [
      {
        apartment_number: invoicesList?.apartment_number,
        city: invoicesList?.city,
        community: invoicesList?.community,
        company_name: invoicesList?.company_name,
        district: invoicesList?.district,
        postal_code: invoicesList?.postal_code,
        province: invoicesList?.province,
        street: invoicesList?.street,
        nip_number: invoicesList?.nip_number,
      }

  ]

  const columns = [
    {
      name: translate(languageData, "city"),
      selector: (row) => row.city,
      sortable: true,
      center: true,
      wrap: true,
    },
    {
      name: translate(languageData, "community"),
      selector: (row) => row.community,
      sortable: true,
      center: true,
      wrap: true,
    },
    {
      name: translate(languageData, "district"),
      selector: (row) => row.district,
      sortable: true,
      center: true,
      wrap: true,
    },
    {
      name: translate(languageData, "postalCode"),
      selector: (row) => row.postal_code,
      sortable: true,
      center: true,
      wrap: true,
    },
    {
      name: translate(languageData, "province"),
      selector: (row) => row.province,
      sortable: true,
      center: true,
      wrap: true,
    },
    {
      name: translate(languageData, "street"),
      selector: (row) => row.street,
      sortable: true,
      wrap: true,
    },
    {
      name: translate(languageData, "apartmentNumber"),
      selector: (row) => row.apartment_number,
      sortable: true,
      center: true,
      wrap: true,
    },
    {
      name: translate(languageData, "NipNumber"),
      selector: (row) => row.nip_number,
      sortable: true,
      center: true,
      wrap: true,
    },
  ];
  

  return (
    <div className='p-4'>

      <h3 className='mt-3 mb-3 text-center'>{translate(languageData, "companyData")}</h3>

      <div className='mt-5 w-100'>
        {loading ? <div className='d-flex'>
          <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
        </div> :
          <>
          <h4 className='text-center'>{invoicesList?.company_name}</h4>
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

export default Invoices