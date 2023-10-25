import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { getInvoices } from '../../../services/invoicesServices/invoicesServices'
import { useEffect } from 'react'
import { useState } from 'react'
import globalLoader from '../../../assets/images/loader.svg'
import { translate } from '../../../utility/helper'
import { useLanguage } from '../../Context/languageContext'

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

  console.log(invoicesList)

  return (
    <div className='p-4'>

      <h3 className='mt-3 mb-3'>Company Data</h3>
      <div className='mt-5 w-100'>
        {loading ? <div className='d-flex'>
          <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
        </div> :
          <>
            <div className='my-4'>

              <Card className='p-4 text-center'>
                <Card.Title>{invoicesList.company_name}</Card.Title>
                <Card.Body >
                

                  <p className='mb-1'><strong>Apartment_number: </strong> {invoicesList?.apartment_number} </p>
                  <p className='mb-1'><strong> City: </strong> <span className=''>{invoicesList?.city}</span></p>
                  <p className='mb-1'><strong>Community :</strong> {invoicesList?.community}</p>
                  <p className='mb-1'><strong>District :</strong> {invoicesList?.district}</p>
                  <p className='mb-1'><strong>Property_number :</strong> {invoicesList?.property_number}</p>
                  <p className='mb-1'><strong>Province :</strong> {invoicesList?.province}</p>
                  <p className='mb-1'><strong>Street :</strong> {invoicesList?.street}</p>
                  <p className='mb-1'><strong>Postal_code: </strong> {invoicesList?.postal_code} </p>
                </Card.Body>
              </Card>
            </div>

          </>
        }
      </div>

    </div>
  )
}

export default Invoices