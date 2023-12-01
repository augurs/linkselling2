import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./login.css"
import globalLoader from '../../../assets/images/loader.svg'
import { ToastContainer, toast } from 'react-toastify';
import LanguageSelect from '../../Components/Language/languageSelect';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../Context/languageContext';
import { translate } from '../../../utility/helper';
import { portallinksubmit, portalArticleDetails } from "../../../services/Resubmitarticle/resubmitarticle"


function Portallinkupdatewithid() {
    const { id } = useParams();

    const userData = localStorage.getItem('userData');
    const [link, setLink] = useState('');

    const [loading, setLoading] = useState(false)
    const [portalArticleDetail, setPortalArticleDetail] = useState([])

    const navigate = useNavigate();

    const { t } = useTranslation();
    const { languageData } = useLanguage();


    const language = localStorage.getItem('lang')
    return (
      <>
        <div className='ltr login-img'>
            <ToastContainer />
            <div className='d-flex mt-2 me-2 ms-2 mb-2 justify-content-between'>
                <h2 className='text-white'>{translate(languageData, "articleAddedSuccessfully")}</h2>
                <LanguageSelect />
            </div>
        </div >
        <div className='d-flex flex-column justify-content-center align-items-center' style={{height: "78vh"}}>
          <h1>{translate(languageData, "thanksSubmittingArticle")}</h1>
          <Link to="/"><span>{translate(languageData, "GotoHomePage")}</span></Link>
        </div>
        </>

    );
}

export default Portallinkupdatewithid;
