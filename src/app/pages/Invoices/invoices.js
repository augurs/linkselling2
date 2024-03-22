import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import { getInvoices } from '../../../services/invoicesServices/invoicesServices'
import { useEffect } from 'react'
import { useState } from 'react'
import globalLoader from '../../../assets/images/loader.svg'
import { Link } from 'react-router-dom'
import { translate } from "../../../utility/helper";
import { useLanguage } from "../../Context/languageContext";
const Invoices = () => {

    const userData = JSON.parse(localStorage.getItem('userData'))
    const accessToken = localStorage.getItem('accessToken')
    const { languageData } = useLanguage();
    const [invoicesList, setInvoicesList] = useState([])
    const [loading, setLoading] = useState(false)

    const columns = [
        {
            name: translate(languageData, 'orderId'),
            selector: row => row.orderId,
            sortable: true,
            center: true,
            // width: '130px'
        },
        {
            name: translate(languageData, 'transactionNumber'),
            selector: row => row.transactionNumber,
            sortable: true,
            center: true,
            //  width: '180px'
        },
        {
            name: translate(languageData, 'invoiceDate'),
            selector: row => row.date,

            sortable: true,
            center: true,
            //  width: '180px'
        },
        {
            name: translate(languageData, 'Action'),
            sortable: true,
            center: true,
            //  width: '180px'
            cell: (row) => (
                <a href={row.invoice} className='btn btn-primary btn-pill' target='_blank'>{translate(languageData, "Invoices")}</a>
            ),
        },

    ]



    useEffect(() => {
        invoicesListServices()
    }, [])



    const invoicesListServices = async () => {
        setLoading(true)
        const res = await getInvoices(accessToken)
        if (res.success === true) {
            setInvoicesList(res.data)
            setLoading(false)
        }
    }
    const tableData = invoicesList.map((item) => {
        const date = new Date(item?.created_at);
        return {
            orderId: item?.payment_id,
            transactionNumber: item?.invoice_number,
            date: date?.toLocaleString(),
            invoice: item?.view_invoice
        }
    })

    console.log(invoicesList, "71");



    const noDataComponent = <div className="text-center">{translate(languageData, "thereAreNoRecordsToDisplay")}</div>;
    return (
        <div className='p-4'>

            <h3 className='mt-3 mb-3'>{translate(languageData, "Invoices")}</h3>
            <div className='mt-5 w-100'>
                {loading ? <div className='d-flex'>
                    <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
                </div> :
                    <>
                        <div className='my-4'>
                            <Row className='flex justify-content-between'>
                                <Col xs={12} sm={6} md={4} >
                                    <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                                        <input className="input100" type="text" name="search" placeholder={translate(languageData, "artilstSearch")} />
                                        <span className="focus-input100"></span>
                                        <span className="symbol-input100">
                                            <i className="zmdi zmdi-search" aria-hidden="true"></i>
                                        </span>
                                    </div>
                                </Col>
                                <Col xs={12} sm={6} md={4}>
                                    <div className="d-flex justify-content-end">
                                        <Link to="/companydata"><Button>{translate(languageData,"myData")}</Button></Link>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <DataTable
                            columns={columns}
                            data={tableData}
                            noDataComponent={noDataComponent}
                        />
                    </>
                }
            </div>

        </div>
    )
}

export default Invoices