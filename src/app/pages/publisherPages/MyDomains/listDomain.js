import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import globalLoader from '../../../../assets/images/loader.svg'
import { translate } from '../../../../utility/helper'
import { useLanguage } from '../../../Context/languageContext'
import DataTable from 'react-data-table-component'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify';
import { MdCancel } from 'react-icons/md';
import { BsFiletypeCsv } from "react-icons/bs";
import { downloadSampledCSV, listDomain, suspendOffer, uploadCSV } from '../../../../services/PublisherServices/MyDomainServices/MyDomainServices'
import FileUpload from '../../../Components/FileUpload/FileUpload'

const DomainList = () => {

  const publisherData = JSON.parse(localStorage.getItem('publisherData'));
  const accessToken = localStorage.getItem('publisherAccessToken');

  const { languageData } = useLanguage()
  const navigate = useNavigate();
  const [domainList, setDomainList] = useState([])
  const [downloadSampledCsv, setDownloadSampledCSV] = useState()
  const [loading, setLoading] = useState(false)
  const [isDataPresent, setIsDataPresent] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    domainListServices()
  }, [])

  useEffect(() => {
    if (selectedFile !== null && selectedFile) {
      uploadCSVServices()
    }
  }, [selectedFile])

  useEffect(() => {
    if (downloadSampledCSV) {
      downloadSampledCSVServices()
    }
  }, [downloadSampledCSV])


  const domainListServices = async () => {
    setLoading(true)
    const res = await listDomain(accessToken)
    if (res.success === true) {
      setDomainList(res?.data)
      setIsDataPresent(res.data.length > 0);
      setLoading(false)
    } else {
      setIsDataPresent(false);
      setLoading(false);
    }
  }

  const suspendOfferServices = async (DomainUrl) => {
    setLoading(true);
    const res = await suspendOffer(DomainUrl, accessToken);
    if (res.success === true) {
      toast(translate(languageData, "suspendOfferSuccessfully"), {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: 'success'
      });
      domainListServices()
      setLoading(false);
    } else if (res.success === false && res.message.url[0] === "The url has already been taken.") {
      toast(`${translate(languageData, "TheurlHasAlreadyBeenTaken")}: ${res?.admin_email}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: 'error'
      });
    } else {
      toast(translate(languageData, "somethingwentwrong"), {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: 'error'
      });
    }

    setLoading(false);
  };

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
    {
      name: translate(languageData, 'writingAction'),
      cell: (row) => (
        <div className='d-flex gap-2'>
          {row?.status == "Active" ?
            <>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip">{translate(languageData, "addOffer")}</Tooltip>}
              >
                <Link to={`/publisher/myOffer/${row.id}`}>
                  <FaPlus className='icon-link' fontSize={16} />
                </Link></OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip">{translate(languageData, "suspendOffer")}</Tooltip>}
              >
                <Link className='d-flex gap-1 align-items-center' onClick={() => suspendOfferServices(row?.url)}>
                  <MdCancel className='icon-link' fontSize={18} />
                </Link></OverlayTrigger></>
            :
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip">{translate(languageData, "addOffer")}</Tooltip>}
              disabled
            >
              <Button disabled className='bg-transparent'>
                <FaPlus className='icon-link' fontSize={16} />
              </Button></OverlayTrigger>}
        </div>
      ),

    },

  ]

  const handleFileChange = (file) => {
    setSelectedFile(file);
  }

  const uploadCSVServices = async () => {
    setLoading(true);
    const res = await uploadCSV(selectedFile, accessToken);
    if (res?.success === true && res?.message === "CSV updated successfully.") {
      toast(translate(languageData, "csvFileUploadSuccessfully"), {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: 'success'
      });
      domainListServices()
      setLoading(false);
    }
    if (res?.success === true && res?.message === "Not found any new records.") {
      toast(translate(languageData, "notFoundAnyNewRecords"), {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: 'error'
      });
      setLoading(false);
    }
    else if (res.success === false && res.message.file[0] === "The file must be a file of type: csv.") {
      toast(`${translate(languageData, "pleaseUploadCsvFile")}: ${res?.admin_email}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: 'error'
      });
      setSelectedFile("")
    } else {
      toast(translate(languageData, "somethingwentwrong"), {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: 'error'
      });
      setSelectedFile(null)
    }

    setLoading(false);
  };

  const downloadSampledCSVServices = async () => {
    setLoading(true)
    const res = await downloadSampledCSV(accessToken)
    if (res.success === true) {
      setDownloadSampledCSV(res?.message)
      setLoading(false)
    } else {
      setLoading(false);
    }
  }

  return (
    <div className='p-4'>
      <ToastContainer />
      <h3 className='mt-3 mb-3 text-center'>{translate(languageData, "listDomain")}</h3>

      <div className='mt-5 w-100'>
        <div className='my-4'>
          <Row className='flex justify-content-between align-items-center'>
            <Col xs={12} sm={6} md={5} >
              <div className="wrap-input100 validate-input mb-0">
                <input className="input100" type="search" name="search" placeholder={translate(languageData, "artilstSearch")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="zmdi zmdi-search" aria-hidden="true"></i>
                </span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={7}>
              <div className="d-flex justify-content-end gap-2">
                <Link onClick={() => navigate("/publisher/addDomain")}><Button>{translate(languageData, "addDomain")}</Button></Link>
                <FileUpload
                  allowedFileExtensions={['.csv']}
                  buttonName={translate(languageData, "uploadCsv")}
                  classNames='file-upload1'
                  getData={handleFileChange}
                  name='document'
                />
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip">{translate(languageData, "downloadSampleCSV")}</Tooltip>}
                ><a href={downloadSampledCsv} download><BsFiletypeCsv fontSize={30} /></a></OverlayTrigger>
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