import React from 'react'
import { getInvoices } from '../../../services/invoicesServices/invoicesServices'
import { useEffect } from 'react'
import { useState } from 'react'
import globalLoader from '../../../assets/images/loader.svg'
import { translate } from '../../../utility/helper'
import { useLanguage } from '../../Context/languageContext'
import DataTable from 'react-data-table-component'
import { Button, Col, Form, Modal } from 'react-bootstrap'
import {
  MdHouse,
  MdLocationCity,
  MdAddBusiness,
  MdLocationOn,
  MdOutlineAddHomeWork,
  MdStreetview,
} from 'react-icons/md';
import { toast } from 'react-toastify'
import { updateNip } from '../../../services/authServices/authservices'
const Invoices = () => {

  const [invoicesList, setInvoicesList] = useState([])
  const initialValues = {
    company_name: '',
    city: '',
    province: '',
    street: '',
    property_number: '',
    apartment_number: '',
    postal_code: '',
  };

  const userData = JSON.parse(localStorage.getItem('userData'))
  const accessToken = localStorage.getItem('accessToken')
  const { languageData } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [showNipEditModal, setShowNipEditModal] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [loader, setLoader] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  useEffect(() => {
    invoicesListServices()
  }, [])

  const handleEditNipDeatils = () => {
    setFormValues({
      company_name: tableData[0]?.company_name || '',
      city: tableData[0]?.city || '',
      province: tableData[0]?.province || '',
      street: tableData[0]?.street || '',
      property_number: tableData[0]?.property_number || '',
      apartment_number: tableData[0]?.apartment_number || '',
      postal_code: tableData[0]?.postal_code || '',
    });

    setShowNipEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    let error = {};
    let isValid = true;


    Object.keys(formValues).forEach((key) => {
      if (key !== 'apartment_number' && !formValues[key]) {
        error[key] = `${translate(languageData, key)} ${translate(languageData, "isRequired")}`;
        isValid = false;
      }
    });

    setFormErrors(error);
    return isValid;
  };

  const handleShowNipEditModalClose = () => setShowNipEditModal(false);

  const invoicesListServices = async () => {
    setLoading(true)
    const res = await getInvoices(accessToken)
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
      property_number: invoicesList?.property_number,
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
      name: translate(languageData, "streetNo"),
      selector: (row) => row.property_number,
      sortable: true,
      center: true,
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
    {
      name: translate(languageData, "company_name"),
      selector: (row) => row.company_name,
      sortable: true,
      center: true,
      wrap: true,
    },
    {
      name: translate(languageData, "Action"),
      cell: row => <button className='btn btn-primary' onClick={handleEditNipDeatils}>{translate(languageData, "Edit")}</button>,
      center: true,
      sortable: true,
    },
  ];

  const UpdateNipServices = async () => {
    if (!validate()) {
      toast(translate(languageData, "pleasefillallfield"), {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        type: 'error',
      });
      return;
    }

    setLoader(true);
    const res = await updateNip(formValues, userData?.id);

    if (res?.success === true && res.message === 'Data updated successfully.') {
      toast(translate(languageData, "dataaddedsuccessfully"), {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        type: 'success',
      });

      setLoader(false);
      handleShowNipEditModalClose(); 
      invoicesListServices()
    } else if (res?.success === false) {
      toast(translate(languageData, "notadded"), {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        type: 'error',
      });
      setLoader(false);
    } else {
      toast(translate(languageData, "notadded"), {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        type: 'error',
      });
      setLoader(false);
    }
  };

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
            <Modal show={showNipEditModal} onHide={handleShowNipEditModalClose} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>{translate(languageData, 'NipDetails')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <span className='login100-form-title'>
                  {translate(languageData, "NipNumber")} : <small>{tableData[0]?.nip_number}</small>
                  </span>

                  {Object.keys(initialValues).map((key) => (
                    <div key={key} className={`wrap-input100 validate-input mb-0 mt-2`}>
                      <input
                        className='input100'
                        type='text'
                        name={key}
                        placeholder={translate(languageData, key)}
                        onChange={(e) => handleChange(e)}
                        onKeyUp={() => validate(formValues)}
                        value={formValues[key]}
                      />
                      <span className='focus-input100'></span>
                      <span className='symbol-input100'>
                        {key === 'apartment_number' && <MdHouse />}
                        {key === 'city' && <MdLocationCity />}
                        {key === 'company_name' && <MdAddBusiness />}
                        {key === 'postal_code' && <MdLocationOn />}
                        {key === 'property_number' && <MdOutlineAddHomeWork />}
                        {key === 'province' && <MdLocationCity />}
                        {key === 'street' && <MdStreetview />}
                      </span>
                      <div className='mt-1 mb-2 text-danger text-sm-12'>{formErrors[key]}</div>
                    </div>
                  ))}
                  <div className='container-login100-form-btn text-primary gap-3'>
                    {loader ? (
                      <img src={globalLoader} alt='loader' width={50} />
                    ) : (
                      <Button onClick={() => UpdateNipServices()} style={{ cursor: 'pointer' }}>
                        {translate(languageData, "updateDetails")}
                      </Button>
                    )}
                    <Button variant="secondary" onClick={handleShowNipEditModalClose}>
                        {translate(languageData, 'close')}
                      </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </>
        }
      </div>

    </div>
  )
}

export default Invoices