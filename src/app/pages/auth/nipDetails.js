import React, { useState } from 'react';
import { Card, Container, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LanguageSelect from '../../Components/Language/languageSelect';
import { updateNip } from '../../../services/authServices/authservices';
import globalLoader from '../../../assets/images/loader.svg';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../Context/languageContext';
import {
  MdHouse,
  MdLocationCity,
  MdAddBusiness,
  MdLocationOn,
  MdOutlineAddHomeWork,
  MdStreetview,
} from 'react-icons/md';

const NipDetails = () => {
  const nipDetails = JSON.parse(localStorage.getItem('nipData'));

  const initialValues = {
    company_name: nipDetails?.company_name,
    city: nipDetails?.city,
    province: nipDetails?.province,
    street: nipDetails?.street,
    property_number: nipDetails?.property_number,
    apartment_number: nipDetails?.apartment_number,
    postal_code: nipDetails?.postal_code,
  };

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { languageData } = useLanguage();

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    let error = {};
    let isValid = true;

  
    Object.keys(formValues).forEach((key) => {
      if (key !== 'apartment_number' && !formValues[key]) {
        error[key] = `${languageData && languageData?.filter((item) => item.title === key)[0]?.value || key} ${languageData?.filter((item) => item.title === 'isRequired')[0]?.value || 'isRequired'}`;
        isValid = false;
      }
    });

    setFormErrors(error);
    return isValid;
  };

  const UpdateNipServices = async () => {
    if (!validate()) {
      toast(languageData?.filter((item) => item.title === 'pleasefillallfield')[0]?.value || 'pleasefillallfield', {
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
    const res = await updateNip(formValues, nipDetails?.user_id);

    if (res?.success === true && res.message === 'Data updated successfully.') {
      toast(languageData?.filter((item) => item.title === 'dataaddedsuccessfully')[0]?.value || 'dataaddedsuccessfully', {
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
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else if (res?.success === false) {
      toast(languageData?.filter((item) => item.title === 'notadded')[0]?.value || 'notadded', {
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
      toast(languageData?.filter((item) => item.title === 'notadded')[0]?.value || 'notadded', {
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
    <div className='ltr login-img'>
      <ToastContainer />
      <div className=' justify-content-end mt-2 me-2 d-none'>
        <LanguageSelect />
      </div>
      <div className='page'>
        <div>
          <Container className='container-login100'>
            <div className='wrap-0login10 p-0'>
              <Card style={{ width: '550px'}}>
                <Card.Body>
                  <Form>
                    <span className='login100-form-title'>
                      <div className='d-flex flex-column gap-2'>
                      {languageData && languageData?.filter((item) => item.title === 'NipDetails')[0]?.value || 'NipDetails'}
                      <small>{nipDetails?.nip_number}</small>
                      </div>
                    </span>
                    
                    {Object.keys(initialValues).map((key) => (
                      <div key={key} className={`wrap-input100 validate-input mb-0 mt-2`}>
                        <input
                          className='input100'
                          type='text'
                          name={key}
                          placeholder={languageData && languageData?.filter((item) => item.title === key)[0]?.value || key}
                          onChange={(e) => handleChange(e)}
                          onKeyUp={() => validate(formValues)}
                          value={formValues[key]}
                        />
                        <span className='focus-input100'></span>
                        <span className='symbol-input100'>
                          {key === 'apartment_number' && <MdHouse />}
                          {key === 'city' && <MdLocationCity />}
                          {/* {key === 'community' && <MdGroups />} */}
                          {key === 'company_name' && <MdAddBusiness />}
                          {/* {key === 'district' && <MdMap />} */}
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
                        <a onClick={() => UpdateNipServices()} className='login100-form-btn btn-primary' style={{ cursor: 'pointer' }}>
                          {languageData && languageData?.filter((item) => item.title === 'updateDetails')[0]?.value || 'updateDetails'}
                        </a>
                      )}
                      <Link to="/" className='login100-form-btn btn-outline-primary' style={{ cursor: 'pointer' }}>
                        {languageData && languageData?.filter((item) => item.title === 'gotologin')[0]?.value || 'gotologin'}
                      </Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default NipDetails;
