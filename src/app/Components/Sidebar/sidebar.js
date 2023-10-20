import React, { useState } from 'react'
import { BiBookContent } from 'react-icons/bi';
import { PiArticleLight } from 'react-icons/pi';
import { FaEdit } from 'react-icons/fa';
import { BsPencil } from 'react-icons/bs';
import { RiBillFill } from 'react-icons/ri';
import { AiOutlineProject, AiOutlineShopping } from 'react-icons/ai';
import { PiLinkSimpleThin } from 'react-icons/pi';
import { LiaFileInvoiceDollarSolid, LiaFileInvoiceSolid } from 'react-icons/lia';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../Context/languageContext';
import { translate } from '../../../utility/helper';


const Sidebar = ({ sidebarActive }) => {


    const location = useLocation()

    const [menuType, setMenuType] = useState("")
    const [currentPath, setcurrentPath] = useState('')

    const { languageData } = useLanguage()



    const handleSidbarToggle = (type) => {
        if (menuType === "") {
            setMenuType(type)
        } else {
            setMenuType("")
        }

    }

    const handleLinkPath = (path) => {
        setcurrentPath(path)
        setMenuType("")
    }






    return (

        <div className={`sticky ${sidebarActive ? "is_expanded" : ""}`}>
            <div className="app-sidebar__overlay" data-bs-toggle="sidebar"></div>
            <div className="app-sidebar">
                <div className="side-header">
                    {!sidebarActive && <h2 className='mx-auto text-dark'>{translate(languageData, "title")}</h2>}
                </div>
                <div className="main-sidemenu">
                    <div className="slide-left disabled" id="slide-left">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
                        </svg>
                    </div>
                    <ul className="side-menu mt-3">
                        {/* <li className="slide" style={{ cursor: "pointer" }}>
                            <a className="side-menu__item has-link" data-bs-toggle="slide">
                                <span className="side-menu__icon"><BiBookContent size={20} /></span>
                                <span className="side-menu__label ">Treści</span>
                            </a>
                        </li> */}
                        <li className={`slide ${menuType === "articles" ? "is-expanded" : ""}`} style={{ cursor: "pointer" }} onClick={() => handleSidbarToggle("articles")}>
                            <a className={`side-menu__item has-link ${menuType === "articles" ? "is-expanded active" : ""}`} data-bs-toggle="slide">
                                <span className="side-menu__icon"><PiArticleLight size={20} style={{ color: "gray!important" }} /></span>
                                <span className="side-menu__label">{translate(languageData, "sidebarContent")}</span><i class="angle fa fa-angle-right"></i>
                            </a>
                            <ul class="slide-menu">
                                <li class="side-menu-label1"><a href="javascript:void(0)">lista artykułów</a></li>
                                <li><Link to="/articleList" class="slide-item" onClick={() => handleLinkPath("/articleList")}>{translate(languageData, "sidebarListArticle")}</Link></li>
                                <li><Link to="/addArticle" class="slide-item" onClick={() => handleLinkPath("/addArticle")}>{translate(languageData, "SidebarAddArticle")}</Link></li>
                                <li><Link to="/orderArticle" class="slide-item" onClick={() => handleLinkPath("/orderArticle")}>{translate(languageData, "SidebarOrderArticle")}</Link></li>
                                <li><Link to="/requestedArticles" class="slide-item" onClick={() => handleLinkPath("/requestedArticles")}>View Requested Article</Link></li>
                            </ul>
                        </li>
                        {/* <li className="slide" style={{ cursor: "pointer" }}>
                            <a className="side-menu__item has-link" data-bs-toggle="slide">
                                <span className="side-menu__icon"><FaEdit size={20} style={{ color: "gray!important" }} /></span>
                                <span className="side-menu__label">Zamów artykuł</span>
                            </a>
                        </li> */}

                        {/* <li className="slide" style={{ cursor: "pointer" }}>
                            <a className="side-menu__item has-link" data-bs-toggle="slide">
                                <span className="side-menu__icon"><RiBillFill size={20} style={{ color: "gray!important" }} /></span>
                                <span className="side-menu__label">Informacje rozliczeniowe</span>
                            </a>
                        </li> */}
                        <li className={`slide ${menuType === "buylinks" ? "is-expanded" : ""}`} style={{ cursor: "pointer" }} onClick={() => handleSidbarToggle("buylinks")}>
                            <a className={`side-menu__item has-link ${menuType === "articles" ? "is-expanded active" : ""}`} data-bs-toggle="slide">
                                <span className="side-menu__icon"><PiLinkSimpleThin size={20} style={{ color: "gray!important" }} /></span>
                                <span className="side-menu__label">{translate(languageData, "SidebarBuyLink")}</span><i class="angle fa fa-angle-right"></i>
                            </a>
                            <ul class="slide-menu">
                                {/* <li class="side-menu-label1"><a href="javascript:void(0)">lista artykułów</a></li> */}
                                <li><Link to="/articlesInProgress" class="slide-item" onClick={() => handleLinkPath("/articlesInProgress")}>{translate(languageData, "SidebarArticleProgress")}</Link></li>
                                <li><Link to="/readyArticles" class="slide-item" onClick={() => handleLinkPath("/readyArticles")}>{translate(languageData, "SidebarPublishedArticle")}</Link></li>
                                <li><Link to="/buyArticles" class="slide-item" onClick={() => handleLinkPath("/buyArticles")}>{translate(languageData, "SidebarPurchaseItem")}</Link></li>
                                {/* <li><Link to="/addArticle" class="slide-item" onClick={() => handleLinkPath("/addArticle")}>Dodaj artykuł</Link></li>
                                <li><Link to="/orderArticle" class="slide-item" onClick={() => handleLinkPath("/orderArticle")}>Zamów artykuł</Link></li> */}
                            </ul>
                        </li>
                        <li className="slide" style={{ cursor: "pointer" }} >
                            <Link to="/projectList" className={`side-menu__item has-link`} data-bs-toggle="slide" onClick={() => handleLinkPath("/projectList")}>
                                <span className="side-menu__icon"><AiOutlineProject size={20} style={{ color: "gray!important" }} /></span>
                                <span className="side-menu__label">{translate(languageData, "SidebarMyProject")}</span>
                            </Link>
                        </li>
                        <li className="slide" style={{ cursor: "pointer" }}>
                            <Link to='/marketPlace' className="side-menu__item has-link" data-bs-toggle="slide">
                                <span className="side-menu__icon"><AiOutlineShopping size={20} style={{ color: "gray!important" }} /></span>
                                <span className="side-menu__label mt-1">{translate(languageData , "marketPlace")}</span>
                            </Link>
                        </li>
                        <li className="slide" style={{ cursor: "pointer" }}>
                        <Link to='/invoices' className="side-menu__item has-link" data-bs-toggle="slide">
                           
                                <span className="side-menu__icon"><LiaFileInvoiceDollarSolid size={20} style={{ color: "gray!important" }}/></span>
                                <span className="side-menu__label">{translate(languageData, "sidebarInvoices")}</span>

                            </Link>
                        </li>
                        {/* {translate(languageData,"sidebarInvoices")} */}
                        <li className="slide" style={{ cursor: "pointer" }}>
                            <a className="side-menu__item has-link" data-bs-toggle="slide">
                                <span className="side-menu__icon"><BsPencil size={20} style={{ color: "gray!important" }} /></span>
                                <span className="side-menu__label">{translate(languageData, "sidebarAddYourOwnText")}</span>
                            </a>
                        </li>
            

                        {/* Other menu items */}
                        {/* ... */}
                    </ul>
                    <div className="slide-right" id="slide-right">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Sidebar