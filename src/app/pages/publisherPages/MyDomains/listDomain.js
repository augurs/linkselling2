import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import globalLoader from '../../../../assets/images/loader.svg'
import { translate } from '../../../../utility/helper'
import { useLanguage } from '../../../Context/languageContext'
import DataTable from 'react-data-table-component'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Col, Row } from 'react-bootstrap'
import { listDomain } from '../../../../services/PublisherServices/MyDomainServices/MyDomainServices'
const DomainList = () => {

  const publisherData = JSON.parse(localStorage.getItem('publisherData'))
  const { languageData } = useLanguage()
  const navigate = useNavigate();
  const [domainList, setDomainList] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDataPresent, setIsDataPresent] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    domainListServices()
  }, [])

  const domainListServices = async () => {
    setLoading(true)
    const res = await listDomain(publisherData?.user?.id)
    if (res.success === true) {
      setDomainList(res?.data)
      setIsDataPresent(res.data.length > 0);
      setLoading(false)
    } else {
      setIsDataPresent(false);
      setLoading(false);
    }
  }

  const tableData = domainList?.filter((item) =>
    (item?.url && item?.url.toLowerCase().includes(searchTerm.toLowerCase())) ||
    ((typeof item?.our_price === 'number' ? item?.our_price.toString() : item?.our_price) &&
      (typeof item?.our_price === 'number' ? item?.our_price.toString().toLowerCase().includes(searchTerm.toLowerCase()) : item?.our_price)) ||
    (item?.language && typeof item?.language === 'string' && item?.language.toLowerCase().includes(searchTerm.toLowerCase()))
  ).map((item) => {
    return {
      url: item?.url,
      our_price: item?.our_price,
      client_price: item?.client_price,
      language: item?.language,
      id: item?.id,
      ahreTraffic: item?.ahref_traffic,
      Dr: item?.dr,
      status: item?.status
    }
  })

  const columns = [
    {
      name: translate(languageData, "domainName"),
      selector: row => `${row?.url}`,
      sortable: true,
    },
    {
      name: translate(languageData, "ourPrice"),
      selector: row => `${row.our_price} zł`,
      sortable: true,
    },
    {
      name: translate(languageData, "Language"),
      selector: row => `${row.language}`,
      sortable: true,
    },
    {
      name: translate(languageData, "ahrefTraffic"),
      selector: row => `${row.ahreTraffic}`,
      sortable: true,
    },
    {
      name: translate(languageData, "Dr"),
      selector: row => `${row.Dr}`,
      sortable: true,
    },
    {
      name: translate(languageData, "artilstStatus"),
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => {
        let buttonClass = "text-primary";
        let buttonText = "";

        switch (row.status) {
          case "Deactive":
            buttonClass = "text-danger";
            buttonText = <h6>{translate(languageData, "deactive")}</h6>;
            break;
          case "Active":
            buttonClass = "text-primary";
            buttonText = <h6>{translate(languageData, "active")}</h6>;
            break;

          default:
            buttonText = row.status;
        }
        return (
          <span className={`${buttonClass}`}>
            {buttonText}
          </span>
        );
      },
    },

  ]

  return (
    <div className='p-4'>

      <h3 className='mt-3 mb-3 text-center'>{translate(languageData, "listDomain")}</h3>

      <div className='mt-5 w-100'>
        <div className='my-4'>
          <Row className='flex justify-content-between'>
            <Col xs={12} sm={6} md={4} >
              <div className="wrap-input100 validate-input mb-0">
                <input className="input100" type="search" name="search" placeholder={translate(languageData, "artilstSearch")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="zmdi zmdi-search" aria-hidden="true"></i>
                </span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <div className="d-flex justify-content-end">
                <Link onClick={() => navigate("/publisher/addDomain")}><Button>{translate(languageData, "addDomain")}</Button></Link>
              </div>
            </Col>
          </Row>
        </div>
        {loading ? (<div className='d-flex'>
          <img src={globalLoader} className='mx-auto mt-10' alt='loader1' />
        </div>) : isDataPresent ? (
          <>
            <DataTable
              columns={columns}
              data={tableData}
            />
          </>) : (
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

export default DomainList